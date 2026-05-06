import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/reset.css'
import './styles/theme.css'
import App from './App.tsx'
import { LoadingProvider } from './component/Loading/LoadingContext.tsx'
import { ErrorAreaProvider } from './component/ErrorArea/ErrorAreaContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LoadingProvider>
      <ErrorAreaProvider>
        <App />
      </ErrorAreaProvider>
    </LoadingProvider>
  </StrictMode>,
)
