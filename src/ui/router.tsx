import React from "react";
import { createBrowserRouter } from "react-router";
import Layout from "./layout";
import ExplainTextPage from "./pages/explain-text-page";
import { RouterProvider } from "react-router/dom";
import { SummaryPage } from "./pages/summary-page";
import { SettingsPage } from "./pages/settings-page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, Component: ExplainTextPage },
      { path: "settings", Component: SettingsPage },
      {
        path: "summary/:id",
        Component: SummaryPage,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
