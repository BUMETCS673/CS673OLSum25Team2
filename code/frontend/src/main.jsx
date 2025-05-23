import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthContextProvider } from './context/AuthContext.jsx'
import {GoogleOAuthProvider} from '@react-oauth/google';

createRoot(document.getElementById('root')).render(

  <StrictMode>
    <AuthContextProvider>
      <GoogleOAuthProvider clientId='264240017030-b575pgd86756q7lesueroabcch340c70.apps.googleusercontent.com'>
        <App />
      </GoogleOAuthProvider>
    </AuthContextProvider>
  </StrictMode>,
)
