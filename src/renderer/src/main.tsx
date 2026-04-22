import { createRoot } from 'react-dom/client'
import '@renderer/styles/global.css'
import { App } from './app'

// Render your React component instead
const root = createRoot(document.getElementById('root')!)
root.render(<App />)
