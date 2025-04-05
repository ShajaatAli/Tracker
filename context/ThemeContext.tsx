import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>(systemColorScheme || 'light');

  const colors = {
    light: {
      primary: '#FF0000',
      background: '#FFFFFF',
      card: '#FFFFFF',
      text: '#000000',
      border: '#EEEEEE',
      notification: '#FF0000',
    },
    dark: {
      primary: '#FF0000',
      background: '#000000',
      card: '#1A1A1A',
      text: '#FFFFFF',
      border: '#333333',
      notification: '#FF0000',
    },
  };

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    if (systemColorScheme) {
      setTheme(systemColorScheme as Theme);
    }
  }, [systemColorScheme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors: colors[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 