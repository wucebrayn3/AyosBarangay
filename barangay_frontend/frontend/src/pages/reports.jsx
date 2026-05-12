import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  MapPin, Calendar, MessageSquare, Camera, Search, Filter, X, 
  ArrowUp, Send, User
} from 'lucide-react';
import L from 'leaflet';
import { lucenaBarangays, lucenaStreetsByBarangay } from '../data/lucenaData';
import api, {
  WS_BASE_URL,
  apiCategoryToLabel,
  getImageUrl,
  infrastructureCategories,
  labelToApiCategory,
  statusToFrontend,
} from '../services/api';

// Fix for default Leaflet marker icons
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom colored markers
const createCustomIcon = (color) => {
  const colorMap = {
    'pending': '#9ca3af',
    'verified': '#3b82f6',
    'in-progress': '#f97316',
    'resolved': '#22c55e'
  };
  
  const html = `
    <div style="
      background-color: ${colorMap[color] || '#9ca3af'};
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    "></div>
  `;
  
  return L.divIcon({
    html,
    className: 'custom-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

// Lucena City, Quezon coordinates
const LUCENA_CENTER = [13.9333, 121.6167];

// Approximate purok locations
const purokLocations = {
  'Purok 1': [13.9350, 121.6150],
  'Purok 2': [13.9320, 121.6180],
  'Purok 3': [13.9380, 121.6200],
  'Purok 4': [13.9300, 121.6100],
  'Purok 5': [13.9400, 121.6250],
  'Purok 6': [13.9280, 121.6220],
  'Purok 7': [13.9360, 121.6080]
};

// --- Add Report Modal ---
const AddReportModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    category: '',
    location: '',
    description: '',
    photo: null,
    barangay: '',
    street: '',
  });
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFile = (file) => {
    if (!file) return;
    setFormData({ ...formData, photo: file });
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const combinedLocation = [formData.street, formData.barangay].filter(Boolean).join(", ");
    onSubmit({ ...formData, location: combinedLocation || formData.location });
    onClose();
    setFormData({ category: '', location: '', description: '', photo: null, barangay: '', street: '' });
    setPreview(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-3xl flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#1e3a5f]">Submit a Report</h2>
            <p className="text-sm text-gray-500">Help us improve the barangay</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Category <span className="text-red-500">*</span></label>
            <select required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f97316]">
              <option value="">Select a category</option>
              <option value="Flooding">Flooding</option>
              <option value="Pothole">Pothole</option>
              <option value="Garbage">Garbage/Waste</option>
              <option value="Streetlight">Streetlight</option>
              <option value="Drainage">Drainage</option>
              <option value="Noise">Noise Complaint</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Location <span className="text-red-500">*</span></label>
            <div className="space-y-3">
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select required value={formData.barangay} onChange={(e) => setFormData({...formData, barangay: e.target.value, street: ''})}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f97316] bg-white appearance-none">
                  <option value="">Select barangay (Lucena City)</option>
                  {lucenaBarangays.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <select value={formData.street} onChange={(e) => setFormData({...formData, street: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f97316] bg-white appearance-none">
                <option value="">
                  {formData.barangay ? 'Select street (optional)' : 'Select a barangay first'}
                </option>
                {(formData.barangay ? lucenaStreetsByBarangay[formData.barangay] || [] : []).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description <span className="text-red-500">*</span></label>
            <textarea required rows="4" placeholder="Describe the issue in detail..." value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f97316] resize-none" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Photo <span className="text-gray-400 font-normal">(optional)</span></label>
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]); }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                isDragging ? 'border-[#f97316] bg-orange-50' : 'border-gray-300 hover:border-[#f97316]'
              }`}
            >
              {preview ? (
                <div className="relative inline-block">
                  <img src={preview} alt="Preview" className="max-h-40 rounded-lg mx-auto" />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setPreview(null); setFormData({...formData, photo: null}); }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <>
                  <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFile(e.target.files[0])}
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" className="flex-1 bg-[#f97316] hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-orange-500/30">Submit Report</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Report Detail Modal ---
const ReportDetailModal = ({ report, isOpen, onClose, onUpvote, onComment }) => {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (!isOpen || !report) return;
    const params = report.type === 'infrastructure'
      ? `infrastructure_issue=${report.rawId}`
      : `community_concern=${report.rawId}`;
    api.get(`/comments/?${params}&ordering=-created_at`)
      .then(res => setComments(res.data.map(c => ({
        id: c.id,
        user: c.author_name || c.author?.username || 'Anonymous',
        text: c.body,
        timestamp: c.created_at ? new Date(c.created_at).toLocaleDateString() : '',
      }))))
      .catch(() => setComments([]));
  }, [report?.id, isOpen]);

  if (!isOpen || !report) return null;

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    onComment?.(report.id, { text: newComment });
    setNewComment('');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "pending": return "bg-gray-400 text-gray-700";
      case "verified": return "bg-blue-100 text-blue-700";
      case "in-progress": return "bg-orange-100 text-orange-700";
      case "resolved": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case "Flooding": return "bg-blue-100 text-blue-700";
      case "Pothole": return "bg-orange-100 text-orange-700";
      case "Garbage": return "bg-emerald-100 text-emerald-700";
      case "Streetlight": return "bg-yellow-100 text-yellow-700";
      case "Noise": return "bg-purple-100 text-purple-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-3xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(report.status)}`}>
              {report.status.replace('-', ' ').toUpperCase()}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(report.category)}`}>
              {report.category}
            </span>
          </div>
          <button onClick={onClose} className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-8">
          {/* Image */}
          <div className="relative h-64 rounded-2xl overflow-hidden mb-6">
            <img src={report.image} alt={report.title} className="w-full h-full object-cover" />
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-sm font-semibold text-[#1e3a5f]">{report.location}</p>
                <p className="text-xs text-gray-500">{report.date}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Details */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[#1e3a5f] mb-3">{report.title}</h2>
                <p className="text-gray-600 leading-relaxed">{report.description}</p>
              </div>

              {/* Progress Timeline */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-[#1e3a5f] mb-4">Status Timeline</h3>
                <div className="relative pl-6 border-l-2 border-gray-200 space-y-4">
                  <div className="relative">
                    <div className="absolute -left-[25px] w-4 h-4 bg-green-500 rounded-full border-4 border-white"></div>
                    <p className="text-sm font-medium text-gray-700">Reported</p>
                    <p className="text-xs text-gray-500">{report.date}</p>
                  </div>
                  {report.status !== 'pending' && (
                    <div className="relative">
                      <div className={`absolute -left-[25px] w-4 h-4 ${report.status === 'verified' ? 'bg-blue-500' : 'bg-gray-300'} rounded-full border-4 border-white`}></div>
                      <p className={`text-sm font-medium ${report.status === 'verified' ? 'text-blue-700' : 'text-gray-400'}`}>Verified</p>
                      {report.status === 'verified' && <p className="text-xs text-gray-500">2 days ago</p>}
                    </div>
                  )}
                  {report.status === 'in-progress' && (
                    <div className="relative">
                      <div className="absolute -left-[25px] w-4 h-4 bg-orange-500 rounded-full border-4 border-white animate-pulse"></div>
                      <p className="text-sm font-medium text-orange-700">In Progress</p>
                      <p className="text-xs text-gray-500">Currently being addressed</p>
                    </div>
                  )}
                  {report.status === 'resolved' && (
                    <>
                      <div className="relative">
                        <div className="absolute -left-[25px] w-4 h-4 bg-orange-500 rounded-full border-4 border-white"></div>
                        <p className="text-sm font-medium text-orange-700">In Progress</p>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-[25px] w-4 h-4 bg-green-500 rounded-full border-4 border-white"></div>
                        <p className="text-sm font-medium text-green-700">Resolved</p>
                        <p className="text-xs text-gray-500">Issue fixed!</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Comments Section */}
              <div>
                <h3 className="font-semibold text-[#1e3a5f] mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Comments ({comments.length})
                </h3>
                
                {/* Comment Input */}
                <form onSubmit={handleAddComment} className="mb-4">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-[#1e3a5f] rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                      />
                      <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-[#f97316] hover:bg-orange-50 rounded-lg transition-colors">
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </form>

                {/* Comments List */}
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        comment.user === 'You' ? 'bg-[#1e3a5f]' : 'bg-gray-300'
                      }`}>
                        <span className="text-white text-xs font-bold">
                          {comment.user === 'You' ? 'Y' : comment.user.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm text-[#1e3a5f]">{comment.user}</span>
                          <span className="text-xs text-gray-400">{comment.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-600">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="space-y-4">
              {/* Upvote */}
              <button 
                onClick={() => onUpvote?.(report.id)}
                className="w-full flex flex-col items-center justify-center gap-2 p-4 border-2 border-orange-200 rounded-xl hover:bg-orange-50 hover:border-orange-300 transition-colors group"
              >
                <ArrowUp className="w-6 h-6 text-orange-600 group-hover:scale-110 transition-transform" />
                <span className="text-2xl font-bold text-[#1e3a5f]">{report.upvotes}</span>
                <span className="text-xs text-gray-500">Upvotes</span>
              </button>

              {/* Reference */}
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Reference</p>
                <p className="font-mono font-bold text-[#1e3a5f]">#{report.ref}</p>
              </div>

              {/* Share */}
              <button className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors">
                Share Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Report Component ---
const Report = () => {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reports, setReports] = useState([]);
  const [puroks, setPuroks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const statusFilters = [
    { key: 'all', label: 'All', color: 'bg-gray-600' },
    { key: 'pending', label: 'Pending', color: 'bg-gray-400' },
    { key: 'verified', label: 'Verified', color: 'bg-blue-500' },
    { key: 'in-progress', label: 'In Progress', color: 'bg-orange-500' },
    { key: 'resolved', label: 'Resolved', color: 'bg-green-500' }
  ];

  const normalizeReport = (item, type, purokList = puroks) => {
    const purok = purokList.find((p) => p.id === item.purok);
    const purokName = purok?.name || item.purok_name || `Purok ${item.purok || ''}`.trim();
    return {
      id: `${type}-${item.id}`,
      rawId: item.id,
      type,
      image: getImageUrl(item.image),
      status: statusToFrontend(item.status),
      category: apiCategoryToLabel(item.category),
      title: item.title,
      description: item.description,
      location: item.address_text || purokName || 'No location',
      purok: purokName,
      purokId: item.purok,
      date: item.created_at?.slice(0, 10) || '',
      comments: item.comments?.length || 0,
      upvotes: item.upvote_count || 0,
      ref: `${type === 'infrastructure' ? 'INF' : 'CON'}-${String(item.id).padStart(4, '0')}`,
    };
  };

  const loadReports = async () => {
    setIsLoading(true);
    try {
      const [purokRes, infraRes, concernRes] = await Promise.all([
        api.get('/puroks/'),
        api.get('/infrastructure-issues/?ordering=-created_at'),
        api.get('/community-concerns/?ordering=-created_at'),
      ]);
      setPuroks(purokRes.data);
      setReports([
        ...infraRes.data.map((item) => normalizeReport(item, 'infrastructure', purokRes.data)),
        ...concernRes.data.map((item) => normalizeReport(item, 'concern', purokRes.data)),
      ].sort((a, b) => b.id.localeCompare(a.id)));
    } catch (err) {
      console.error(err);
      alert('Could not load reports from the backend.');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    loadReports();
    const socket = new WebSocket(`${WS_BASE_URL}/ws/issues/`);
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'event') loadReports();
    };
    return () => socket.close();
  }, []);

  const mapMarkers = reports
    .filter(r => purokLocations[r.purok])
    .map(r => ({
      id: r.id,
      purok: r.purok,
      status: r.status,
      position: purokLocations[r.purok],
      reportId: r.id
    }));

  const getStatusColor = (status) => {
    switch(status) {
      case "pending": return "bg-gray-400 text-gray-700";
      case "verified": return "bg-blue-100 text-blue-700";
      case "in-progress": return "bg-orange-100 text-orange-700";
      case "resolved": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case "Flooding": return "bg-blue-100 text-blue-700";
      case "Pothole": return "bg-orange-100 text-orange-700";
      case "Garbage": return "bg-emerald-100 text-emerald-700";
      case "Streetlight": return "bg-yellow-100 text-yellow-700";
      case "Noise": return "bg-purple-100 text-purple-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  // Filter reports — hide resolved by default unless explicitly filtered
  const filteredReports = reports.filter(report => {
    const matchesStatus = selectedStatus === 'all'
      ? report.status !== 'resolved'
      : report.status === selectedStatus;
    const matchesSearch = searchTerm === '' || 
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Handle upvote
  const handleUpvote = async (reportId) => {
    const report = reports.find((r) => r.id === reportId);
    if (!report) return;
    try {
      await api.post('/upvotes/', {
        infrastructure_issue: report.type === 'infrastructure' ? report.rawId : null,
        community_concern: report.type === 'concern' ? report.rawId : null,
      });
      setReports(prev => prev.map(r =>
        r.id === reportId ? { ...r, upvotes: r.upvotes + 1 } : r
      ));
    } catch (err) {
      alert(err.response?.status === 401 ? 'Please log in before upvoting.' : 'Could not upvote this report.');
    }
  };

  // Handle add report
  const handleAddReport = async (formData) => {
    const category = labelToApiCategory(formData.category);
    const endpoint = infrastructureCategories.has(category) && category !== 'noise'
      ? '/infrastructure-issues/'
      : '/community-concerns/';
    const payload = new FormData();
    payload.append('title', formData.location || formData.barangay);
    payload.append('description', formData.description);
    payload.append('category', category);
    payload.append('status', 'pending');
    payload.append('address_text', formData.location);
    payload.append('is_verified', 'false');
    payload.append('is_public', 'true');
    if (endpoint === '/community-concerns/') payload.append('is_anonymous', 'false');
    if (formData.photo) payload.append('image', formData.photo);

    try {
      await api.post(endpoint, payload);
      await loadReports();
    } catch (err) {
      alert(err.response?.status === 401 ? 'Please log in before submitting a report.' : 'Could not submit report.');
    }
  };

  const handleComment = async (reportId, comment) => {
    const report = reports.find((r) => r.id === reportId);
    if (!report) return;
    try {
      await api.post('/comments/', {
        infrastructure_issue: report.type === 'infrastructure' ? report.rawId : null,
        community_concern: report.type === 'concern' ? report.rawId : null,
        body: comment.text,
      });
      await loadReports();
    } catch (err) {
      alert(err.response?.status === 401 ? 'Please log in before commenting.' : 'Could not add comment.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <p className="text-[#f97316] font-semibold text-sm uppercase tracking-wider mb-1">Community Reports</p>
              <h1 className="text-3xl font-bold text-[#1e3a5f]">Reports across the barangay</h1>
              <p className="text-gray-500 mt-2">See what your neighbors are reporting on the live map. Spot something new? Add your own report.</p>
            </div>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-[#f97316] hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-lg shadow-orange-500/30"
            >
              <Camera className="w-5 h-5" />
              Add Report
            </button>
          </div>

          {/* Map Section */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="font-medium">Live Map - Lucena City, Quezon</span>
                  <span className="text-gray-400">•</span>
                  <span>Click markers for details</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {statusFilters.map((filter) => (
                    <button
                      key={filter.key}
                      onClick={() => setSelectedStatus(filter.key)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        selectedStatus === filter.key
                          ? 'bg-[#1e3a5f] text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full ${filter.color}`}></div>
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive Map */}
            <div className="relative h-96 w-full">
              <MapContainer center={LUCENA_CENTER} zoom={14} style={{ height: '100%', width: '100%', zIndex: 1 }} className="rounded-b-xl">
                <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {mapMarkers.filter(m => {
                  const r = reports.find(r => r.id === m.reportId);
                  return selectedStatus === 'all' ? r?.status !== 'resolved' : r?.status === selectedStatus;
                }).map((marker) => (
                  <Marker key={marker.id} position={marker.position} icon={createCustomIcon(marker.status)} eventHandlers={{ click: () => {
                    const report = reports.find(r => r.id === marker.reportId);
                    if (report) setSelectedReport(report);
                  }}}><Popup><div className="p-2"><h3 className="font-bold text-[#1e3a5f]">{marker.purok}</h3><p className="text-sm text-gray-600 capitalize">{marker.status.replace('-', ' ')}</p></div></Popup></Marker>
                ))}
              </MapContainer>
            </div>

            {/* Legend */}
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <span className="text-gray-600 font-medium">Legend:</span>
                {statusFilters.filter(f => f.key !== 'all').map((filter) => (
                  <div key={filter.key} className="flex items-center gap-1.5">
                    <div className={`w-2.5 h-2.5 rounded-full ${filter.color}`}></div>
                    <span className="text-gray-600">{filter.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reports Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#1e3a5f] mb-1">Recent Community Reports</h2>
            <p className="text-gray-500 text-sm">Latest reports from your neighborhood</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search reports..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent w-64" />
            {searchTerm && <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>}
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <p className="text-gray-500">Loading reports...</p>
          ) : filteredReports.map((report) => (
            <div key={report.id} onClick={() => setSelectedReport(report)} className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer group hover:-translate-y-1">
              <div className="relative h-48 bg-gray-200">
                <img src={report.image} alt={report.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute top-3 left-3 right-3 flex justify-between">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(report.status)} backdrop-blur-sm`}>{report.status.replace('-', ' ').toUpperCase()}</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getCategoryColor(report.category)} backdrop-blur-sm`}>{report.category}</span>
                </div>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start gap-3 mb-3">
                  <h3 className="text-lg font-bold text-[#1e3a5f] leading-snug group-hover:text-[#f97316] transition-colors">{report.title}</h3>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleUpvote(report.id); }}
                    className="flex flex-col items-center justify-center w-11 h-11 rounded-full border border-gray-200 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600 transition-colors flex-shrink-0"
                  >
                    <ArrowUp className="w-4 h-4 mb-0.5" />
                    <span className="text-xs font-bold">{report.upvotes}</span>
                  </button>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">{report.description}</p>
                <div className="mt-auto pt-4 border-t border-gray-100">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-gray-400" /><span>{report.location}</span></div>
                    <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-gray-400" /><span>{report.date}</span></div>
                    <div className="flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5 text-gray-400" /><span>{report.comments}</span></div>
                    <span className="ml-auto font-mono text-gray-400">#{report.ref}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4"><Filter className="w-8 h-8 text-gray-400" /></div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">No reports found</h3>
            <p className="text-gray-500">Try adjusting your filters or search term</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddReportModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSubmit={handleAddReport} />
      <ReportDetailModal report={selectedReport} isOpen={!!selectedReport} onClose={() => setSelectedReport(null)} onUpvote={handleUpvote} onComment={handleComment} />
    </div>
  );
};

export default Report;
