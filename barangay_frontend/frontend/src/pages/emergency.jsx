import React, { useState } from 'react';
import { Flame, Car, Heart, Shield, MapPin, Phone, Send, AlertTriangle } from 'lucide-react';
import api from '../services/api';

const Emergency = () => {
  const [selectedType, setSelectedType] = useState(null);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emergencyTypes = [
    { 
      id: 'fire', 
      label: 'Fire', 
      icon: <Flame className="w-8 h-8 text-white" />,
      gradient: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-500'
    },
    { 
      id: 'accident', 
      label: 'Accident', 
      icon: <Car className="w-8 h-8 text-white" />,
      gradient: 'from-orange-400 to-orange-600',
      bgColor: 'bg-orange-400'
    },
    { 
      id: 'medical', 
      label: 'Medical', 
      icon: <Heart className="w-8 h-8 text-white" />,
      gradient: 'from-pink-500 to-rose-600',
      bgColor: 'bg-pink-500'
    },
    { 
      id: 'crime', 
      label: 'Crime / Safety', 
      icon: <Shield className="w-8 h-8 text-white" />,
      gradient: 'from-red-600 to-red-700',
      bgColor: 'bg-red-600'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedType || !location || !description) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const selected = emergencyTypes.find((type) => type.id === selectedType);
      await api.post('/emergency-alerts/', {
        title: selected?.label || 'Emergency',
        description: `${description}\n\nLocation: ${location}`,
        contact_number: contactNumber,
        acknowledged: false,
      });
      alert('Emergency alert sent! Help is on the way.');
      setSelectedType(null);
      setLocation('');
      setDescription('');
      setContactNumber('');
    } catch (err) {
      alert(err.response?.status === 401 ? 'Please log in before sending an emergency alert.' : 'Could not send emergency alert.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCall911 = () => {
    window.location.href = 'tel:911';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Emergency Banner */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center gap-2 text-red-700 font-semibold">
            <AlertTriangle className="w-5 h-5" />
            <span>EMERGENCY CHANNEL • 24/7 monitored</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1e3a5f] mb-2">Emergency Report</h1>
          <p className="text-gray-600">
            For urgent incidents requiring immediate response. Officials and responders are alerted instantly.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Emergency Type Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Type of emergency
              </label>
              <div className="grid grid-cols-2 gap-4">
                {emergencyTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setSelectedType(type.id)}
                    className={`relative p-6 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-3 ${
                      selectedType === type.id
                        ? `border-transparent bg-gradient-to-br ${type.gradient} text-white shadow-lg scale-105`
                        : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50 text-gray-700'
                    }`}
                  >
                    <div className={`p-3 rounded-xl ${
                      selectedType === type.id ? 'bg-white/20' : type.bgColor
                    }`}>
                      {type.icon}
                    </div>
                    <span className="font-semibold text-sm">{type.label}</span>
                    {selectedType === type.id && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Location Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Street, landmark, purok..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Description Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Brief description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is happening? Number of people involved?"
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
                required
              />
            </div>

            {/* Contact Number Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contact number <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="09XX XXX XXXX"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg shadow-red-500/30 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              {isSubmitting ? 'Sending...' : 'Send Emergency Alert'}
            </button>

            {/* Alternative: Call 911 */}
            <button
              type="button"
              onClick={handleCall911}
              className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold py-4 px-6 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              Or call 911 directly
            </button>
          </form>
        </div>

        {/* Emergency Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-[#1e3a5f] mb-2">Important Information:</h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>• Emergency alerts are sent to barangay officials and response teams immediately</li>
            <li>• Stay at your location if it's safe to do so</li>
            <li>• Keep your phone nearby for responders to contact you</li>
            <li>• For life-threatening emergencies, always call 911 first</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Emergency;
