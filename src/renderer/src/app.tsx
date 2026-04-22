import React from "react";
import { ThemeProvider } from "./components/theme-provider";
import { Router } from "./router";
import { Toaster } from "./components/ui/sonner";
export function App() {
  return (
    <ThemeProvider>
      <Toaster />
      <Router />
    </ThemeProvider>
  );
}
