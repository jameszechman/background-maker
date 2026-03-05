import { forwardRef } from 'react';
import { ImageCropper } from './ImageCropper';
import { ImageDropZone } from './ImageDropZone';
import { TextOverlay } from './TextOverlay';
import { getGradientCSS } from './ColorPicker';
import type { WallpaperConfig } from '../types';

interface WallpaperCanvasProps {
  config: WallpaperConfig;
  onImageSelect: (src: string) => void;
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: () => void;
  onWheel: (e: React.WheelEvent | WheelEvent) => void;
  onAutoFit: (scale: number) => void;
  isDragging: boolean;
}

export const WallpaperCanvas = forwardRef<HTMLDivElement, WallpaperCanvasProps>(
  (
    {
      config,
      onImageSelect,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onWheel,
      onAutoFit,
      isDragging,
    },
    ref
  ) => {
    const { screenSize, background, borderRadius, borderPadding, imageSrc, imageTransform, text } =
      config;
    const aspectRatio = screenSize.width / screenSize.height;

    return (
      <div className="canvas-wrapper">
        <div
          ref={ref}
          className="wallpaper-canvas"
          style={{
            aspectRatio: `${aspectRatio}`,
            background: getGradientCSS(background),
          }}
        >
          <div
            className="wallpaper-canvas__inner"
            style={{
              padding: `${borderPadding}px`,
            }}
          >
            {imageSrc ? (
              <ImageCropper
                src={imageSrc}
                transform={imageTransform}
                borderRadius={borderRadius}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onWheel={onWheel}
                onAutoFit={onAutoFit}
                isDragging={isDragging}
              />
            ) : (
              <div className="wallpaper-canvas__dropzone-wrapper" style={{ borderRadius: `${borderRadius}px` }}>
                <ImageDropZone onImageSelect={onImageSelect} />
              </div>
            )}
            <TextOverlay config={text} display />
          </div>
        </div>
      </div>
    );
  }
);

WallpaperCanvas.displayName = 'WallpaperCanvas';
