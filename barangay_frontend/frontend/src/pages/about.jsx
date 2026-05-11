import React from 'react';
import { Target, Lightbulb, Users, Building, ArrowRight, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#1e3a5f] rounded-xl mb-6 shadow-lg">
            <Building className="w-6 h-6 text-white" />
          </div>
          <p className="text-[#f97316] font-semibold text-sm uppercase tracking-wider mb-3">
            About The Project
          </p>
          <h1 className="text-4xl lg:text-5xl font-bold text-[#1e3a5f] mb-4 leading-tight">
            Empowering communities<br />through transparent reporting
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            AyosBarangay is a digital platform designed to improve the reporting, tracking, 
            and resolution of community infrastructure and barangay-level concerns.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {/* Card 1: Mission */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-[#f97316]" />
            </div>
            <h3 className="text-xl font-bold text-[#1e3a5f] mb-3">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed">
              To make barangay services responsive and accountable by giving every resident a voice and every concern a clear path to resolution.
            </p>
          </div>

          {/* Card 2: Approach */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <Lightbulb className="w-6 h-6 text-[#f97316]" />
            </div>
            <h3 className="text-xl font-bold text-[#1e3a5f] mb-3">Our Approach</h3>
            <p className="text-gray-600 leading-relaxed">
              Combines simple mobile-first reporting with transparent public dashboards so everyone can see what's getting fixed and how fast.
            </p>
          </div>

          {/* Card 3: Who It's For */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-[#f97316]" />
            </div>
            <h3 className="text-xl font-bold text-[#1e3a5f] mb-3">Who It's For</h3>
            <p className="text-gray-600 leading-relaxed">
              Residents who want to report issues, barangay officials managing requests, and maintenance teams executing the work.
            </p>
          </div>

          {/* Card 4: The Team */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <Building className="w-6 h-6 text-[#f97316]" />
            </div>
            <h3 className="text-xl font-bold text-[#1e3a5f] mb-3">The Team</h3>
            <p className="text-gray-600 leading-relaxed">
              BSIT 3A — Group 1. A capstone project bridging technology and public service.
            </p>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="bg-gradient-to-br from-[#1e3a5f] to-[#0f2b4d] rounded-3xl p-10 md:p-16 text-center shadow-2xl relative overflow-hidden">
          {/* Decorative Background Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 relative z-10">
            Ready to make a difference?
          </h2>
          
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto relative z-10">
            Join the platform and help build a more responsive barangay.
          </p>
          
          <Link to="/report" className="relative z-10">
            <button className="inline-flex items-center gap-3 bg-[#f97316] hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-orange-500/30">
              <Send className="w-5 h-5" />
              Submit your first report
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default About;