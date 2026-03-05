import { HexColorPicker, HexColorInput } from 'react-colorful';
import type { BackgroundConfig, BackgroundMode, GradientType } from '../types';

interface ColorPickerProps {
  config: BackgroundConfig;
  onChange: (config: BackgroundConfig) => void;
}

export function ColorPicker({ config, onChange }: ColorPickerProps) {
  const handleModeChange = (mode: BackgroundMode) => {
    onChange({ ...config, mode });
  };

  const handleSolidColorChange = (color: string) => {
    onChange({ ...config, solidColor: color });
  };

  const handleGradientColor1Change = (color: string) => {
    onChange({
      ...config,
      gradient: { ...config.gradient, color1: color },
    });
  };

  const handleGradientColor2Change = (color: string) => {
    onChange({
      ...config,
      gradient: { ...config.gradient, color2: color },
    });
  };

  const handleGradientTypeChange = (type: GradientType) => {
    onChange({
      ...config,
      gradient: { ...config.gradient, type },
    });
  };

  const handleAngleChange = (angle: number) => {
    onChange({
      ...config,
      gradient: { ...config.gradient, angle },
    });
  };

  return (
    <div className="color-picker">
      <div className="color-picker__mode-toggle">
        <button
          className={`toggle-btn ${config.mode === 'solid' ? 'toggle-btn--active' : ''}`}
          onClick={() => handleModeChange('solid')}
        >
          Solid
        </button>
        <button
          className={`toggle-btn ${config.mode === 'gradient' ? 'toggle-btn--active' : ''}`}
          onClick={() => handleModeChange('gradient')}
        >
          Gradient
        </button>
      </div>

      {config.mode === 'solid' ? (
        <div className="color-picker__solid">
          <HexColorPicker color={config.solidColor} onChange={handleSolidColorChange} />
          <div className="color-picker__input-row">
            <span className="color-picker__hash">#</span>
            <HexColorInput
              color={config.solidColor}
              onChange={handleSolidColorChange}
              className="color-hex-input"
            />
          </div>
        </div>
      ) : (
        <div className="color-picker__gradient">
          <div className="color-picker__gradient-type">
            <button
              className={`toggle-btn toggle-btn--small ${config.gradient.type === 'linear' ? 'toggle-btn--active' : ''}`}
              onClick={() => handleGradientTypeChange('linear')}
            >
              Linear
            </button>
            <button
              className={`toggle-btn toggle-btn--small ${config.gradient.type === 'radial' ? 'toggle-btn--active' : ''}`}
              onClick={() => handleGradientTypeChange('radial')}
            >
              Radial
            </button>
          </div>

          <div className="color-picker__gradient-preview" style={{ background: getGradientCSS(config) }} />

          <div className="color-picker__dual">
            <div className="color-picker__dual-col">
              <label className="control-label">Color 1</label>
              <HexColorPicker color={config.gradient.color1} onChange={handleGradientColor1Change} />
              <div className="color-picker__input-row">
                <span className="color-picker__hash">#</span>
                <HexColorInput
                  color={config.gradient.color1}
                  onChange={handleGradientColor1Change}
                  className="color-hex-input"
                />
              </div>
            </div>
            <div className="color-picker__dual-col">
              <label className="control-label">Color 2</label>
              <HexColorPicker color={config.gradient.color2} onChange={handleGradientColor2Change} />
              <div className="color-picker__input-row">
                <span className="color-picker__hash">#</span>
                <HexColorInput
                  color={config.gradient.color2}
                  onChange={handleGradientColor2Change}
                  className="color-hex-input"
                />
              </div>
            </div>
          </div>

          {config.gradient.type === 'linear' && (
            <div className="control-group">
              <label className="control-label">
                Angle: {config.gradient.angle}deg
              </label>
              <input
                type="range"
                min="0"
                max="360"
                value={config.gradient.angle}
                onChange={(e) => handleAngleChange(Number(e.target.value))}
                className="slider"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function getGradientCSS(config: BackgroundConfig): string {
  if (config.mode === 'solid') {
    return config.solidColor;
  }

  const { type, color1, color2, angle } = config.gradient;
  if (type === 'linear') {
    return `linear-gradient(${angle}deg, ${color1}, ${color2})`;
  }
  return `radial-gradient(circle, ${color1}, ${color2})`;
}
