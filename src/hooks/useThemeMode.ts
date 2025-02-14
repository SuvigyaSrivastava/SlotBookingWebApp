import { useState, useMemo } from 'react';
import { createTheme, PaletteMode } from '@mui/material';

export const useThemeMode = () => {
  const [mode, setMode] = useState<PaletteMode>('light');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#9333ea', // Purple
          },
          secondary: {
            main: '#7e22ce', // Darker Purple
          },
          background: {
            default: mode === 'light' ? '#f3f4f6' : '#1a1a1a',
            paper: mode === 'light' ? '#ffffff' : '#262626',
          },
        },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                borderRadius: '8px',
              },
            },
          },
        },
      }),
    [mode]
  );

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return { mode, theme, toggleTheme };
};