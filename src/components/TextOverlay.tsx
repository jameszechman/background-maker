import type { TextConfig } from '../types';

interface TextOverlayProps {
  config: TextConfig;
  /** True when rendering inside the wallpaper canvas (display mode) */
  display?: boolean;
}

export function TextOverlay({ config, display }: TextOverlayProps) {
  if (!display || !config.content.trim()) return null;

  return (
    <div
      className="text-overlay"
      style={{
        fontSize: `${config.fontSize}px`,
        color: config.color,
        fontFamily: config.fontFamily,
      }}
    >
      {config.showChevrons && (
        <span className="text-overlay__chevron">&lsaquo;</span>
      )}
      <span className="text-overlay__content">{config.content}</span>
      {config.showChevrons && (
        <span className="text-overlay__chevron">&rsaquo;</span>
      )}
    </div>
  );
}
