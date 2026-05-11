import React, { useState } from 'react';
import { 
  MapPin, TrendingUp, Camera, ArrowRight, 
  Eye, ArrowUp, Users, BarChart3, Shield, 
  AlertTriangle, CheckCircle, Calendar, MessageSquare,
  X, Upload
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- Report Modal Component ---
const ReportModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    category: '',
    location: '',
    description: '',
    photo: null
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Connect to backend
    alert('Report submitted successfully!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-3xl flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#1e3a5f]">Submit a Report</h2>
            <p className="text-sm text-gray-500">Help us improve the barangay</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent"
            >
              <option value="">Select a category</option>
              <option value="flooding">Flooding</option>
              <option value="pothole">Pothole</option>
              <option value="garbage">Garbage/Waste</option>
              <option value="streetlight">Streetlight</option>
              <option value="drainage">Drainage</option>
              <option value="noise">Noise Complaint</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Location <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                required
                placeholder="Purok, street, landmark..."
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows="4"
              placeholder="Describe the issue in detail..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent resize-none"
            />
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Upload Photo <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#f97316] transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
              <input type="file" className="hidden" accept="image/*" />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#f97316] hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-orange-500/30"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Sub-section: Hero ---
const HeroSection = () => {
  const navigate = useNavigate();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  return (
    <div className="bg-gradient-to-br from-[#1e3a5f] via-[#1e3a5f] to-[#0f2b4d] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        {/* Badge with gentle pulse animation - Option 1 */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-8 animate-pulse">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f97316] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f97316]"></span>
          </div>
          <span className="text-white text-sm font-medium">Live community platform</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Para sa malinaw at{' '}
              <span className="text-[#f97316]">mabilis na serbisyo</span>
              <br />
              sa barangay.
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Report potholes, broken streetlights, drainage and other concerns.
              Track every step from report to resolution — transparently.
            </p>

            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => setIsReportModalOpen(true)}
                className="flex items-center gap-2 bg-[#f97316] hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <Camera className="w-5 h-5" />
                Report an Issue
              </button>
              <button 
                onClick={() => navigate('/report')}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Browse Reports
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right Card - Clickable */}
          <div 
            onClick={() => navigate('/report')}
            className="relative cursor-pointer group"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-200 group-hover:shadow-3xl transition-all duration-300 group-hover:-translate-y-1">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  In Progress
                </div>
                <span className="text-gray-400 text-sm">#AB-1642</span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Large pothole on Rizal Street
              </h3>
              
              <p className="text-gray-500 mb-4">
                Verified by Brgy. Office. Maintenance scheduled this week.
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>Purok 3</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>47 upvotes</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between text-xs text-gray-500">
                  <span>Pending</span>
                  <span className="font-semibold text-[#1e3a5f]">In Progress</span>
                  <span>Resolved</span>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                  <div className="w-2/3 bg-gradient-to-r from-[#f97316] to-orange-400 shadow-lg"></div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#f97316]/20 rounded-full blur-2xl group-hover:bg-[#f97316]/30 transition-colors"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/30 transition-colors"></div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 pt-12 border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#f97316] mb-2">287</div>
              <div className="text-gray-400 text-sm uppercase tracking-wide">Total Reports</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#f97316] mb-2">192</div>
              <div className="text-gray-400 text-sm uppercase tracking-wide">Resolved</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#f97316] mb-2">67%</div>
              <div className="text-gray-400 text-sm uppercase tracking-wide">Resolution Rate</div>
            </div>
          </div>
        </div>

      </div>

      {/* Report Modal */}
      <ReportModal 
        isOpen={isReportModalOpen} 
        onClose={() => setIsReportModalOpen(false)} 
      />
    </div>
  );
};

