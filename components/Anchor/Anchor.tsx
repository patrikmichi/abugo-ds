import { useState, useEffect, useRef, useCallback } from 'react';

import { cn } from '@/lib/utils';

import styles from './Anchor.module.css';
import type { IProps, AnchorLinkItem } from './types';

const Anchor = ({
  getContainer,
  offsetTop = 0,
  items = [],
  className,
  ...props
}: IProps) => {
  const [activeLink, setActiveLink] = useState<string>('');
  const registeredLinks = useRef<Set<string>>(new Set());

  const getScrollContainer = useCallback((): HTMLElement | Window => {
    return getContainer?.() ?? window;
  }, [getContainer]);

  const getScrollElement = useCallback((): HTMLElement => {
    const container = getScrollContainer();
    return container === window ? document.documentElement : container as HTMLElement;
  }, [getScrollContainer]);

  useEffect(() => {
    items.forEach((link) => registeredLinks.current.add(link.href));
  }, [items]);

  const updateActiveLink = useCallback(() => {
    const scrollElement = getScrollElement();
    const container = getScrollContainer();
    const scrollTop = container === window
      ? window.pageYOffset || document.documentElement.scrollTop
      : scrollElement.scrollTop;

    let currentLink = '';

    registeredLinks.current.forEach((href) => {
      if (!href.startsWith('#')) return;

      const targetElement = document.getElementById(href.substring(1));
      if (!targetElement) return;

      const rect = targetElement.getBoundingClientRect();
      const containerRect = container === window
        ? { top: 0 }
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
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      if (!href.startsWith('#')) return;

      const targetElement = document.getElementById(href.substring(1));
      if (!targetElement) return;

      const scrollElement = getScrollElement();
      const container = getScrollContainer();
      const rect = targetElement.getBoundingClientRect();
      const containerRect = container === window
        ? { top: 0 }
        : (container as HTMLElement).getBoundingClientRect();

      const scrollTop = container === window
        ? window.pageYOffset || document.documentElement.scrollTop
        : scrollElement.scrollTop;

      const targetTop = rect.top - containerRect.top + scrollTop - offsetTop;

      (container === window ? window : scrollElement).scrollTo({
        top: targetTop,
        behavior: 'smooth',
      });
    },
    [getScrollContainer, getScrollElement, offsetTop]
  );

  return (
    <div
      className={cn(styles.anchor, className)}
      style={{ top: offsetTop ? `${offsetTop}px` : undefined }}
      {...props}
    >
      <div className={styles.links}>
        {items.map((link) => (
          <div key={link.key || link.href} className={styles.linkWrapper}>
            <a
              href={link.href}
              className={cn(styles.link, activeLink === link.href && styles.active)}
              onClick={(e) => handleLinkClick(e, link.href)}
            >
              <span className={styles.linkTitle}>{link.title}</span>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Anchor;
