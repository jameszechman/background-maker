import { HexColorPicker, HexColorInput } from 'react-colorful';
import { ColorPicker } from './ColorPicker';
import type { BackgroundConfig, ExportConfig, ExportFormat, TextConfig, WallpaperConfig } from '../types';
import { EXPORT_FORMAT_LABELS, SCREEN_SIZES } from '../types';

interface ControlPanelProps {
  config: WallpaperConfig;
  onConfigChange: (config: Partial<WallpaperConfig>) => void;
  onExport: () => void;
  onReset: () => void;
  onResetImage: () => void;
  isExporting: boolean;
  hasImage: boolean;
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

export function ControlPanel({
  config,
  onConfigChange,
  onExport,
  onReset,
  onResetImage,
  isExporting,
  hasImage,
  zoom,
  onZoomChange,
}: ControlPanelProps) {
  const handleScreenSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const size = SCREEN_SIZES.find((s) => s.label === e.target.value);
    if (size) onConfigChange({ screenSize: size });
  };

  const handleBackgroundChange = (background: BackgroundConfig) => {
    onConfigChange({ background });
  };

  const handleTextChange = (updates: Partial<TextConfig>) => {
    onConfigChange({ text: { ...config.text, ...updates } });
  };

  const handleExportConfigChange = (updates: Partial<ExportConfig>) => {
    onConfigChange({ export: { ...config.export, ...updates } });
  };

  return (
    <div className="control-panel">
      <div className="control-panel__header">
        <h2>Settings</h2>
      </div>

      <div className="control-panel__body">
        {/* Screen Size */}
        <div className="control-section">
          <h3 className="control-section__title">Screen Size</h3>
          <select
            value={config.screenSize.label}
            onChange={handleScreenSizeChange}
            className="select"
          >
            {SCREEN_SIZES.map((size) => (
              <option key={size.label} value={size.label}>
                {size.label}
              </option>
            ))}
          </select>
        </div>

        {/* Background Color */}
        <div className="control-section">
          <h3 className="control-section__title">Background</h3>
          <ColorPicker config={config.background} onChange={handleBackgroundChange} />
        </div>

        {/* Border Radius */}
        <div className="control-section">
          <h3 className="control-section__title">
            Border Radius: {config.borderRadius}px
          </h3>
          <input
            type="range"
            min="0"
            max="100"
            value={config.borderRadius}
            onChange={(e) => onConfigChange({ borderRadius: Number(e.target.value) })}
            className="slider"
          />
        </div>

        {/* Border Padding */}
        <div className="control-section">
          <h3 className="control-section__title">
            Border Padding: {config.borderPadding}px
          </h3>
          <input
            type="range"
            min="0"
            max="200"
            value={config.borderPadding}
            onChange={(e) => onConfigChange({ borderPadding: Number(e.target.value) })}
            className="slider"
          />
        </div>

        {/* Zoom */}
        {hasImage && (
          <div className="control-section">
            <h3 className="control-section__title">
              Zoom: {zoom.toFixed(2)}x
            </h3>
            <input
              type="range"
              min="0.01"
              max="3"
              step="0.005"
              value={zoom}
              onChange={(e) => onZoomChange(Number(e.target.value))}
              className="slider"
            />
            <button className="btn btn--ghost btn--small" onClick={onReset}>
              Reset Position
            </button>
          </div>
        )}

        {/* Text */}
        <div className="control-section">
          <h3 className="control-section__title">Text (Optional)</h3>
          <input
            type="text"
            value={config.text.content}
            onChange={(e) => handleTextChange({ content: e.target.value })}
            placeholder="e.g. 2 / 10726"
            className="text-input"
          />
          {config.text.content && (
            <>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={config.text.showChevrons}
                  onChange={(e) => handleTextChange({ showChevrons: e.target.checked })}
                />
                Show chevron arrows
              </label>
              <div className="control-group">
                <label className="control-label">
                  Font Size: {config.text.fontSize}px
                </label>
                <input
                  type="range"
                  min="10"
                  max="72"
                  value={config.text.fontSize}
                  onChange={(e) => handleTextChange({ fontSize: Number(e.target.value) })}
                  className="slider"
                />
              </div>
              <div className="control-group">
                <label className="control-label">Text Color</label>
                <div className="color-picker__mini">
                  <HexColorPicker
                    color={config.text.color}
                    onChange={(color) => handleTextChange({ color })}
                  />
                  <div className="color-picker__input-row">
                    <span className="color-picker__hash">#</span>
                    <HexColorInput
                      color={config.text.color}
                      onChange={(color) => handleTextChange({ color })}
                      className="color-hex-input"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Export Format */}
        <div className="control-section">
          <h3 className="control-section__title">Export Format</h3>
          <div className="color-picker__mode-toggle">
            {(Object.keys(EXPORT_FORMAT_LABELS) as ExportFormat[]).map((fmt) => (
              <button
                key={fmt}
                className={`toggle-btn toggle-btn--small ${config.export.format === fmt ? 'toggle-btn--active' : ''}`}
                onClick={() => handleExportConfigChange({ format: fmt })}
              >
                {fmt.toUpperCase()}
              </button>
            ))}
          </div>
          {config.export.format !== 'png' && (
            <div className="control-group">
              <label className="control-label">
                Quality: {Math.round(config.export.quality * 100)}%
              </label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={config.export.quality}
                onChange={(e) => handleExportConfigChange({ quality: Number(e.target.value) })}
                className="slider"
              />
            </div>
          )}
        </div>
      </div>

      <div className="control-panel__footer">
        {hasImage && (
          <button className="btn btn--ghost" onClick={onResetImage}>
            Change Image
          </button>
        )}
        <button
          className="btn btn--primary"
          onClick={onExport}
          disabled={isExporting || !hasImage}
        >
          {isExporting ? (
            <>
              <span className="spinner" />
              Exporting...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download Wallpaper
            </>
          )}
        </button>
      </div>
    </div>
  );
}
