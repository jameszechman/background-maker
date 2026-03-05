import { useCallback, useEffect, useRef } from 'react';
import type { ImageTransform } from '../types';

interface ImageCropperProps {
  src: string;
  transform: ImageTransform;
  borderRadius: number;
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: () => void;
  onWheel: (e: React.WheelEvent | WheelEvent) => void;
  onAutoFit: (scale: number) => void;
  isDragging: boolean;
}

export function ImageCropper({
  src,
  transform,
  borderRadius,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onWheel,
  onAutoFit,
  isDragging,
}: ImageCropperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const hasFitRef = useRef(false);

  // Attach wheel listener with { passive: false } so we can preventDefault
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handler = (e: WheelEvent) => {
      e.preventDefault();
      onWheel(e);
    };

    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, [onWheel]);

  // Reset fit tracking when src changes
  useEffect(() => {
    hasFitRef.current = false;
  }, [src]);

  const handleImageLoad = useCallback(() => {
    if (hasFitRef.current) return;
    const container = containerRef.current;
    const img = imgRef.current;
    if (!container || !img) return;

    const cw = container.clientWidth;
    const ch = container.clientHeight;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    if (iw === 0 || ih === 0) return;

    // Calculate scale to contain the image fully in the container
    const scaleToFit = Math.min(cw / iw, ch / ih);
    hasFitRef.current = true;
    onAutoFit(scaleToFit);
  }, [onAutoFit]);

  return (
    <div
      ref={containerRef}
      className="image-cropper"
      style={{
        borderRadius: `${borderRadius}px`,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <img
        ref={imgRef}
        src={src}
        alt="Wallpaper"
        draggable={false}
        onLoad={handleImageLoad}
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transformOrigin: 'center center',
        }}
      />
    </div>
  );
}
