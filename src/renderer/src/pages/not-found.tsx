import { useLocation } from 'react-router'

export function NotFoundPage() {
  const location = useLocation()

  return (
    <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '6rem', fontWeight: 700, margin: 0, opacity: 0.15 }}>404</h1>
      <h2 style={{ marginTop: '0.5rem' }}>Page not found</h2>
      <p style={{ color: 'gray', marginTop: '0.5rem' }}>
        No route matches <code>{location.pathname}</code>
      </p>
      <a href="/" style={{ marginTop: '1.5rem', display: 'inline-block' }}>
        ← Go home
      </a>
    </div>
  )
}
