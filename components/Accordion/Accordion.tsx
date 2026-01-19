import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import styles from './Accordion.module.css';
import { cn } from '@/lib/utils';

export type AccordionSize = 'small' | 'middle' | 'large';
export type AccordionExpandIconPosition = 'start' | 'end';

export interface AccordionPanelProps {
  /** Unique key for the panel */
  key?: string;
  /** Panel header */
  header?: React.ReactNode;
  /** Panel content */
  children?: React.ReactNode;
  /** Whether the panel is disabled */
  disabled?: boolean;
  /** Custom expand icon */
  expandIcon?: (props: { isActive: boolean }) => React.ReactNode;
  /** Extra content in header */
  extra?: React.ReactNode;
  /** Custom class name */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
}

export interface AccordionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Active panel key(s) (controlled) */
  activeKey?: string | string[] | number | number[];
  /** Default active panel key(s) (uncontrolled) */
  defaultActiveKey?: string | string[] | number | number[];
  /** Callback when active panel changes */
  onChange?: (key: string | string[]) => void;
  /** Accordion mode - only one panel can be expanded at a time */
  accordion?: boolean;
  /** Panel variant - stacked panels with borders between them */
  panel?: boolean;
  /** Size of accordion */
  size?: AccordionSize;
  /** Custom expand icon */
  expandIcon?: (props: { isActive: boolean }) => React.ReactNode;
  /** Position of expand icon */
  expandIconPosition?: AccordionExpandIconPosition;
  /** Whether panels can be collapsed */
  collapsible?: 'header' | 'icon' | boolean;
  /** Destroy inactive panels */
  destroyInactivePanel?: boolean;
  /** Custom class name */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
  /** Children (Accordion.Panel components) */
  children?: React.ReactNode;
}

/**
 * Accordion Panel Component
 * 
 * Individual panel within an Accordion.
 */
function AccordionPanel({
  header,
  children,
  disabled = false,
  expandIcon,
  extra,
  className,
  style,
}: AccordionPanelProps) {
  // This component is used internally by Accordion
  // The actual rendering is handled by Accordion parent
  return null;
}

/**
 * PanelContent component that handles smooth expand/collapse animation
 */
