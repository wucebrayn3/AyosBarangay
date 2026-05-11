import React, { useEffect, useState } from "react";
import { TrendingUp, AlertCircle, CheckCircle, Clock, PieChart } from "lucide-react";
import { PieChart as RechartsPie, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import api from "../../services/api";

const COLORS = ["#f97316", "#3b82f6", "#22c55e", "#eab308", "#a855f7", "#ef4444", "#06b6d4"];

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/dashboard/summary/"),
      api.get("/puroks/"),
      api.get("/infrastructure-issues/"),
      api.get("/community-concerns/"),
    ])
      .then(([summaryRes, purokRes, infraRes, concernRes]) => {
        const infraByPurok = {};
        const categoryTotals = {};
        infraRes.data.forEach(i => {
          const key = i.purok_name || `Purok ${i.purok || '?'}`;
          if (!infraByPurok[key]) infraByPurok[key] = { total: 0, resolved: 0, pending: 0, inProgress: 0, categories: {} };
          infraByPurok[key].total++;
          if (i.status === "resolved") infraByPurok[key].resolved++;
          else if (i.status === "pending") infraByPurok[key].pending++;
          else if (i.status === "in_progress") infraByPurok[key].inProgress++;
          infraByPurok[key].categories[i.category] = (infraByPurok[key].categories[i.category] || 0) + 1;
          categoryTotals[i.category] = (categoryTotals[i.category] || 0) + 1;
        });
        concernRes.data.forEach(i => {
          const key = i.purok_name || `Purok ${i.purok || '?'}`;
          if (!infraByPurok[key]) infraByPurok[key] = { total: 0, resolved: 0, pending: 0, inProgress: 0, categories: {} };
          infraByPurok[key].total++;
          if (i.status === "resolved") infraByPurok[key].resolved++;
          else if (i.status === "pending") infraByPurok[key].pending++;
          else if (i.status === "in_progress") infraByPurok[key].inProgress++;
          infraByPurok[key].categories[i.category] = (infraByPurok[key].categories[i.category] || 0) + 1;
          categoryTotals[i.category] = (categoryTotals[i.category] || 0) + 1;
        });

        const purokNames = purokRes.data.length
          ? purokRes.data.map(p => p.name)
          : Object.keys(infraByPurok).length
            ? Object.keys(infraByPurok)
            : ["Purok 1", "Purok 2", "Purok 3", "Purok 4", "Purok 5", "Purok 6", "Purok 7"];

        const densityColors = { 0: "bg-emerald-400", 1: "bg-yellow-400", 2: "bg-orange-500", 3: "bg-pink-500" };
        const densityLevels = ["low", "medium", "high", "critical"];

        const data = purokNames.map((name) => {
          const d = infraByPurok[name] || { total: 0, resolved: 0, pending: 0, inProgress: 0, categories: {} };
          const topCat = Object.entries(d.categories).sort((a, b) => b[1] - a[1])[0];
          const maxTotal = Math.max(...purokNames.map(n => (infraByPurok[n]?.total || 0)), 1);
          const densityIdx = Math.min(3, Math.floor(((d.total || 0) / maxTotal) * 4));
          return {
            purok: name,
            total: d.total,
            resolved: d.resolved,
            pending: d.pending,
            inProgress: d.inProgress,
            resolutionRate: d.total > 0 ? Math.round((d.resolved / d.total) * 100) : 0,
            topCategory: topCat ? topCat[0].replace("_", " ").replace(/\b\w/g, c => c.toUpperCase()) : "N/A",
            density: densityLevels[densityIdx],
            color: densityColors[densityIdx],
          };
        });

        const statusPieData = [
          { name: "Resolved", value: data.reduce((s, p) => s + p.resolved, 0) },
          { name: "Pending", value: data.reduce((s, p) => s + p.pending, 0) },
          { name: "In Progress", value: data.reduce((s, p) => s + p.inProgress, 0) },
        ];
        const categoryPieData = Object.entries(categoryTotals)
          .sort((a, b) => b[1] - a[1])
          .map(([name, value]) => ({ name: name.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase()), value }));

        setAnalyticsData(data);
        setAnalyticsData(prev => {
          prev.statusPieData = statusPieData;
          prev.categoryPieData = categoryPieData;
          prev.totalComplaints = data.reduce((s, p) => s + p.total, 0);
          prev.totalResolved = data.reduce((s, p) => s + p.resolved, 0);
          prev.totalPending = data.reduce((s, p) => s + p.pending, 0);
          prev.avgResolutionRate = data.length > 0
            ? (data.reduce((s, p) => s + p.resolutionRate, 0) / data.length).toFixed(1)
            : 0;
          return [...prev];
        });
        setLoading(false);
      })
      .catch(err => { console.log(err); setLoading(false); });
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

  // Extract augmented data
  const statusPieData = analyticsData.statusPieData || [];
  const categoryPieData = analyticsData.categoryPieData || [];
  const totalComplaints = analyticsData.totalComplaints || 0;
  const totalResolved = analyticsData.totalResolved || 0;
  const totalPending = analyticsData.totalPending || 0;
  const avgResolutionRate = analyticsData.avgResolutionRate || 0;

  if (loading) return <p className="text-gray-500">Loading analytics...</p>;

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

      {/* Pie Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {statusPieData.length > 0 && (
          <div className="bg-white border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="w-5 h-5 text-[#1e3a5f]" />
              <h2 className="text-lg font-bold text-[#1e3a5f]">Status Distribution</h2>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <RechartsPie>
                <Pie data={statusPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {statusPieData.map((entry, i) => (
                    <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </RechartsPie>
            </ResponsiveContainer>
          </div>
        )}

        {categoryPieData.length > 0 && (
          <div className="bg-white border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="w-5 h-5 text-[#1e3a5f]" />
              <h2 className="text-lg font-bold text-[#1e3a5f]">Category Breakdown</h2>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <RechartsPie>
                <Pie data={categoryPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {categoryPieData.map((entry, i) => (
                    <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </RechartsPie>
            </ResponsiveContainer>
          </div>
        )}
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
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">PUROK</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">TOTAL</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">RESOLVED</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">PENDING</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">RESOLUTION RATE</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">TOP CATEGORY</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {analyticsData.map((purok, index) => (
                <tr 
                  key={purok.purok}
                  className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                >
                  <td className="px-6 py-4"><span className="font-semibold text-[#1e3a5f]">{purok.purok}</span></td>
                  <td className="px-6 py-4"><span className="font-bold text-gray-700">{purok.total}</span></td>
                  <td className="px-6 py-4"><span className="text-green-600 font-semibold">{purok.resolved}</span></td>
                  <td className="px-6 py-4"><span className="text-orange-600 font-semibold">{purok.pending}</span></td>
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
                      <span className="text-sm font-semibold text-gray-700 w-12">{purok.resolutionRate}%</span>
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
