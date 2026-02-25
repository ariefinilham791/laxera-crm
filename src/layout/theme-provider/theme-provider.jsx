// app/components/theme-provider.jsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";

// Create the context
const ThemeContext = createContext();

// Helper hook to use the context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// The main provider component
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light"); // Default to light

  // On mount, force light theme
  useEffect(() => {
    setTheme("light");
  }, []);

  // Whenever the theme changes, update localStorage and the <html> tag
  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", "light");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme("light");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
