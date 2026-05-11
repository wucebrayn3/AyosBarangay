import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import Footer from './components/footer';

// Public Pages
import Home from './pages/home';
import Report from './pages/reports';
import Emergency from './pages/emergency';
import About from './pages/about';
import Login from './pages/Login';   
import Register from './pages/Register'; 

// Admin Layout & Pages
import AdminLayout from './pages/admin/components/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Reports from './pages/admin/Reports';
import Verification from './pages/admin/Verification';
import Emergencies from './pages/admin/emergencies';
import WorkerAssignment from './pages/admin/WorkerAssignment';
import Analytics from './pages/admin/Analytics';
import Feedback from './pages/admin/Feedback';
import History from './pages/admin/History';
import Users from './pages/admin/Users';
import Settings from './pages/admin/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ───────── PUBLIC ROUTES ───────── */}
        <Route path="/" element={
          <>
            <Navbar />
            <Home />
            <Footer />
          </>
        } />
        
        <Route path="/report" element={
          <>
            <Navbar />
            <Report />
            <Footer />
          </>
        } />
        
        <Route path="/emergency" element={
          <>
            <Navbar />
            <Emergency />
            <Footer />
          </>
        } />
        
        <Route path="/about" element={
          <>
            <Navbar />
            <About />
            <Footer />
          </>
        } />

        {/* ───────── ADMIN ROUTES ───────── */}
        {/* AdminLayout wraps all /admin/* routes */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* Overview */}
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Operations */}
          <Route path="reports" element={<Reports />} />
          <Route path="verification" element={<Verification />} />
          <Route path="emergencies" element={<Emergencies />} />
          <Route path="worker-assignment" element={<WorkerAssignment />} />
          
          {/* Insights */}
          <Route path="analytics" element={<Analytics />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="history" element={<History />} />
          
          {/* Administration */}
          <Route path="users" element={<Users />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<div className="p-10 text-center text-gray-500">404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;