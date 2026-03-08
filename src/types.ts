export interface ScreenSize {
  label: string;
  width: number;
  height: number;
}

export const SCREEN_SIZES: ScreenSize[] = [
  { label: '3024x1964 (MacBook Pro 14" M1/M2/M3)', width: 3024, height: 1964 },
  { label: '3456x2234 (MacBook Pro 16")', width: 3456, height: 2234 },
  { label: '2560x1664 (MacBook Air 13" M2/M3)', width: 2560, height: 1664 },
  { label: '2560x1600 (MacBook Air 13" M1)', width: 2560, height: 1600 },
  { label: '2880x1800 (MacBook Air 15" M2/M3)', width: 2880, height: 1800 },
  { label: '3024x1964 (MacBook Pro 14" M4)', width: 3024, height: 1964 },
  { label: '3456x2234 (MacBook Pro 16" M4)', width: 3456, height: 2234 },
  { label: "5120x2880 (5K - Studio/Pro Display)", width: 5120, height: 2880 },
  { label: "6016x3384 (Pro Display XDR 6K)", width: 6016, height: 3384 },
  { label: "2560x1440 (QHD)", width: 2560, height: 1440 },
  { label: "3840x2160 (4K UHD)", width: 3840, height: 2160 },
  { label: "1920x1080 (Full HD)", width: 1920, height: 1080 },
  { label: "2560x1080 (UltraWide FHD)", width: 2560, height: 1080 },
  { label: "3440x1440 (UltraWide QHD)", width: 3440, height: 1440 },
  { label: "3840x1080 (UltraWide DUHD)", width: 3840, height: 1080 },
  { label: "5120x1440 (UltraWide 5K)", width: 5120, height: 1440 },
  { label: "3840x1600 (UltraWide UW4K)", width: 3840, height: 1600 },
];

export type GradientType = "linear" | "radial";

export interface GradientConfig {
  type: GradientType;
  color1: string;
  color2: string;
  angle: number; // for linear
}

export type BackgroundMode = "solid" | "gradient";

export interface BackgroundConfig {
  mode: BackgroundMode;
  solidColor: string;
  gradient: GradientConfig;
}

export interface TextConfig {
  content: string;
  fontSize: number;
  color: string;
  fontFamily: string;
  showChevrons: boolean;
}

export interface ImageTransform {
  x: number;
  y: number;
  scale: number;
}

export type ExportFormat = "png" | "jpeg" | "webp";

export interface ExportConfig {
  format: ExportFormat;
  quality: number;
}

export interface WallpaperConfig {
  id: string;
  screenSize: ScreenSize;
  background: BackgroundConfig;
  borderRadius: number;
  borderPadding: number;
  imageTransform: ImageTransform;
  imageSrc: string | null;
  text: TextConfig;
  export: ExportConfig;
}

export function generateId(): string {
  return crypto.randomUUID();
}

export const EXPORT_FORMAT_LABELS: Record<ExportFormat, string> = {
  png: "PNG (lossless)",
  jpeg: "JPEG (smaller)",
  webp: "WebP (smallest)",
};

export const DEFAULT_CONFIG: WallpaperConfig = {
  id: generateId(),
  screenSize: SCREEN_SIZES[0],
  background: {
    mode: "solid",
    solidColor: "#1a1a2e",
    gradient: {
      type: "linear",
      color1: "#1a1a2e",
      color2: "#16213e",
      angle: 135,
    },
  },
  borderRadius: 24,
  borderPadding: 60,
  imageTransform: { x: 0, y: 0, scale: 1 },
  imageSrc: null,
  text: {
    content: "",
    fontSize: 24,
    color: "#888888",
    fontFamily:
      '"SF Mono", "Fira Code", "Cascadia Code", "JetBrains Mono", "Courier New", monospace',
    showChevrons: true,
  },
  export: {
    format: "webp",
    quality: 0.85,
  },
};