function PanelContent({
  isActive,
  destroyInactivePanel,
  children,
  className,
}: {
  isActive: boolean;
  destroyInactivePanel: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Don't run animation logic if panel is destroyed when inactive
    if (destroyInactivePanel && !isActive) {
      return;
    }

    if (!innerRef.current || !contentRef.current) return;

    if (isActive) {
      // Expand: measure the actual content height including padding
      // First, temporarily set height to auto to measure
      const currentHeight = contentRef.current.scrollHeight;
      contentRef.current.style.height = 'auto';
      const contentHeight = contentRef.current.scrollHeight;
      contentRef.current.style.height = `${currentHeight}px`;
      
      // Force reflow, then animate to full height
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setHeight(contentHeight);
          setIsAnimating(true);
        });
      });
      
      // Reset animating state after animation completes
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300); // Match CSS transition duration
      
      return () => clearTimeout(timer);
    } else {
      // Collapse: get current height, then animate to 0
      const currentHeight = contentRef.current.scrollHeight;
      setHeight(currentHeight);
      setIsAnimating(true);
      
      // Force reflow, then animate to 0
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setHeight(0);
        });
      });
      
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isActive, destroyInactivePanel]);

  // Don't render content if destroyInactivePanel and not active
  // This check comes AFTER hooks to ensure hooks are always called
  if (destroyInactivePanel && !isActive) {
    return null;
  }

  return (
    <div
      ref={contentRef}
      className={cn(styles.content, isActive && styles.contentActive, isAnimating && styles.animating, className)}
      style={{
        height: `${height}px`,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div ref={innerRef} className={styles.contentInner}>
        {children}
      </div>
    </div>
  );
}

/**
 * Accordion Component
 * 
 * Collapsible content panels. 
 * 
 * @example
 * ```tsx
 * <Accordion defaultActiveKey="1" accordion>
 *   <Accordion.Panel key="1" header="Panel 1">
 *     Content 1
 *   </Accordion.Panel>
 *   <Accordion.Panel key="2" header="Panel 2">
 *     Content 2
 *   </Accordion.Panel>
 * </Accordion>
 * ```
 */
export function Accordion({
  defaultActiveKey,
  onChange,
  accordion = false,
  panel = false,
  size = 'middle',
  expandIcon,
  expandIconPosition = 'end',
  collapsible = true,
  destroyInactivePanel = false,
  className,
  style,
  children,
  ...props
}: AccordionProps) {
  const [activeKey, setActiveKey] = useState<string | string[]>(() => {
    if (defaultActiveKey !== undefined) {
      return Array.isArray(defaultActiveKey) ? defaultActiveKey.map(String) : [String(defaultActiveKey)];
    }
    return accordion ? [] : [];
  });

  // Parse children to extract panels
  const panels = useMemo(() => {
    return React.Children.toArray(children)
      .filter((child) => React.isValidElement(child))
      .map((child, index) => {
        const panel = child as React.ReactElement<AccordionPanelProps>;
        const key = panel.key || panel.props.key || String(index);
        return {
          key: String(key),
          header: panel.props.header,
          children: panel.props.children,
          disabled: panel.props.disabled || false,
          expandIcon: panel.props.expandIcon || expandIcon,
          extra: panel.props.extra,
          className: panel.props.className,
          style: panel.props.style,
        };
      });
  }, [children, expandIcon]);

  const handlePanelClick = useCallback(
    (panelKey: string) => {
      if (panels.find((p) => p.key === panelKey)?.disabled) return;

      let newActiveKey: string[];

      if (accordion) {
        // Accordion mode: only one panel can be open
        const isActive = activeKey.includes(panelKey);
        if (collapsible === false && !isActive) {
          // If not collapsible and panel is not active, open it
          newActiveKey = [panelKey];
        } else if (collapsible === false && isActive) {
          // If not collapsible and panel is active, do nothing
          return;
        } else {
          // Toggle: if active, close it; if not active, open it
          newActiveKey = isActive ? [] : [panelKey];
        }
      } else {
        // Multiple panels can be open
        const activeKeyArray = Array.isArray(activeKey) ? activeKey : [activeKey];
        const isActive = activeKeyArray.includes(panelKey);
        if (collapsible === false && !isActive) {
          newActiveKey = [...activeKeyArray, panelKey];
        } else if (collapsible === false && isActive) {
          return;
        } else {
          newActiveKey = isActive ? activeKeyArray.filter((k: string) => k !== panelKey) : [...activeKeyArray, panelKey];
        }
      }

      setActiveKey(newActiveKey);
      onChange?.(accordion ? (newActiveKey[0] || '') : newActiveKey);
    },
    [activeKey, accordion, collapsible, onChange, panels]
  );

  const defaultExpandIcon = (isActive: boolean) => (
    <span
      className="material-symbols-outlined"
      style={{
        fontSize: '24px',
        width: '24px',
        height: '24px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 0.3s ease',
      }}
    >
      {isActive ? 'expand_less' : 'expand_more'}
    </span>
  );

  return (
    <div
      className={cn(
        styles.accordion,
        panel && styles.panel,
        styles[size],
        className
      )}
      style={style}
      {...props}
    >
      {panels.map((panel) => {
        const isActive = activeKey.includes(panel.key);
        const canCollapse = collapsible !== false && (collapsible === 'header' || collapsible === true || collapsible === 'icon');
        const canClickHeader = collapsible === 'header' || collapsible === true || collapsible === false;

        return (
          <div
            key={panel.key}
            className={cn(
              styles.panel,
              isActive && styles.active,
              panel.disabled && styles.disabled,
              panel.className
            )}
            style={panel.style}
          >
            <div
              className={cn(
                styles.header,
                canCollapse && styles.collapsible,
                panel.disabled && styles.headerDisabled
              )}
              onClick={() => {
                if (canClickHeader) {
                  handlePanelClick(panel.key);
                }
              }}
              role="button"
              aria-expanded={isActive}
              aria-disabled={panel.disabled}
              tabIndex={panel.disabled ? -1 : 0}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && canCollapse) {
                  e.preventDefault();
                  handlePanelClick(panel.key);
                }
              }}
            >
              {expandIconPosition === 'start' && (
                <span
                  className={cn(styles.icon, styles.iconStart)}
                  onClick={(e) => {
                    if (collapsible === 'icon') {
                      e.stopPropagation();
                      handlePanelClick(panel.key);
                    }
                  }}
                >
                  {panel.expandIcon ? panel.expandIcon({ isActive }) : defaultExpandIcon(isActive)}
                </span>
              )}
              <span className={styles.headerText}>{panel.header}</span>
              {panel.extra && <span className={styles.extra}>{panel.extra}</span>}
              {expandIconPosition === 'end' && (
                <span
                  className={cn(styles.icon, styles.iconEnd)}
                  onClick={(e) => {
                    if (collapsible === 'icon') {
                      e.stopPropagation();
                      handlePanelClick(panel.key);
                    }
                  }}
                >
                  {panel.expandIcon ? panel.expandIcon({ isActive }) : defaultExpandIcon(isActive)}
                </span>
              )}
            </div>
            <PanelContent
              isActive={isActive}
              destroyInactivePanel={destroyInactivePanel}
            >
              {panel.children}
            </PanelContent>
          </div>
        );
      })}
    </div>
  );
}

// Attach Panel sub-component
(Accordion as any).Panel = AccordionPanel;
