import React, { useState, useEffect, useRef, useCallback, useMemo, createContext, useContext } from 'react';
import styles from './Anchor.module.css';
import { cn } from '@/lib/utils';

export interface AnchorLinkItem {
  key: string;
  href: string;
  title: React.ReactNode;
  children?: AnchorLinkItem[];
}

export interface AnchorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  /** Affix mode */
  affix?: boolean;
  /** Bounding distance of anchor area */
  bounds?: number;
  /** Get scroll container */
  getContainer?: () => HTMLElement | Window;
  /** Offset from top when calculating scroll position */
  offsetTop?: number;
  /** Callback when link is clicked */
  onClick?: (e: React.MouseEvent<HTMLElement>, link: { title: React.ReactNode; href: string }) => void;
  /** Custom function to get current anchor */
  getCurrentAnchor?: (activeLink: string) => string;
  /** Anchor items */
  items?: AnchorLinkItem[];
  /** Custom class name */
  className?: string;
  /** Children (Anchor.Link components) */
  children?: React.ReactNode;
}

interface AnchorContextValue {
  activeLink: string;
  onClick?: (e: React.MouseEvent<HTMLElement>, link: { title: React.ReactNode; href: string }) => void;
  registerLink: (href: string) => void;
}

const AnchorContext = createContext<AnchorContextValue | null>(null);

/**
 * Anchor Component
 * 
 * Anchor component for navigation. 
 * 
 * @example
 * ```tsx
 * <Anchor
 *   affix
 *   offsetTop={100}
 *   items={[
 *     { key: '1', href: '#section1', title: 'Section 1' },
 *     { key: '2', href: '#section2', title: 'Section 2' },
 *   ]}
 * />
 * ```
 */
