import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { ComparisonProvider } from './context/ComparisonContext'
import { WishlistProvider } from './context/WishlistContext'  

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <WishlistProvider> 
        <ComparisonProvider>
          <App />
        </ComparisonProvider>
      </WishlistProvider>
    </AuthProvider>
  </React.StrictMode>,
)