// --- Sub-section: Features (Simplified) ---
const FeaturesSection = () => {
  const features = [
    { 
      icon: <Camera className="w-6 h-6 text-white" />, 
      title: "Easy Reporting", 
      description: "Snap a photo and submit in seconds" 
    },
    { 
      icon: <Eye className="w-6 h-6 text-white" />, 
      title: "Track Progress", 
      description: "See real-time status updates" 
    },
    { 
      icon: <ArrowUp className="w-6 h-6 text-white" />, 
      title: "Upvote Issues", 
      description: "Prioritize what matters most" 
    },
    { 
      icon: <Shield className="w-6 h-6 text-white" />, 
      title: "Anonymous Option", 
      description: "Report safely without revealing identity" 
    }
  ];

  return (
    <section className="bg-[#faf8f5] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-[#f97316] font-semibold text-sm uppercase tracking-wider mb-3">What It Does</p>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#1e3a5f] mb-4">Simple. Fast. Transparent.</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">Everything you need to report and track community concerns.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300 group text-center">
              <div className="w-14 h-14 bg-[#1e3a5f] rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:bg-[#f97316] transition-colors duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-[#1e3a5f] mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Sub-section: Trending Issues ---
const TrendingSection = () => {
  const navigate = useNavigate();
  
  const issues = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80",
      status: "In Progress", category: "Garbage", title: "Garbage not collected for over a week",
      upvotes: 64, description: "Garbage truck hasn't passed by Purok 7 for 8 days. Smell is unbearable.",
      location: "Purok 7", date: "2026-04-21", comments: 1, ref: "#AB-1039"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80",
      status: "Verified", category: "Flooding", title: "Flooding on main road blocks ambulance access",
      upvotes: 51, description: "Standing water makes the main road impassable for vehicles after heavy rain.",
      location: "Purok 1", date: "2026-04-26", comments: 0, ref: "#AB-1037"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
      status: "In Progress", category: "Pothole", title: "Large pothole on Rizal Street causing accidents",
      upvotes: 47, description: "A deep pothole near the corner of Rizal and Mabini has caused two motorcycle accidents this week....",
      location: "Purok 3", date: "2026-04-22", comments: 2, ref: "#AB-1042"
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case "In Progress": return "bg-orange-100 text-orange-700";
      case "Verified": return "bg-blue-100 text-blue-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case "Garbage": return "bg-emerald-100 text-emerald-700";
      case "Flooding": return "bg-blue-100 text-blue-700";
      case "Pothole": return "bg-orange-100 text-orange-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <section className="bg-[#f8f9fa] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div>
            <p className="text-[#f97316] font-semibold text-sm uppercase tracking-wider mb-2">Trending Now</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#1e3a5f]">Most upvoted issues</h2>
          </div>
          <button 
            onClick={() => navigate('/report')}
            className="flex items-center gap-2 bg-white border border-gray-300 hover:border-[#1e3a5f] hover:bg-gray-50 text-[#1e3a5f] font-medium px-5 py-2.5 rounded-lg transition-all"
          >
            View all <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {issues.map((issue) => (
            <div 
              key={issue.id} 
              onClick={() => navigate('/report')}
              className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer group hover:-translate-y-1"
            >
              <div className="relative h-48 bg-gray-200 overflow-hidden">
                <img 
                  src={issue.image} 
                  alt={issue.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                />
                <div className="absolute top-4 left-4 right-4 flex justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(issue.status)} backdrop-blur-sm`}>
                    {issue.status}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(issue.category)} backdrop-blur-sm`}>
                    {issue.category}
                  </span>
                </div>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start gap-3 mb-3">
                  <h3 className="text-lg font-bold text-[#1e3a5f] leading-snug group-hover:text-[#f97316] transition-colors">
                    {issue.title}
                  </h3>
                  <button className="flex flex-col items-center justify-center w-11 h-11 rounded-full border border-gray-200 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600 transition-colors flex-shrink-0">
                    <ArrowUp className="w-4 h-4 mb-0.5" />
                    <span className="text-xs font-bold">{issue.upvotes}</span>
                  </button>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
                  {issue.description}
                </p>
                <div className="mt-auto pt-4 border-t border-gray-100">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span>{issue.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>{issue.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                      <span>{issue.comments}</span>
                    </div>
                    <span className="ml-auto font-mono text-gray-400">{issue.ref}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Sub-section: CTA ---
const CTASection = () => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  return (
    <>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="bg-gradient-to-br from-[#0a192f] to-[#003366] rounded-3xl p-10 md:p-16 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 relative z-10">May problema sa inyong purok?</h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto relative z-10">
            I-report ngayon. Makikita ng buong komunidad at masusubaybayan hanggang maayos.
          </p>
          <button 
            onClick={() => setIsReportModalOpen(true)}
            className="inline-flex items-center gap-3 bg-[#f97316] hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-orange-500/30 relative z-10"
          >
            <Camera className="w-5 h-5" /> 
            Submit a Report 
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Report Modal */}
      <ReportModal 
        isOpen={isReportModalOpen} 
        onClose={() => setIsReportModalOpen(false)} 
      />
    </>
  );
};

// --- Main Home Component ---
const Home = () => {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <TrendingSection />
      <CTASection />
    </>
  );
};

export default Home;