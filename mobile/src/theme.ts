export type ThemeMode = 'light' | 'dark';

export type AppTheme = {
  background: string;
  border: string;
  gold: string;
  muted: string;
  primary: string;
  shadow: string;
  success: string;
  surface: string;
  surfaceAlt: string;
  text: string;
};

const themes: Record<ThemeMode, AppTheme> = {
  light: {
    background: '#EEF4FB',
    border: '#D7E1EF',
    gold: '#FFB800',
    muted: '#64748B',
    primary: '#1E5EFF',
    shadow: '#10203B',
    success: '#0F9D58',
    surface: '#FFFFFF',
    surfaceAlt: '#F8FBFF',
    text: '#0F172A',
  },
  dark: {
    background: '#020617',
    border: '#1E293B',
    gold: '#FFB800',
    muted: '#94A3B8',
    primary: '#4F8CFF',
    shadow: '#000000',
    success: '#34D399',
    surface: '#0F172A',
    surfaceAlt: '#162033',
    text: '#F8FAFC',
  },
};

export const getTheme = (mode: ThemeMode): AppTheme => themes[mode];

export const alpha = (hex: string, opacity: number): string => {
  const value = hex.replace('#', '');
  const normalized =
    value.length === 3
      ? value
          .split('')
          .map((segment) => `${segment}${segment}`)
          .join('')
      : value;
  const intValue = Number.parseInt(normalized, 16);
  const red = (intValue >> 16) & 255;
  const green = (intValue >> 8) & 255;
  const blue = intValue & 255;

  return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
};
