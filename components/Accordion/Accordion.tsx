import React, { useState, useCallback, useMemo } from 'react';

import { cn } from '@/lib/utils';

import styles from './Accordion.module.css';
import AccordionPanel from './AccordionPanel';
import PanelContent from './PanelContent';
import type { IProps, AccordionPanelProps, ParsedPanel } from './types';

const ExpandIcon = ({ isActive }: { isActive: boolean }) => (
  <span
    className="material-symbols-outlined"
    style={{ fontSize: 24, transition: 'transform 0.3s ease' }}
  >
    {isActive ? 'expand_less' : 'expand_more'}
  </span>
);

const parseChildren = (children: React.ReactNode): ParsedPanel[] =>
  React.Children.toArray(children)
    .filter(React.isValidElement)
    .map((child, index) => {
      const panel = child as React.ReactElement<AccordionPanelProps>;
      const key = panel.key || panel.props.key || String(index);
      return {
        key: String(key),
        header: panel.props.header,
        children: panel.props.children,
        disabled: panel.props.disabled || false,
        className: panel.props.className,
        style: panel.props.style,
      };
    });

const getInitialActiveKey = (defaultActiveKey?: string | string[]): string[] => {
  if (defaultActiveKey === undefined) return [];
  return Array.isArray(defaultActiveKey) ? defaultActiveKey : [defaultActiveKey];
};

const Accordion = ({
  defaultActiveKey,
  onChange,
  accordion = false,
  panel = false,
  size = 'middle',
  expandIconPosition = 'end',
  className,
  children,
  ...props
}: IProps) => {
  const [activeKey, setActiveKey] = useState<string[]>(() => getInitialActiveKey(defaultActiveKey));
  const panels = useMemo(() => parseChildren(children), [children]);

  const handlePanelClick = useCallback(
    (panelKey: string) => {
      const panelData = panels.find((p) => p.key === panelKey);
      if (panelData?.disabled) return;

      const isActive = activeKey.includes(panelKey);
      let newActiveKey: string[];

      if (accordion) {
        newActiveKey = isActive ? [] : [panelKey];
      } else {
        newActiveKey = isActive
          ? activeKey.filter((k) => k !== panelKey)
          : [...activeKey, panelKey];
      }

      setActiveKey(newActiveKey);
      onChange?.(accordion ? newActiveKey[0] || '' : newActiveKey);
    },
    [activeKey, accordion, onChange, panels]
  );

  return (
    <div className={cn(styles.accordion, panel && styles.panel, styles[size], className)} {...props}>
      {panels.map((panelData) => {
        const isActive = activeKey.includes(panelData.key);

        return (
          <div
            key={panelData.key}
            className={cn(
              styles.item,
              isActive && styles.active,
              panelData.disabled && styles.disabled,
              panelData.className
            )}
            style={panelData.style}
          >
            <div
              className={cn(styles.header, !panelData.disabled && styles.collapsible, panelData.disabled && styles.headerDisabled)}
              onClick={() => handlePanelClick(panelData.key)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handlePanelClick(panelData.key);
                }
              }}
              role="button"
              aria-expanded={isActive}
              aria-disabled={panelData.disabled}
              tabIndex={panelData.disabled ? -1 : 0}
            >
              {expandIconPosition === 'start' && (
                <span className={cn(styles.icon, styles.iconStart)}>
                  <ExpandIcon isActive={isActive} />
                </span>
              )}
              <span className={styles.headerText}>{panelData.header}</span>
              {expandIconPosition === 'end' && (
                <span className={cn(styles.icon, styles.iconEnd)}>
                  <ExpandIcon isActive={isActive} />
                </span>
              )}
            </div>
            <PanelContent isActive={isActive}>{panelData.children}</PanelContent>
          </div>
        );
      })}
    </div>
  );
};

Accordion.Panel = AccordionPanel;

export default Accordion;
