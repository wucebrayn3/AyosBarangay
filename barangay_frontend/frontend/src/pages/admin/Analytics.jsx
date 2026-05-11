import React, { useEffect, useState } from "react";
import { TrendingUp, AlertCircle, CheckCircle, Clock } from "lucide-react";

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState([]);

  // Mock data - replace with API call later
  useEffect(() => {
    // Simulated data from backend
    const mockData = [
      {
        purok: "Purok 1",
        total: 38,
        resolved: 22,
        pending: 6,
        inProgress: 10,
        resolutionRate: 58,
        topCategory: "Flooding",
        density: "high",
        color: "bg-orange-500"
      },
      {
        purok: "Purok 2",
        total: 24,
        resolved: 18,
        pending: 2,
        inProgress: 4,
        resolutionRate: 75,
        topCategory: "Streetlight",
        density: "medium",
        color: "bg-yellow-400"
      },
      {
        purok: "Purok 3",
        total: 56,
        resolved: 30,
        pending: 12,
        inProgress: 14,
        resolutionRate: 54,
        topCategory: "Pothole",
        density: "critical",
        color: "bg-pink-500"
      },
      {
        purok: "Purok 4",
        total: 19,
        resolved: 14,
        pending: 3,
        inProgress: 2,
        resolutionRate: 74,
        topCategory: "Noise",
        density: "low",
        color: "bg-emerald-400"
      },
      {
        purok: "Purok 5",
        total: 47,
        resolved: 25,
        pending: 9,
        inProgress: 13,
        resolutionRate: 53,
        topCategory: "Drainage",
        density: "high",
        color: "bg-orange-500"
      },
      {
        purok: "Purok 6",
        total: 28,
        resolved: 21,
        pending: 4,
        inProgress: 3,
        resolutionRate: 75,
        topCategory: "Safety",
        density: "medium",
        color: "bg-yellow-400"
      },
      {
        purok: "Purok 7",
        total: 41,
        resolved: 26,
        pending: 8,
        inProgress: 7,
        resolutionRate: 63,
        topCategory: "Garbage",
        density: "high",
        color: "bg-orange-500"
      }
    ];

    setAnalyticsData(mockData);
  }, []);

  const getDensityColor = (density) => {
    switch(density) {
      case "critical": return "bg-pink-500";
      case "high": return "bg-orange-500";
      case "medium": return "bg-yellow-400";
      case "low": return "bg-emerald-400";
      default: return "bg-gray-400";
    }
  };

  const getResolutionRateColor = (rate) => {
    if (rate >= 75) return "bg-green-500";
    if (rate >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const totalComplaints = analyticsData.reduce((sum, p) => sum + p.total, 0);
  const totalResolved = analyticsData.reduce((sum, p) => sum + p.resolved, 0);
  const totalPending = analyticsData.reduce((sum, p) => sum + p.pending, 0);
  const avgResolutionRate = analyticsData.length > 0 
    ? (analyticsData.reduce((sum, p) => sum + p.resolutionRate, 0) / analyticsData.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-1">
          Per-Purok Analytics
        </p>
        <h1 className="text-3xl font-bold text-[#1e3a5f] mb-2">
          Complaints by Zone
        </h1>
        <p className="text-gray-500">
          Distribution and density of complaints across puroks.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1e3a5f]">{totalComplaints}</p>
              <p className="text-xs text-gray-500">Total Complaints</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white border rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1e3a5f]">{totalResolved}</p>
              <p className="text-xs text-gray-500">Resolved</p>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1e3a5f]">{totalPending}</p>
              <p className="text-xs text-gray-500">Pending</p>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1e3a5f]">{avgResolutionRate}%</p>
              <p className="text-xs text-gray-500">Avg. Resolution Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Density Heatmap */}
      <div className="bg-white border rounded-xl p-6">
        <h2 className="text-lg font-bold text-[#1e3a5f] mb-4">Density Heatmap</h2>
        
        <div className="grid grid-cols-7 gap-3 mb-4">
          {analyticsData.map((purok) => (
            <div
              key={purok.purok}
              className={`${getDensityColor(purok.density)} rounded-xl p-4 text-white min-h-[120px] flex flex-col justify-between hover:shadow-lg transition-shadow`}
            >
              <div>
                <p className="text-xs font-semibold opacity-90 mb-1">{purok.purok}</p>
                <p className="text-3xl font-bold mb-1">{purok.total}</p>
                <p className="text-xs opacity-90">{purok.topCategory}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <span className="text-gray-500 font-medium">Low</span>
          <div className="flex gap-2">
            <div className="w-8 h-3 bg-emerald-400 rounded"></div>
            <div className="w-8 h-3 bg-yellow-400 rounded"></div>
            <div className="w-8 h-3 bg-orange-500 rounded"></div>
            <div className="w-8 h-3 bg-pink-500 rounded"></div>
          </div>
          <span className="text-gray-500 font-medium">High</span>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  PUROK
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  TOTAL
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  RESOLVED
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  PENDING
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  RESOLUTION RATE
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  TOP CATEGORY
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {analyticsData.map((purok, index) => (
                <tr 
                  key={purok.purok}
                  className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                >
                  <td className="px-6 py-4">
                    <span className="font-semibold text-[#1e3a5f]">{purok.purok}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-gray-700">{purok.total}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-green-600 font-semibold">{purok.resolved}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-orange-600 font-semibold">{purok.pending}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 max-w-[100px]">
                        <div className="bg-gray-200 rounded-full h-2">
                          <div
                            className={`${getResolutionRateColor(purok.resolutionRate)} h-2 rounded-full transition-all`}
                            style={{ width: `${purok.resolutionRate}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-gray-700 w-12">
                        {purok.resolutionRate}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {purok.topCategory}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;