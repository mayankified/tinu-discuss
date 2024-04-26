"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface ThemecontextType {
  mode: string;
  setmode: (mode: string) => void;
}

const Themecontext = createContext<ThemecontextType | undefined>(undefined);
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setmode] = useState("");

  
  const Handlechange = () => {
    if (localStorage.theme === "dark" || (!('theme' in localStorage)&& window.matchMedia('(prefer-color-scheme: dark)').matches)) {
      setmode("dark");
      document.documentElement.classList.add("dark");
    } else {
      setmode("light");
      document.documentElement.classList.remove("dark");
    }
  };
  useEffect(() => {
    Handlechange();
  }, [mode]);

  return (
    <Themecontext.Provider value={{ mode, setmode }}>
      {children}
    </Themecontext.Provider>
  );
}

export function UseTheme() {
  const context = useContext(Themecontext);
  if (context === undefined) {
    throw new Error("usetheme must be used within a Themeprovider");
  }
  return context;
}
