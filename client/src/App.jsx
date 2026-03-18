import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import CustomerDashboard from './pages/CustomerDashboard'
import ProviderDashboard from './pages/ProviderDashboard'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import CustomCursor from './components/CustomCursor'

function App() {
  return (
    <>
      <CustomCursor />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth mode="login" />} />
        <Route path="/register" element={<Auth mode="register" />} />
        <Route path="/dashboard" element={<CustomerDashboard />} />
        <Route path="/provider-dashboard" element={<ProviderDashboard />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </>
  )
}

export default App
