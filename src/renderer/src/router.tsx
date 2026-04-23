import { createHashRouter } from 'react-router' // changed
import { RouterProvider } from 'react-router/dom'
import Layout from './layout'
import ExplainTextPage from './pages/explain-text-page'
import { SummaryPage } from './pages/summary-page'
import { SettingsPage } from './pages/settings-page'
import { NotFoundPage } from './pages/not-found'
import { DictionaryPage } from './pages/dictionary-page'

export const router = createHashRouter([
  // changed
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, Component: ExplainTextPage },
      { path: 'settings', Component: SettingsPage },
      { path: 'summary/:id', Component: SummaryPage },
      { path: 'dictionary', Component: DictionaryPage },
      { path: '*', Component: NotFoundPage }
    ]
  }
])

export function Router() {
  return <RouterProvider router={router} />
}
