import { useCallback, useRef, useState } from 'react';
import type { ImageTransform } from '../types';

interface UseImageTransformReturn {
  transform: ImageTransform;
  setTransform: React.Dispatch<React.SetStateAction<ImageTransform>>;
  handlePointerDown: (e: React.PointerEvent) => void;
  handlePointerMove: (e: React.PointerEvent) => void;
  handlePointerUp: () => void;
  handleWheel: (e: React.WheelEvent | WheelEvent) => void;
  setScale: (scale: number) => void;
  resetTransform: () => void;
  isDragging: boolean;
}

export function useImageTransform(
  initialTransform: ImageTransform = { x: 0, y: 0, scale: 1 }
): UseImageTransformReturn {
  const [transform, setTransform] = useState<ImageTransform>(initialTransform);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      setIsDragging(true);
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        tx: transform.x,
        ty: transform.y,
      };
    },
    [transform.x, transform.y]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging || !dragStartRef.current) return;
      e.preventDefault();
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      setTransform((prev) => ({
        ...prev,
        x: dragStartRef.current!.tx + dx,
        y: dragStartRef.current!.ty + dy,
      }));
    },
    [isDragging]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
    dragStartRef.current = null;
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent | WheelEvent) => {
    const delta = (e as WheelEvent).deltaY * -0.001;
    setTransform((prev) => ({
      ...prev,
      scale: Math.min(3, Math.max(0.01, prev.scale + delta)),
    }));
  }, []);

  const setScale = useCallback((scale: number) => {
    setTransform((prev) => ({ ...prev, scale }));
  }, []);

  const resetTransform = useCallback(() => {
    setTransform((prev) => ({ x: 0, y: 0, scale: prev.scale }));
  }, []);

  return {
    transform,
    setTransform,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleWheel,
    setScale,
    resetTransform,
    isDragging,
  };
}
