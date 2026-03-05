import React, { useState, useRef, useEffect, useCallback } from 'react';
import styles from './Image.module.css';
import { cn } from '@/lib/utils';
import { ImagePreview } from './ImagePreview';
import type { ImageProps, ImagePreviewGroupProps } from './types';

// Re-export types
export type { ImageProps, ImagePreviewProps, ImagePreviewGroupProps } from './types';

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

  const previewConfig = typeof preview === 'object' ? preview : {};
  const showPreview = preview !== false;

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
    previewConfig.onVisibleChange?.(false);
  }, [previewConfig]);

  const displaySrc = error && fallback ? fallback : src;
  const showPlaceholder = loadingState && placeholder;

  return (
    <>
      <div className={cn(styles.imageWrapper, rootClassName)} style={{ width, height }}>
        {showPlaceholder && (
          <div className={styles.placeholder}>
            {typeof placeholder === 'boolean' ? (
              <span className="material-symbols-outlined" style={{ fontSize: 48, opacity: 0.3 }}>
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
              <span className="material-symbols-outlined">zoom_in</span>
            )}
          </div>
        )}
      </div>
      <ImagePreview
        visible={previewVisible}
        src={previewConfig.src}
        previewSrc={previewSrc}
        alt={alt}
        getContainer={previewConfig.getContainer}
        toolbarRender={previewConfig.toolbarRender}
        onClose={handleClosePreview}
      />
    </>
  );
}

export function ImagePreviewGroup({ preview = true, children }: ImagePreviewGroupProps) {
  const [current, setCurrent] = useState(0);
  const previewConfig = typeof preview === 'object' ? preview : {};

  const enhancedChildren = React.Children.map(children, (child, index) => {
    if (React.isValidElement<ImageProps>(child)) {
      return React.cloneElement(child, {
        preview: {
          ...previewConfig,
          current: index,
          visible: previewConfig.visible || false,
          onVisibleChange: (visible: boolean) => {
            if (visible) setCurrent(index);
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
