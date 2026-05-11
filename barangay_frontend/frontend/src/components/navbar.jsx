import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path;
  
  // 🔐 TODO: Replace with your actual authentication state/context later
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-10 h-10 bg-[#1e3a5f] rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#1e3a5f]">AyosBarangay</h1>
                <p className="text-xs text-gray-500">COMMUNITY TRACKER</p>
              </div>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-2">
            <Link
              to="/"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                isActive('/') ? 'bg-[#e8f0fe] text-[#1e3a5f]' : 'text-gray-600 hover:text-[#1e3a5f] hover:bg-gray-100'
              }`}
            >
              Home
            </Link>
            <Link
              to="/report"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                isActive('/report') ? 'bg-[#e8f0fe] text-[#1e3a5f]' : 'text-gray-600 hover:text-[#1e3a5f] hover:bg-gray-100'
              }`}
            >
              Report
            </Link>
            <Link
              to="/emergency"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                isActive('/emergency') 
                  ? 'bg-red-100 text-red-700' 
                  : 'text-red-600 hover:bg-red-50'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Emergency</span>
            </Link>
            <Link
              to="/about"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                isActive('/about') ? 'bg-[#e8f0fe] text-[#1e3a5f]' : 'text-gray-600 hover:text-[#1e3a5f] hover:bg-gray-100'
              }`}
            >
              About
            </Link>
          </div>

          {/* 🔐 Auth Buttons OR User Profile */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              /* ✅ LOGGED IN: Show Profile */
              <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="w-8 h-8 bg-[#1e3a5f] rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">MS</span>
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">Maria S.</span>
              </div>
            ) : (
              /* ❌ NOT LOGGED IN: Show Login & Get Started */
              <>
                <Link 
                  to="/login"
                  className="bg-[#e8f0fe] text-[#1e3a5f] font-medium hover:bg-[#d0e0f5] transition-colors px-5 py-2.5 rounded-lg"
                >
                  Login
                </Link>
                <Link 
                  to="/register"
                  className="bg-[#f97316] hover:bg-orange-600 text-white font-medium px-5 py-2.5 rounded-lg transition-colors shadow-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;