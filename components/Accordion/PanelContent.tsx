import { useRef, useState, useEffect } from 'react';

import { cn } from '@/lib/utils';

import styles from './Accordion.module.css';

interface PanelContentProps {
  isActive: boolean;
  children: React.ReactNode;
  destroyInactivePanel?: boolean;
}

const PanelContent = ({ isActive, children }: PanelContentProps) => {
  const innerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!innerRef.current) return;

    if (isActive) {
      setHeight(innerRef.current.offsetHeight);
    } else {
      setHeight(0);
    }
  }, [isActive]);

  return (
    <div
      className={cn(styles.content, isActive && styles.contentActive)}
      style={{ height }}
    >
      <div ref={innerRef} className={styles.contentInner}>
        {children}
      </div>
    </div>
  );
};

export default PanelContent;