export function Anchor({
  affix = true,
  bounds = 5,
  getContainer,
  offsetTop = 0,
  onClick,
  getCurrentAnchor,
  items: propItems,
  className,
  children,
  ...props
}: AnchorProps) {
  const [activeLink, setActiveLink] = useState<string>('');
  const [affixed, setAffixed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const registeredLinks = useRef<Set<string>>(new Set());

  const getScrollContainer = useCallback((): HTMLElement | Window => {
    if (getContainer) {
      return getContainer();
    }
    return window;
  }, [getContainer]);

  const getScrollElement = useCallback((): HTMLElement | null => {
    const container = getScrollContainer();
    if (container === window) {
      return document.documentElement;
    }
    return container as HTMLElement;
  }, [getScrollContainer]);

  // Extract items from children if items prop not provided
  const items = useMemo<AnchorLinkItem[]>(() => {
    if (propItems) return propItems;

    if (children) {
      const extractLinks = (child: React.ReactNode): AnchorLinkItem[] => {
        const links: AnchorLinkItem[] = [];
        React.Children.forEach(child, (c) => {
          if (React.isValidElement(c) && (c.type === (AnchorLink as any) || (c.type as any).displayName === 'Anchor.Link')) {
            const props = c.props as AnchorLinkProps;
            links.push({
              key: props.href,
              href: props.href,
              title: props.title,
              children: props.children ? extractLinks(props.children) : undefined,
            });
          }
        });
        return links;
      };
      return extractLinks(children);
    }

    return [];
  }, [propItems, children]);

  // Register all links
  const registerAllLinks = useCallback((links: AnchorLinkItem[]) => {
    links.forEach((link) => {
      registeredLinks.current.add(link.href);
      if (link.children) {
        registerAllLinks(link.children);
      }
    });
  }, []);

  useEffect(() => {
    registerAllLinks(items);
  }, [items, registerAllLinks]);

  // Calculate current active link based on scroll position
  const updateActiveLink = useCallback(() => {
    const scrollElement = getScrollElement();
    if (!scrollElement) return;

    const container = getScrollContainer();
    const scrollTop = container === window
      ? window.pageYOffset || document.documentElement.scrollTop
      : (scrollElement as HTMLElement).scrollTop;

    let currentLink = '';

    // Check each registered link
    registeredLinks.current.forEach((href) => {
      if (!href.startsWith('#')) return;

      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      if (!targetElement) return;

      const rect = targetElement.getBoundingClientRect();
      const containerRect = container === window
        ? { top: 0, left: 0 }
        : (container as HTMLElement).getBoundingClientRect();

      const elementTop = rect.top - containerRect.top + scrollTop;
      const threshold = elementTop - offsetTop - bounds;

      if (scrollTop >= threshold) {
        currentLink = href;
      }
    });

    if (getCurrentAnchor) {
      currentLink = getCurrentAnchor(currentLink);
    }

    if (currentLink !== activeLink) {
      setActiveLink(currentLink);
    }
  }, [getScrollContainer, getScrollElement, offsetTop, bounds, getCurrentAnchor, activeLink]);

  // Handle scroll
  useEffect(() => {
    const container = getScrollContainer();
    container.addEventListener('scroll', updateActiveLink);
    window.addEventListener('resize', updateActiveLink);
    updateActiveLink(); // Initial update

    return () => {
      container.removeEventListener('scroll', updateActiveLink);
      window.removeEventListener('resize', updateActiveLink);
    };
  }, [getScrollContainer, updateActiveLink]);

  // Handle affix
  useEffect(() => {
    if (!affix || !containerRef.current) return;

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setAffixed(scrollTop > offsetTop);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [affix, offsetTop]);

  const handleLinkClick = useCallback(
    (e: React.MouseEvent<HTMLElement>, link: { title: React.ReactNode; href: string }) => {
      e.preventDefault();
      onClick?.(e, link);

      if (!link.href.startsWith('#')) return;

      const targetId = link.href.substring(1);
      const targetElement = document.getElementById(targetId);
      if (!targetElement) return;

      const scrollElement = getScrollElement();
      if (!scrollElement) return;

      const container = getScrollContainer();
      const rect = targetElement.getBoundingClientRect();
      const containerRect = container === window
        ? { top: 0, left: 0 }
        : (container as HTMLElement).getBoundingClientRect();

      const scrollTop = container === window
        ? window.pageYOffset || document.documentElement.scrollTop
        : (scrollElement as HTMLElement).scrollTop;

      const targetTop = rect.top - containerRect.top + scrollTop - offsetTop;

      if (container === window) {
        window.scrollTo({
          top: targetTop,
          behavior: 'smooth',
        });
      } else {
        (scrollElement as HTMLElement).scrollTo({
          top: targetTop,
          behavior: 'smooth',
        });
      }
    },
    [onClick, getScrollContainer, getScrollElement, offsetTop]
  );

  const registerLink = useCallback((href: string) => {
    registeredLinks.current.add(href);
  }, []);

  const contextValue: AnchorContextValue = {
    activeLink,
    onClick: handleLinkClick,
    registerLink,
  };

  const renderLinks = (links: AnchorLinkItem[], level: number = 0): React.ReactNode => {
    return links.map((link) => (
      <div key={link.key || link.href} className={styles.linkWrapper}>
        <AnchorLink
          href={link.href}
          title={link.title}
          active={activeLink === link.href}
          level={level}
        />
        {link.children && link.children.length > 0 && (
          <div className={styles.nested}>
            {renderLinks(link.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <AnchorContext.Provider value={contextValue}>
      <div
        ref={containerRef}
        className={cn(
          styles.anchor,
          affix && affixed && styles.affixed,
          className
        )}
        style={affix && affixed ? { top: `${offsetTop}px` } : undefined}
        {...props}
      >
        {items.length > 0 ? (
          <div className={styles.links}>{renderLinks(items)}</div>
        ) : (
          <div className={styles.links}>{children}</div>
        )}
      </div>
    </AnchorContext.Provider>
  );
}

export interface AnchorLinkProps extends Omit<React.HTMLAttributes<HTMLAnchorElement>, 'title'> {
  /** Link href */
  href: string;
  /** Link title */
  title: React.ReactNode;
  /** Active state (internal) */
  active?: boolean;
  /** Nesting level (internal) */
  level?: number;
}

/**
 * Anchor.Link Component
 * 
 * Individual anchor link component.
 */
export function AnchorLink({
  href,
  title,
  active = false,
  level = 0,
  className,
  onClick,
  ...props
}: AnchorLinkProps) {
  const context = useContext(AnchorContext);

  useEffect(() => {
    if (context) {
      context.registerLink(href);
    }
  }, [href, context]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (context?.onClick) {
      context.onClick(e, { title, href });
    }
    onClick?.(e);
  };

  return (
    <a
      href={href}
      className={cn(
        styles.link,
        active && styles.active,
        level > 0 && styles.nestedLink,
        className
      )}
      onClick={handleClick}
      data-level={level}
      {...props}
    >
      <span className={styles.linkTitle}>{title}</span>
    </a>
  );
}

// Attach Link to Anchor
(Anchor as any).Link = AnchorLink;
