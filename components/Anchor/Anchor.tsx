import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './Anchor.module.css';
import { cn } from '@/lib/utils';

export interface AnchorLinkItem {
  key: string;
  href: string;
  title: React.ReactNode;
}

export interface AnchorProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Get scroll container */
  getContainer?: () => HTMLElement | Window;
  /** Offset from top when calculating scroll position */
  offsetTop?: number;
  /** Anchor items */
  items?: AnchorLinkItem[];
  /** Custom class name */
  className?: string;
}

/**
 * Anchor Component
 *
 * Anchor component for navigation.
 *
 * @example
 * ```tsx
 * <Anchor
 *   offsetTop={100}
 *   items={[
 *     { key: '1', href: '#section1', title: 'Section 1' },
 *     { key: '2', href: '#section2', title: 'Section 2' },
 *   ]}
 * />
 * ```
 */
export function Anchor({
  getContainer,
  offsetTop = 0,
  items = [],
  className,
  ...props
}: AnchorProps) {
  const [activeLink, setActiveLink] = useState<string>('');
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

  // Register all links
  const registerAllLinks = useCallback((links: AnchorLinkItem[]) => {
    links.forEach((link) => {
      registeredLinks.current.add(link.href);
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
      const threshold = elementTop - offsetTop - 5;

      if (scrollTop >= threshold) {
        currentLink = href;
      }
    });

    if (currentLink !== activeLink) {
      setActiveLink(currentLink);
    }
  }, [getScrollContainer, getScrollElement, offsetTop, activeLink]);

  // Handle scroll
  useEffect(() => {
    const container = getScrollContainer();
    container.addEventListener('scroll', updateActiveLink);
    window.addEventListener('resize', updateActiveLink);
    updateActiveLink();

    return () => {
      container.removeEventListener('scroll', updateActiveLink);
      window.removeEventListener('resize', updateActiveLink);
    };
  }, [getScrollContainer, updateActiveLink]);

  const handleLinkClick = useCallback(
    (e: React.MouseEvent<HTMLElement>, link: { title: React.ReactNode; href: string }) => {
      e.preventDefault();

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
    [getScrollContainer, getScrollElement, offsetTop]
  );

  const renderLinks = (links: AnchorLinkItem[]): React.ReactNode => {
    return links.map((link) => (
      <div key={link.key || link.href} className={styles.linkWrapper}>
        <a
          href={link.href}
          className={cn(
            styles.link,
            activeLink === link.href && styles.active
          )}
          onClick={(e) => handleLinkClick(e, { title: link.title, href: link.href })}
        >
          <span className={styles.linkTitle}>{link.title}</span>
        </a>
      </div>
    ));
  };

  return (
    <div
      className={cn(styles.anchor, className)}
      style={{ top: offsetTop ? `${offsetTop}px` : undefined }}
      {...props}
    >
      <div className={styles.links}>{renderLinks(items)}</div>
    </div>
  );
}
