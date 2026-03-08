import { useCallback, useState } from 'react';
import { WallpaperCanvas } from './components/WallpaperCanvas';
import { ControlPanel } from './components/ControlPanel';
import { useImageTransform } from './hooks/useImageTransform';
import { useWallpaperExport } from './hooks/useWallpaperExport';
import { DEFAULT_CONFIG, generateId } from './types';
import type { WallpaperConfig } from './types';
import './App.css';

function App() {
  const [config, setConfig] = useState<WallpaperConfig>(DEFAULT_CONFIG);

  const {
    transform,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleWheel,
    setScale,
    resetTransform,
    isDragging,
  } = useImageTransform(config.imageTransform);

  // Keep config in sync with transform
  const configWithTransform: WallpaperConfig = {
    ...config,
    imageTransform: transform,
  };

  const { canvasRef, exportWallpaper, isExporting } = useWallpaperExport(
    config.screenSize,
    configWithTransform
  );

  const handleConfigChange = useCallback(
    (updates: Partial<WallpaperConfig>) => {
      setConfig((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  const handleImageSelect = useCallback(
    (src: string) => {
      setConfig((prev) => ({ ...prev, id: generateId(), imageSrc: src }));
      setScale(1);
      resetTransform();
    },
    [resetTransform, setScale]
  );

  const handleResetImage = useCallback(() => {
    setConfig((prev) => ({ ...prev, id: generateId(), imageSrc: null }));
    setScale(1);
    resetTransform();
  }, [resetTransform, setScale]);

  const handleZoomChange = useCallback(
    (zoom: number) => {
      setScale(zoom);
    },
    [setScale]
  );

  const handleAutoFit = useCallback(
    (scale: number) => {
      setScale(scale);
    },
    [setScale]
  );

  return (
    <div className="app">
      <header className="app-header">
        <h1>Wallpaper Maker</h1>
        <p className="app-header__subtitle">
          Create beautiful desktop wallpapers with custom backgrounds and borders
        </p>
      </header>
      <main className="app-main">
        <div className="app-main__preview">
          <WallpaperCanvas
            ref={canvasRef}
            config={configWithTransform}
            onImageSelect={handleImageSelect}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onWheel={handleWheel}
            onAutoFit={handleAutoFit}
            isDragging={isDragging}
          />
          {config.imageSrc && (
            <p className="app-main__hint">
              Scroll to zoom &middot; Drag to pan
            </p>
          )}
        </div>
        <ControlPanel
          config={configWithTransform}
          onConfigChange={handleConfigChange}
          onExport={exportWallpaper}
          onReset={resetTransform}
          onResetImage={handleResetImage}
          isExporting={isExporting}
          hasImage={!!config.imageSrc}
          zoom={transform.scale}
          onZoomChange={handleZoomChange}
        />
      </main>
    </div>
  );
}

export default App;
