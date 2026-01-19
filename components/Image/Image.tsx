import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import styles from './Image.module.css';
import { cn } from '@/lib/utils';

export interface ImagePreviewProps {
  /** Whether preview is visible */
  visible?: boolean;
  /** Callback when preview visibility changes */
  onVisibleChange?: (visible: boolean) => void;
  /** Container to render preview in */
  getContainer?: HTMLElement | (() => HTMLElement) | string | false;
  /** Preview image source */
  src?: string;
  /** Preview mask content */
  mask?: React.ReactNode;
  /** Preview mask class name */
  maskClassName?: string;
  /** Current image index (for preview group) */
  current?: number;
  /** Custom preview operations */
  toolbarRender?: (originalNode: React.ReactNode) => React.ReactNode;
}

export interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'onError' | 'onLoad'> {
  /** Image source */
  src?: string;
  /** Alternative text */
  alt?: string;
  /** Image width */
  width?: number | string;
  /** Image height */
  height?: number | string;
  /** Whether to enable preview */
  preview?: boolean | ImagePreviewProps;
  /** Placeholder while loading */
  placeholder?: boolean | React.ReactNode;
  /** Fallback image source */
  fallback?: string;
  /** Whether to lazy load */
  loading?: 'lazy' | 'eager';
  /** Callback when image loads */
  onLoad?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  /** Callback when image fails to load */
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  /** Custom class name */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
  /** Root class name */
  rootClassName?: string;
}

/**
 * Image Component
 * 
 * Enhanced image component with preview, placeholder, and fallback support.
 * 
 * 
 * @example
 * ```tsx
 * <Image
 *   src="/image.jpg"
 *   alt="Description"
 *   width={200}
 *   preview
 *   placeholder
 * />
 * ```
 */
