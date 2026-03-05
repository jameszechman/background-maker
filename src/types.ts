export interface ScreenSize {
  label: string;
  width: number;
  height: number;
}

export const SCREEN_SIZES: ScreenSize[] = [
  { label: '3024x1964 (MacBook Pro 14")', width: 3024, height: 1964 },
  { label: '3456x2234 (MacBook Pro 16")', width: 3456, height: 2234 },
  { label: '2560x1600 (MacBook Air)', width: 2560, height: 1600 },
  { label: '2560x1440 (QHD)', width: 2560, height: 1440 },
  { label: '3840x2160 (4K UHD)', width: 3840, height: 2160 },
  { label: '1920x1080 (Full HD)', width: 1920, height: 1080 },
  { label: '5120x2880 (5K)', width: 5120, height: 2880 },
];

export type GradientType = 'linear' | 'radial';

export interface GradientConfig {
  type: GradientType;
  color1: string;
  color2: string;
  angle: number; // for linear
}

export type BackgroundMode = 'solid' | 'gradient';

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

export interface WallpaperConfig {
  screenSize: ScreenSize;
  background: BackgroundConfig;
  borderRadius: number;
  borderPadding: number;
  imageTransform: ImageTransform;
  imageSrc: string | null;
  text: TextConfig;
}

export const DEFAULT_CONFIG: WallpaperConfig = {
  screenSize: SCREEN_SIZES[0],
  background: {
    mode: 'solid',
    solidColor: '#1a1a2e',
    gradient: {
      type: 'linear',
      color1: '#1a1a2e',
      color2: '#16213e',
      angle: 135,
    },
  },
  borderRadius: 24,
  borderPadding: 60,
  imageTransform: { x: 0, y: 0, scale: 1 },
  imageSrc: null,
  text: {
    content: '',
    fontSize: 24,
    color: '#888888',
    fontFamily: '"SF Mono", "Fira Code", "Cascadia Code", "JetBrains Mono", "Courier New", monospace',
    showChevrons: true,
  },
};
