import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import FishBackground from './components/FishBackground';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Orders from './pages/Orders';
import Customers from './pages/Customers';
import Suppliers from './pages/Suppliers';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App(){
  return (
    <div>
      <FishBackground />
      <NavBar />
      <main style={{padding:20}}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/inventory" element={<Inventory/>} />
          <Route path="/orders" element={<Orders/>} />
          <Route path="/customers" element={<Customers/>} />
          <Route path="/suppliers" element={<Suppliers/>} />
          <Route path="/reports" element={<Reports/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup/>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
