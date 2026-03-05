import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './Image.module.css';
import { cn } from '@/lib/utils';
import type { ImagePreviewProps } from './types';

interface ImagePreviewInternalProps extends ImagePreviewProps {
  alt?: string;
  previewSrc?: string;
  onClose: () => void;
}

export function ImagePreview({
  visible,
  src,
  previewSrc,
  alt,
  getContainer,
  toolbarRender,
  onClose,
}: ImagePreviewInternalProps) {
  const [zoom, setZoom] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, posX: 0, posY: 0 });
  const imageRef = useRef<HTMLImageElement>(null);

  const MIN_ZOOM = 0.1;
  const MAX_ZOOM = 5;
  const ZOOM_STEP = 0.5;

  const handleZoomIn = useCallback(() => setZoom((prev) => Math.min(prev + ZOOM_STEP, MAX_ZOOM)), []);
  const handleZoomOut = useCallback(() => setZoom((prev) => Math.max(prev - ZOOM_STEP, MIN_ZOOM)), []);
  const handleRotateLeft = useCallback(() => setRotate((prev) => prev - 90), []);
  const handleRotateRight = useCallback(() => setRotate((prev) => prev + 90), []);
  const handleFlipX = useCallback(() => setFlipX((prev) => !prev), []);
  const handleFlipY = useCallback(() => setFlipY((prev) => !prev), []);

  const handleReset = useCallback(() => {
    setZoom(1);
    setRotate(0);
    setFlipX(false);
    setFlipY(false);
    setPosition({ x: 0, y: 0 });
  }, []);

  const handleClose = useCallback(() => {
    handleReset();
    onClose();
  }, [onClose, handleReset]);

  // Mouse wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((prev) => Math.min(Math.max(prev + delta, MIN_ZOOM), MAX_ZOOM));
  }, []);

  // Drag to move
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoom <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      posX: position.x,
      posY: position.y,
    };
  }, [zoom, position]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;
    setPosition({
      x: dragStartRef.current.posX + deltaX,
      y: dragStartRef.current.posY + deltaY,
    });
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Double click to toggle zoom
  const handleDoubleClick = useCallback(() => {
    if (zoom === 1) {
      setZoom(2);
    } else {
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [zoom]);

  // Keyboard handling
  useEffect(() => {
    if (!visible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          handleClose();
          break;
        case '+':
        case '=':
          handleZoomIn();
          break;
        case '-':
          handleZoomOut();
          break;
        case 'ArrowLeft':
          handleRotateLeft();
          break;
        case 'ArrowRight':
          handleRotateRight();
          break;
        case '0':
          handleReset();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [visible, handleClose, handleZoomIn, handleZoomOut, handleRotateLeft, handleRotateRight, handleReset]);

  // Mouse move/up for dragging
  useEffect(() => {
    if (!isDragging) return;

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Lock body scroll when preview is open
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [visible]);

  const getContainerElement = (): HTMLElement => {
    if (getContainer === false) return document.body;
    if (typeof getContainer === 'function') return getContainer();
    if (typeof getContainer === 'string') {
      const element = document.querySelector(getContainer);
      if (element) return element as HTMLElement;
    }
    if (getContainer instanceof HTMLElement) return getContainer;
    return document.body;
  };

  if (!visible) return null;

  const scaleX = flipX ? -1 : 1;
  const scaleY = flipY ? -1 : 1;
  const transformStyle = `translate(${position.x}px, ${position.y}px) scale(${zoom * scaleX}, ${zoom * scaleY}) rotate(${rotate}deg)`;
  const zoomPercent = Math.round(zoom * 100);

  const defaultToolbar = (
    <>
      <button type="button" className={styles.previewTool} onClick={handleFlipX} aria-label="Flip Horizontal">
        <span className={cn('material-symbols-outlined', styles.toolbarIcon)}>
          flip
        </span>
      </button>
      <button type="button" className={styles.previewTool} onClick={handleFlipY} aria-label="Flip Vertical">
        <span className={cn('material-symbols-outlined', styles.toolbarIcon)} style={{ transform: 'rotate(90deg)' }}>
          flip
        </span>
      </button>
      <div className={styles.toolbarDivider} />
      <button type="button" className={styles.previewTool} onClick={handleRotateLeft} aria-label="Rotate Left">
        <span className={cn('material-symbols-outlined', styles.toolbarIcon)}>
          rotate_left
        </span>
      </button>
      <button type="button" className={styles.previewTool} onClick={handleRotateRight} aria-label="Rotate Right">
        <span className={cn('material-symbols-outlined', styles.toolbarIcon)}>
          rotate_right
        </span>
      </button>
      <div className={styles.toolbarDivider} />
      <button type="button" className={styles.previewTool} onClick={handleZoomOut} disabled={zoom <= MIN_ZOOM} aria-label="Zoom Out">
        <span className={cn('material-symbols-outlined', styles.toolbarIcon)}>
          zoom_out
        </span>
      </button>
      <span className={styles.zoomIndicator}>{zoomPercent}%</span>
      <button type="button" className={styles.previewTool} onClick={handleZoomIn} disabled={zoom >= MAX_ZOOM} aria-label="Zoom In">
        <span className={cn('material-symbols-outlined', styles.toolbarIcon)}>
          zoom_in
        </span>
      </button>
    </>
  );

  const previewContent = (
    <div className={styles.previewOverlay}>
      {/* Dark background - clicking closes the preview */}
      <div className={styles.previewBackdrop} onClick={handleClose} />

      {/* Close button - fixed top right */}
      <button
        type="button"
        className={styles.previewCloseButton}
        onClick={handleClose}
        aria-label="Close preview"
      >
        <span className="material-symbols-outlined">close</span>
      </button>

      {/* Image container - centered, takes available space */}
      <div
        className={styles.previewImageContainer}
        onWheel={handleWheel}
      >
        <img
          ref={imageRef}
          src={src || previewSrc}
          alt={alt}
          className={cn(
            styles.previewImage,
            isDragging && styles.previewImageDragging,
            zoom > 1 && styles.previewImageZoomed
          )}
          style={{ transform: transformStyle }}
          onMouseDown={handleMouseDown}
          onDoubleClick={handleDoubleClick}
          draggable={false}
        />
      </div>

      {/* Toolbar - fixed bottom center */}
      <div className={styles.previewToolbarContainer}>
        <div className={styles.previewToolbar}>
          {toolbarRender ? toolbarRender(defaultToolbar) : defaultToolbar}
        </div>
      </div>
    </div>
  );

  return createPortal(previewContent, getContainerElement());
}
