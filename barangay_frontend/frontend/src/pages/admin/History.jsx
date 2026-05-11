import React, { useState } from "react";
import { Search, Calendar, Filter } from "lucide-react";

const History = () => {
  const [records] = useState([
    {
      ref: "#AB-1036",
      title: "Stray dogs roaming near school",
      purok: "Purok 6",
      category: "Safety",
      resolved: "2026-04-18",
      daysToFix: "3d"
    },
    {
      ref: "#AB-1029",
      title: "Open manhole on Bonifacio St.",
      purok: "Purok 3",
      category: "Pothole",
      resolved: "2026-04-15",
      daysToFix: "2d"
    },
    {
      ref: "#AB-1024",
      title: "Garbage piled at corner lot",
      purok: "Purok 7",
      category: "Garbage",
      resolved: "2026-04-12",
      daysToFix: "5d"
    },
    {
      ref: "#AB-1018",
      title: "Streetlight repair completed",
      purok: "Purok 2",
      category: "Streetlight",
      resolved: "2026-04-09",
      daysToFix: "4d"
    },
    {
      ref: "#AB-1015",
      title: "Drainage clearing finished",
      purok: "Purok 5",
      category: "Drainage",
      resolved: "2026-04-05",
      daysToFix: "7d"
    },
    {
      ref: "#AB-1010",
      title: "Flood markers installed in Purok 1",
      purok: "Purok 1",
      category: "Flooding",
      resolved: "2026-04-01",
      daysToFix: "6d"
    },
    {
      ref: "#AB-1005",
      title: "Noise complaint resolved - barangay fiesta",
      purok: "Purok 4",
      category: "Noise",
      resolved: "2026-03-28",
      daysToFix: "1d"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredRecords = records.filter((record) =>
    record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.ref.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.purok.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-1">
          Archive
        </p>
        <h1 className="text-3xl font-bold text-[#1e3a5f] mb-2">
          History & Records
        </h1>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, ref or purok..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent"
            />
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input
              type="date"
              className="bg-transparent text-sm text-gray-600 focus:outline-none"
            />
          </div>

          {/* Category Filter */}
          <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#f97316]">
            <option>All categories</option>
            <option>Flooding</option>
            <option>Pothole</option>
            <option>Garbage</option>
            <option>Streetlight</option>
            <option>Drainage</option>
            <option>Fire</option>
          </select>

          <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600">More Filters</span>
          </button>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  REF
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  TITLE
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  PUROK
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  CATEGORY
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  RESOLVED
                </th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  DAYS TO FIX
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredRecords.map((record, index) => (
                <tr 
                  key={record.ref}
                  className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
                >
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono text-gray-500">{record.ref}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-[#1e3a5f] hover:text-orange-600 cursor-pointer">
                      {record.title}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{record.purok}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {record.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{record.resolved}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-semibold text-green-600">
                      {record.daysToFix}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRecords.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <p>No records found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;