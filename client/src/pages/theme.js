import { createTheme } from '@mui/material/styles';

export const COLORS = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  danger: '#FF3B30',
  background: '#000000',
  surface: '#1C1C1E',
  surfaceLight: '#2C2C2E',
  surfaceDark: '#121212',
  text: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  textTertiary: 'rgba(255, 255, 255, 0.5)',
  border: 'rgba(255, 255, 255, 0.15)',
  accent: '#FF2D55',
  highlight: '#5E5CE6',
  muted: 'rgba(255, 255, 255, 0.1)',
  overlay: 'rgba(0, 0, 0, 0.5)'
};

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: COLORS.primary,
      light: '#5AC8FA',
      dark: '#004DE3',
    },
    secondary: {
      main: COLORS.secondary,
      light: '#7D7AFF',
      dark: '#3634A3',
    },
    success: {
      main: COLORS.success,
      light: '#5ADB9F',
      dark: '#1E8A3E',
    },
    warning: {
      main: COLORS.warning,
      light: '#FFB340',
      dark: '#C66900',
    },
    error: {
      main: COLORS.danger,
      light: '#FF6961',
      dark: '#C50F29',
    },
    background: {
      default: COLORS.background,
      paper: COLORS.surface,
    },
    text: {
      primary: COLORS.text,
      secondary: COLORS.textSecondary,
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      color: COLORS.text,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      letterSpacing: '-0.01em',
      color: COLORS.text,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      color: COLORS.text,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: COLORS.text,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: COLORS.text,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      color: COLORS.text,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      letterSpacing: '0.01em',
      color: COLORS.textSecondary,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      letterSpacing: '0.01em',
      color: COLORS.textSecondary,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: COLORS.text,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      color: COLORS.textSecondary,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: COLORS.background,
          color: COLORS.text,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: COLORS.surface,
          borderBottom: `1px solid ${COLORS.border}`,
          backdropFilter: 'blur(20px)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '8px 16px',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        contained: {
          backgroundColor: COLORS.primary,
          color: COLORS.text,
          '&:hover': {
            backgroundColor: '#0062CC',
          },
        },
        outlined: {
          borderColor: COLORS.border,
          color: COLORS.text,
          '&:hover': {
            borderColor: COLORS.primary,
            backgroundColor: 'rgba(0, 122, 255, 0.1)',
          },
        },
        text: {
          color: COLORS.text,
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: COLORS.surface,
          backgroundImage: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: COLORS.surface,
          border: `1px solid ${COLORS.border}`,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: COLORS.surfaceLight,
            '& fieldset': {
              borderColor: COLORS.border,
            },
            '&:hover fieldset': {
              borderColor: COLORS.primary,
            },
            '&.Mui-focused fieldset': {
              borderColor: COLORS.primary,
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: COLORS.surfaceLight,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: COLORS.border,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: COLORS.primary,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: COLORS.primary,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: COLORS.surfaceLight,
          borderColor: COLORS.border,
          '&:hover': {
            backgroundColor: COLORS.surface,
          },
        },
      },
    },
  },
});

export default theme; 