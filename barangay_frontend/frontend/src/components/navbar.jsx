import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AlertTriangle, LogOut, ChevronDown } from 'lucide-react';
import { tokenStore, authApi } from '../services/api';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const u = tokenStore.getUser();
    const t = tokenStore.getAccess();
    if (u && t) {
      setUser(u);
      setIsLoggedIn(true);
    }
  }, [location]);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = async () => {
    const refresh = tokenStore.getRefresh();
    try {
      if (refresh) await authApi.logout(refresh);
    } catch { /* ignore */ }
    tokenStore.clear();
    setUser(null);
    setIsLoggedIn(false);
    setShowDropdown(false);
    navigate('/');
  };

  const initials = user
    ? `${(user.first_name || '')[0] || ''}${(user.last_name || '')[0] || ''}`.toUpperCase() || user.username?.[0]?.toUpperCase() || 'U'
    : 'U';

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

          {/* Auth Buttons OR User Profile */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-[#1e3a5f] rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{initials}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden sm:block max-w-[100px] truncate">
                    {user?.first_name || user?.username || 'User'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">{user?.username || 'User'}</p>
                      <p className="text-xs text-gray-500 capitalize">{user?.role || 'resident'}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
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