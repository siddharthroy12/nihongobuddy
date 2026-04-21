import React from "react";
import { createBrowserRouter } from "react-router";
import Layout from "./layout";
import ExplainText from "./pages/explain-text";
import { RouterProvider } from "react-router/dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [{ index: true, Component: ExplainText }],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
