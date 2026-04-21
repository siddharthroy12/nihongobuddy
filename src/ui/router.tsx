import React from "react";
import { createBrowserRouter } from "react-router";
import Layout from "./layout";
import Prompt from "./pages/prompt";
import { RouterProvider } from "react-router/dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [{ index: true, Component: Prompt }],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
