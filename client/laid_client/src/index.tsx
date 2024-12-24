import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app'
import {AuthProvider} from "./providers/AuthProvider.tsx";
import {BrowserRouter as Router} from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <Router>
        <App />
      </Router>
    </AuthProvider>
  </StrictMode>,
)