export function Image({
  src,
  alt,
  width,
  height,
  preview = true,
  placeholder = false,
  fallback,
  loading = 'lazy',
  onLoad,
  onError,
  className,
  style,
  rootClassName,
  ...props
}: ImageProps) {
  const [loadingState, setLoadingState] = useState(true);
  const [error, setError] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewSrc, setPreviewSrc] = useState<string | undefined>(src);
  const imgRef = useRef<HTMLImageElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [rotate, setRotate] = useState(0);

  const previewConfig = typeof preview === 'object' ? preview : { visible: previewVisible, onVisibleChange: setPreviewVisible };
  const showPreview = typeof preview === 'boolean' ? preview : true;

  useEffect(() => {
    setPreviewSrc(src);
  }, [src]);

  const handleLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      setLoadingState(false);
      setError(false);
      onLoad?.(e);
    },
    [onLoad]
  );

  const handleError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      setLoadingState(false);
      setError(true);
      onError?.(e);
    },
    [onError]
  );

  const handlePreviewClick = useCallback(() => {
    if (!showPreview) return;
    setPreviewVisible(true);
    previewConfig.onVisibleChange?.(true);
  }, [showPreview, previewConfig]);

  const handleClosePreview = useCallback(() => {
    setPreviewVisible(false);
    setZoom(1);
    setRotate(0);
    previewConfig.onVisibleChange?.(false);
  }, [previewConfig]);

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  }, []);

  const handleRotateLeft = useCallback(() => {
    setRotate((prev) => (prev - 90) % 360);
  }, []);

  const handleRotateRight = useCallback(() => {
    setRotate((prev) => (prev + 90) % 360);
  }, []);

  const handleReset = useCallback(() => {
    setZoom(1);
    setRotate(0);
  }, []);

  // Keyboard handling for preview
  useEffect(() => {
    if (!previewVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClosePreview();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [previewVisible, handleClosePreview]);

  const displaySrc = error && fallback ? fallback : src;
  const showPlaceholder = loadingState && placeholder;

  const getContainerElement = (): HTMLElement => {
    if (previewConfig.getContainer === false) {
      return document.body;
    }
    if (typeof previewConfig.getContainer === 'function') {
      return previewConfig.getContainer();
    }
    if (typeof previewConfig.getContainer === 'string') {
      const element = document.querySelector(previewConfig.getContainer);
      if (element) return element as HTMLElement;
    }
    if (previewConfig.getContainer instanceof HTMLElement) {
      return previewConfig.getContainer;
    }
    return document.body;
  };

  const previewContent = (
    <div
      className={cn(styles.previewMask, !previewVisible && styles.previewMaskHidden)}
      onClick={handleClosePreview}
    >
      <div
        ref={previewRef}
        className={styles.previewContent}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className={styles.previewClose}
          onClick={handleClosePreview}
          aria-label="Close preview"
          title="Close"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 'var(--token-primitive-icon-size-icon-size-3)' }}>
            close
          </span>
        </button>
        <div className={styles.previewImageWrapper}>
          <img
            src={previewConfig.src || previewSrc}
            alt={alt}
            className={styles.previewImage}
            style={{
              transform: `scale(${zoom}) rotate(${rotate}deg)`,
            }}
            className={cn(styles.previewImageTransform)}
          />
        </div>
        <div className={styles.previewToolbar}>
          {previewConfig.toolbarRender ? (
            previewConfig.toolbarRender(
              <>
                <button type="button" className={styles.previewTool} onClick={handleZoomOut} aria-label="Zoom Out" title="Zoom Out">
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                    zoom_out
                  </span>
                </button>
                <button type="button" className={styles.previewTool} onClick={handleZoomIn} aria-label="Zoom In" title="Zoom In">
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                    zoom_in
                  </span>
                </button>
                <button type="button" className={styles.previewTool} onClick={handleRotate} aria-label="Rotate" title="Rotate 90°">
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                    rotate_right
                  </span>
                </button>
                <button type="button" className={styles.previewTool} onClick={handleReset} aria-label="Reset" title="Reset zoom and rotation">
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                    restore
                  </span>
                </button>
              </>
            )
          ) : (
            <>
              <button type="button" className={styles.previewTool} onClick={handleZoomOut} aria-label="Zoom Out">
                <span className={cn('material-symbols-outlined', styles.icon, styles.iconMedium, styles.iconWhite)}>
                  zoom_out
                </span>
              </button>
              <button type="button" className={styles.previewTool} onClick={handleZoomIn} aria-label="Zoom In">
                <span className={cn('material-symbols-outlined', styles.icon, styles.iconMedium, styles.iconWhite)}>
                  zoom_in
                </span>
              </button>
              <button type="button" className={styles.previewTool} onClick={handleRotateLeft} aria-label="Rotate Left">
                <span className={cn('material-symbols-outlined', styles.icon, styles.iconMedium, styles.iconWhite)}>
                  rotate_90_degrees_ccw
                </span>
              </button>
              <button type="button" className={styles.previewTool} onClick={handleRotateRight} aria-label="Rotate Right">
                <span className={cn('material-symbols-outlined', styles.icon, styles.iconMedium, styles.iconWhite)}>
                  rotate_90_degrees_cw
                </span>
              </button>
              <button type="button" className={styles.previewTool} onClick={handleReset} aria-label="Reset">
                <span className={cn('material-symbols-outlined', styles.icon, styles.iconMedium, styles.iconWhite)}>
                  restore
                </span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div
        className={cn(styles.imageWrapper, rootClassName)}
        style={{ width, height }}
      >
        {showPlaceholder && (
          <div className={styles.placeholder}>
            {typeof placeholder === 'boolean' ? (
              <span className="material-symbols-outlined" style={{ fontSize: 'var(--token-primitive-icon-size-icon-size-6)', opacity: 0.3 }}>
                image
              </span>
            ) : (
              placeholder
            )}
          </div>
        )}
        <img
          ref={imgRef}
          src={displaySrc}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            styles.image,
            loadingState && styles.loading,
            error && styles.error,
            showPreview && styles.previewable,
            className
          )}
          style={style}
          {...props}
        />
        {showPreview && !loadingState && !error && (
          <div
            className={cn(styles.previewMaskOverlay, previewConfig.maskClassName)}
            onClick={handlePreviewClick}
          >
            {previewConfig.mask || (
              <span className={cn('material-symbols-outlined', styles.icon, styles.iconSmall, styles.iconWhite)}>
                zoom_in
              </span>
            )}
          </div>
        )}
      </div>
      {previewVisible && createPortal(previewContent, getContainerElement())}
    </>
  );
}

// Preview Group Component
export interface ImagePreviewGroupProps {
  /** Preview configuration */
  preview?: boolean | ImagePreviewProps;
  /** Children images */
  children: React.ReactNode;
}

/**
 * Image Preview Group Component
 * 
 * Groups multiple images for preview navigation.
 */
export function ImagePreviewGroup({ preview = true, children }: ImagePreviewGroupProps) {
  const [current, setCurrent] = useState(0);
  const images = React.Children.toArray(children) as React.ReactElement<ImageProps>[];

  const previewConfig = typeof preview === 'object' ? preview : {};

  const enhancedChildren = React.Children.map(children, (child, index) => {
    if (React.isValidElement<ImageProps>(child)) {
      return React.cloneElement(child, {
        preview: {
          ...previewConfig,
          current: index,
          visible: previewConfig.visible || false,
          onVisibleChange: (visible: boolean) => {
            if (visible) {
              setCurrent(index);
            }
            previewConfig.onVisibleChange?.(visible);
          },
        },
      });
    }
    return child;
  });

  return <>{enhancedChildren}</>;
}

// Attach PreviewGroup to Image
(Image as any).PreviewGroup = ImagePreviewGroup;
