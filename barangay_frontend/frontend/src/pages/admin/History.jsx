import React, { useEffect, useState } from "react";
import { Search, Calendar, Filter } from "lucide-react";
import api from "../../services/api";

const History = () => {
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    Promise.all([
      api.get("/infrastructure-issues/?ordering=-updated_at"),
      api.get("/community-concerns/?ordering=-updated_at"),
    ])
      .then(([infraRes, concernRes]) => {
        const all = [
          ...infraRes.data.map(i => ({
            ref: `INF-${String(i.id).padStart(4, '0')}`,
            title: i.title,
            purok: i.purok_name || `Purok ${i.purok || '?'}`,
            category: (i.category || "").replace("_", " ").replace(/\b\w/g, c => c.toUpperCase()),
            status: i.status,
            resolved: i.updated_at ? new Date(i.updated_at).toISOString().slice(0, 10) : "",
            daysToFix: i.created_at ? Math.ceil((new Date(i.updated_at) - new Date(i.created_at)) / (1000*60*60*24)) + "d" : "-",
            created: i.created_at,
          })),
          ...concernRes.data.map(i => ({
            ref: `CON-${String(i.id).padStart(4, '0')}`,
            title: i.title,
            purok: i.purok_name || `Purok ${i.purok || '?'}`,
            category: (i.category || "").replace("_", " ").replace(/\b\w/g, c => c.toUpperCase()),
            status: i.status,
            resolved: i.updated_at ? new Date(i.updated_at).toISOString().slice(0, 10) : "",
            daysToFix: i.created_at ? Math.ceil((new Date(i.updated_at) - new Date(i.created_at)) / (1000*60*60*24)) + "d" : "-",
            created: i.created_at,
          })),
        ];
        setRecords(all);
      })
      .catch(err => console.log(err));
  }, []);

  const filteredRecords = records.filter((record) => {
    const matchesSearch = searchTerm === "" ||
      record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.ref.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.purok.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !dateFilter || record.resolved === dateFilter;
    const matchesCategory = !categoryFilter || record.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesStatus = !statusFilter || record.status === statusFilter;
    return matchesSearch && matchesDate && matchesCategory && matchesStatus;
  });

  const categories = [...new Set(records.map(r => r.category))].sort();

  const getStatusBadge = (status) => {
    switch(status) {
      case "resolved": return "bg-green-100 text-green-700";
      case "verified": return "bg-blue-100 text-blue-700";
      case "in_progress": return "bg-orange-100 text-orange-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-1">
          Archive
        </p>
        <h1 className="text-3xl font-bold text-[#1e3a5f] mb-2">
          History & Records
        </h1>
        <p className="text-gray-500 text-sm">
          View all past reports — resolved, verified, and in-progress items.
          Search by title, ref, or purok. Filter by date, category, or status.
        </p>
      </div>

      <div className="bg-white border rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, ref or purok..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316]" />
          </div>

          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}
              className="bg-transparent text-sm text-gray-600 focus:outline-none" />
          </div>

          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#f97316]">
            <option value="">All categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#f97316]">
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>

          <button onClick={() => { setSearchTerm(""); setDateFilter(""); setCategoryFilter(""); setStatusFilter(""); }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600">Clear Filters</span>
          </button>
        </div>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">REF</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">STATUS</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">TITLE</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">PUROK</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">CATEGORY</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">UPDATED</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">DAYS TO FIX</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredRecords.map((record, index) => (
                <tr key={record.ref}
                  className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                  <td className="px-6 py-4"><span className="text-xs font-mono text-gray-500">{record.ref}</span></td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(record.status)}`}>
                      {record.status?.replace("_", " ").toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4"><span className="text-sm font-medium text-[#1e3a5f]">{record.title}</span></td>
                  <td className="px-6 py-4"><span className="text-sm text-gray-600">{record.purok}</span></td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">{record.category}</span>
                  </td>
                  <td className="px-6 py-4"><span className="text-sm text-gray-600">{record.resolved}</span></td>
                  <td className="px-6 py-4 text-right"><span className="text-sm font-semibold text-green-600">{record.daysToFix}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRecords.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <p>No records found. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
