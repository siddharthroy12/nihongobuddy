import React from "react";
import { ThemeProvider } from "./components/theme-provider";
import { Router } from "./router";
export function App() {
  return (
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  );
}
