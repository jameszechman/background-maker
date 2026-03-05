import { useCallback, useRef, useState } from 'react';
import type { ScreenSize, WallpaperConfig } from '../types';

interface UseWallpaperExportReturn {
  canvasRef: React.RefObject<HTMLDivElement | null>;
  exportWallpaper: () => Promise<void>;
  isExporting: boolean;
}

async function saveWithTauri(dataUrl: string, filename: string): Promise<boolean> {
  try {
    const { save } = await import('@tauri-apps/plugin-dialog');
    const { writeFile } = await import('@tauri-apps/plugin-fs');
    
    const filePath = await save({
      defaultPath: filename,
      filters: [
        {
          name: 'PNG Image',
          extensions: ['png']
        }
      ]
    });
    
    if (filePath) {
      const base64Data = dataUrl.split(',')[1];
      const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
      await writeFile(filePath, binaryData);
      return true;
    }
  } catch {
    console.warn('Tauri save not available, using browser fallback');
  }
  return false;
}

function saveWithBrowser(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

/**
 * Renders the wallpaper to a canvas and triggers a PNG download.
 * This avoids html-to-image entirely for reliability.
 */
function renderToCanvas(
  config: WallpaperConfig,
  previewEl: HTMLDivElement
): Promise<string> {
  return new Promise((resolve, reject) => {
    const { screenSize, background, borderRadius, borderPadding, imageTransform, imageSrc, text } =
      config;
    const W = screenSize.width;
    const H = screenSize.height;

    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return reject(new Error('Could not get canvas context'));

    // --- 1. Draw background ---
    if (background.mode === 'solid') {
      ctx.fillStyle = background.solidColor;
      ctx.fillRect(0, 0, W, H);
    } else {
      const { type, color1, color2, angle } = background.gradient;
      let grad: CanvasGradient;
      if (type === 'linear') {
        const rad = (angle * Math.PI) / 180;
        const cx = W / 2;
        const cy = H / 2;
        const len = Math.sqrt(W * W + H * H) / 2;
        grad = ctx.createLinearGradient(
          cx - Math.cos(rad) * len,
          cy - Math.sin(rad) * len,
          cx + Math.cos(rad) * len,
          cy + Math.sin(rad) * len
        );
      } else {
        grad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) / 2);
      }
      grad.addColorStop(0, color1);
      grad.addColorStop(1, color2);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    }

    // --- 2. Calculate scale factor from preview to export ---
    const previewRect = previewEl.getBoundingClientRect();
    const scaleFactor = W / previewRect.width;

    // Scaled padding
    const pad = borderPadding * scaleFactor;
    const rad = borderRadius * scaleFactor;

    // Image area — full padding on all sides always
    const imgAreaX = pad;
    const imgAreaY = pad;
    const imgAreaW = W - pad * 2;

    // Measure text area height from the preview DOM
    let textAreaHeight = 0;
    if (text.content.trim()) {
      const textEl = previewEl.querySelector('.text-overlay') as HTMLElement | null;
      if (textEl) {
        textAreaHeight = textEl.getBoundingClientRect().height * scaleFactor;
      }
    }

    // Image takes the space between top padding and (bottom padding - text area)
    // Text sits between the image bottom and the bottom padding edge
    const actualImgAreaH = H - pad * 2 - textAreaHeight;

    // --- 3. Draw image with rounded clip ---
    const drawImage = () => {
      if (!imageSrc) {
        finalize();
        return;
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        ctx.save();

        // Rounded rect clip for image area
        roundedRect(ctx, imgAreaX, imgAreaY, imgAreaW, actualImgAreaH, rad);
        ctx.clip();

        // The image in the preview is centered in the cropper container.
        // We need to find the cropper element to get its dimensions.
        const cropperEl = previewEl.querySelector('.image-cropper') as HTMLElement | null;
        if (!cropperEl) {
          ctx.restore();
          finalize();
          return;
        }

        const cropperRect = cropperEl.getBoundingClientRect();
        const cropperW = cropperRect.width * scaleFactor;
        const cropperH = cropperRect.height * scaleFactor;

        // Center of the image area in export coords
        const centerX = imgAreaX + cropperW / 2;
        const centerY = imgAreaY + cropperH / 2;

        // The image natural size scaled by the user's zoom
        const imgW = img.naturalWidth * imageTransform.scale * scaleFactor;
        const imgH = img.naturalHeight * imageTransform.scale * scaleFactor;

        // Apply user pan (scaled)
        const tx = imageTransform.x * scaleFactor;
        const ty = imageTransform.y * scaleFactor;

        const drawX = centerX - imgW / 2 + tx;
        const drawY = centerY - imgH / 2 + ty;

        ctx.drawImage(img, drawX, drawY, imgW, imgH);
        ctx.restore();
        finalize();
      };
      img.onerror = () => reject(new Error('Failed to load image for export'));
      img.src = imageSrc;
    };

    // --- 4. Draw text ---
    const finalize = () => {
      if (text.content.trim()) {
        const fontSize = text.fontSize * scaleFactor;
        ctx.font = `300 ${fontSize}px "SF Mono", "Fira Code", "Cascadia Code", "JetBrains Mono", "Courier New", monospace`;
        ctx.fillStyle = text.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Text area is below the image: from (pad + actualImgAreaH) to (H - pad)
        // Center of text area:
        const textY = (pad + actualImgAreaH + (H - pad)) / 2;

        if (text.showChevrons) {
          // Measure content width to place chevrons
          const contentWidth = ctx.measureText(text.content).width;
          const chevronGap = fontSize * 2;

          // Chevron font slightly larger, thinner
          const chevronFontSize = fontSize * 1.3;
          ctx.save();
          ctx.globalAlpha = 0.7;
          ctx.font = `200 ${chevronFontSize}px "SF Mono", "Fira Code", "Cascadia Code", "JetBrains Mono", "Courier New", monospace`;
          ctx.fillText('\u2039', W / 2 - contentWidth / 2 - chevronGap, textY);
          ctx.fillText('\u203A', W / 2 + contentWidth / 2 + chevronGap, textY);
          ctx.restore();

          // Main text
          ctx.font = `300 ${fontSize}px "SF Mono", "Fira Code", "Cascadia Code", "JetBrains Mono", "Courier New", monospace`;
          ctx.fillText(text.content, W / 2, textY);
        } else {
          ctx.fillText(text.content, W / 2, textY);
        }
      }

      resolve(canvas.toDataURL('image/png'));
    };

    drawImage();
  });
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export function useWallpaperExport(
  screenSize: ScreenSize,
  config: WallpaperConfig
): UseWallpaperExportReturn {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const exportWallpaper = useCallback(async () => {
    if (!canvasRef.current) return;

    setIsExporting(true);
    try {
      const dataUrl = await renderToCanvas(config, canvasRef.current);
      const filename = `wallpaper-${screenSize.width}x${screenSize.height}.png`;

      const savedWithTauri = await saveWithTauri(dataUrl, filename);
      if (!savedWithTauri) {
        saveWithBrowser(dataUrl, filename);
      }
    } catch (err) {
      console.error('Failed to export wallpaper:', err);
    } finally {
      setIsExporting(false);
    }
  }, [screenSize, config]);

  return {
    canvasRef,
    exportWallpaper,
    isExporting,
  };
}
