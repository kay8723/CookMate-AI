export const colors = {
  primary: {
    light: '#818cf8',
    main: '#6366f1',
    dark: '#4f46e5',
  },
  success: {
    light: '#34d399',
    main: '#10b981',
    dark: '#059669',
  },
  warning: {
    light: '#fbbf24',
    main: '#f59e0b',
    dark: '#d97706',
  },
  error: {
    light: '#f87171',
    main: '#ef4444',
    dark: '#dc2626',
  },
  grey: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  background: {
    default: '#f3f4f6',
    paper: '#ffffff',
  },
  text: {
    primary: '#1f2937',
    secondary: '#6b7280',
  },
} as const;

export type ColorTheme = typeof colors; 