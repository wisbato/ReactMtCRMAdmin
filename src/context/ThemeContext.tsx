import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
type ThemeColor = 'green' | 'red' | 'orange' | 'blue' | 'yellow' | 'purple' | 'pink' | 'indigo';

interface ThemeContextType {
  theme: Theme;
  themeColor: ThemeColor;
  toggleTheme: () => void;
  setThemeColor: (color: ThemeColor) => void;
  initializeTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Get from localStorage with fallback
    const savedMode = localStorage.getItem('theme-mode');
    return (savedMode as Theme) || 'dark';
  });

  const [themeColor, setThemeColorState] = useState<ThemeColor>(() => {
    // Get from localStorage with fallback
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme as ThemeColor) || 'purple';
  });

  // Initialize theme on mount and apply to DOM
  const initializeTheme = () => {
    const savedTheme = localStorage.getItem('theme') || 'purple';
    const savedMode = localStorage.getItem('theme-mode') || 'dark';
    
    setThemeColorState(savedTheme as ThemeColor);
    setTheme(savedMode as Theme);
    
    // Apply to DOM immediately
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.body.setAttribute('data-mode', savedMode);
    
    // Also apply the class-based approach for backward compatibility
    if (savedMode === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  // Apply theme changes to DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeColor);
    document.body.setAttribute('data-mode', theme);
    
    // Also apply the class-based approach for backward compatibility
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    
    // Save to localStorage
    localStorage.setItem('theme', themeColor);
    localStorage.setItem('theme-mode', theme);
  }, [theme, themeColor]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const setThemeColor = (color: ThemeColor) => {
    setThemeColorState(color);
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      themeColor, 
      toggleTheme, 
      setThemeColor, 
      initializeTheme 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};