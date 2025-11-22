import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './components/Layout'
import Cars from './pages/Cars'
import CarDetails from './pages/CarDetails'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import About from './pages/About'
import Contact from './pages/Contact'
import Profile from './pages/Profile'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentCancel from './pages/PaymentCancel'
import AdminDashboard from './pages/AdminDashboard'
import Compare from './pages/Compare'
import ComparisonBar from './components/ComparisonBar'
import Wishlist from './pages/Wishlist'
import NotFound from './pages/NotFound'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'


function App() {

  return (
    <>
    <Router>
        <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />}/>
              <Route path="/cars" element={<Cars />} />
              <Route path="/cars/:id" element={<CarDetails />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/payment/success" element={<PaymentSuccess />} />
              <Route path="/payment/cancel" element={<PaymentCancel />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
        <ComparisonBar />
    </Router>
    </>
  )
}

export default App
