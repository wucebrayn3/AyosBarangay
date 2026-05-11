import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#1e3a5f] rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span className="text-xl font-bold text-[#1e3a5f]">AyosBarangay</span>
            </div>
            
            <p className="text-gray-600 leading-relaxed mb-4 max-w-sm">
              A digital platform improving how communities report, track, and resolve barangay-level concerns — transparently and efficiently.
            </p>
            
            <p className="text-sm font-semibold text-[#1e3a5f] bg-blue-50 inline-block px-3 py-1 rounded-md">
              BSIT 3A — Group 1 Capstone Project
            </p>
          </div>

          {/* Links Column */}
          <div className="md:col-span-3">
            <h3 className="text-sm font-bold text-[#1e3a5f] uppercase tracking-wider mb-4">Platform</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-500 hover:text-[#f97316] transition-colors">Community Reports</a></li>
              <li><a href="#" className="text-gray-500 hover:text-[#f97316] transition-colors">Issue Map</a></li>
              <li><a href="#" className="text-gray-500 hover:text-[#f97316] transition-colors">My Profile</a></li>
              <li><a href="#" className="text-gray-500 hover:text-[#f97316] transition-colors">Report</a></li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="md:col-span-3">
            <h3 className="text-sm font-bold text-[#1e3a5f] uppercase tracking-wider mb-4">Support</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-500 hover:text-[#f97316] transition-colors">About</a></li>
              <li><a href="#" className="text-gray-500 hover:text-[#f97316] transition-colors">Emergency</a></li>
              <li><a href="#" className="text-gray-500 hover:text-[#f97316] transition-colors">Contact</a></li>
            </ul>
          </div>
          
          {/* Spacer for grid alignment */}
          <div className="md:col-span-1 hidden md:block"></div>

        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            © 2026 AyosBarangay. <span className="italic">Para sa serbisyong mabilis at malinaw.</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;