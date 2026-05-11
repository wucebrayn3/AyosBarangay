import React, { useEffect, useState } from 'react';
import { Filter, Download, MapPin, Calendar, MessageSquare, ArrowUp } from 'lucide-react';
import api, { apiCategoryToLabel, statusToFrontend } from '../../services/api';

const Reports = () => {

    const [reports, setReports] = useState([]);

    useEffect(() => {
        Promise.all([
            api.get('/infrastructure-issues/?ordering=-created_at'),
            api.get('/community-concerns/?ordering=-created_at'),
        ])
        .then(([infraRes, concernRes]) => setReports([
            ...infraRes.data.map((item) => ({ ...item, type: 'Infrastructure' })),
            ...concernRes.data.map((item) => ({ ...item, type: 'Concern' })),
        ]))
        .catch(err => console.log(err));
    }, []);

    const getStatusStyle = (status) => {
        switch (status) {
            case "pending":     return "bg-yellow-100 text-yellow-700";
            case "in_progress": return "bg-orange-100 text-orange-600";
            case "resolved":    return "bg-green-100 text-green-600";
            case "verified":    return "bg-blue-100 text-blue-600";
            default:            return "bg-gray-100 text-gray-600";
        }
    };

    return (
        <div>

            {/* HEADER */}
            <div className="mb-4">
                <p className="text-xs font-bold text-orange-400 uppercase">Issue Management</p>
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-[#1e3a5f]">All Reports</h1>
                        <p className="text-gray-500 text-sm">Review, verify, and manage every reported concern.</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 bg-white border px-3 py-2 rounded-lg text-sm">
                            <Filter className="w-4 h-4" />
                            Filter
                        </button>
                        <button className="flex items-center gap-2 bg-[#1e3a5f] text-white border px-3 py-2 rounded-lg text-sm">
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    </div>
                </div>
            </div>

            {/* FILTER TABS */}
            <div className="bg-white border rounded-xl p-2 flex gap-2 mb-5 w-fit">
                {["All", "Pending", "Verified", "In Progress", "Resolved"].map((item) => (
                    <button
                        key={item}
                        className={`px-4 py-1.5 text-sm rounded-lg transition ${
                            item === "All" ? "bg-[#1e3a5f] text-white" : "text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                        {item}
                    </button>
                ))}
            </div>

            {/* REPORT GRID */}
            <div className="grid grid-cols-3 gap-3">
                {reports.length === 0 ? (
                    <p className="text-gray-500">No reports found...</p>
                ) : (
                    reports.map((r) => (
                        <div key={r.id} className="bg-white border rounded-xl p-4 hover:shadow-sm transition">

                            <span className={`text-[11px] px-2 py-1 rounded-full ${getStatusStyle(r.status)}`}>
                                {statusToFrontend(r.status)}
                            </span>

                            <h2 className="font-semibold text-[#1e3a5f] text-base mt-2 leading-snug">{r.title}</h2>
                            <p className="text-xs text-orange-600 mt-1">{apiCategoryToLabel(r.category)}</p>

                            <p className="text-xs text-gray-500 mt-1">
                                Reported by <span className="font-medium">{r.reported_by || "Anonymous"}</span>
                            </p>

                            <div className="flex justify-between text-[11px] text-gray-500 mt-3">
                                <div className="flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5" /> {r.address_text || `Purok ${r.purok || ''}`}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5" /> {r.created_at?.slice(0, 10)}
                                </div>
                            </div>

                            <div className="flex justify-between text-sm text-gray-600 mt-3 pt-2 border-t">
                                <div className="flex items-center gap-1 text-xs">
                                    <MessageSquare className="w-3.5 h-3.5" /> 0
                                </div>
                                <div className="flex items-center gap-1 text-xs">
                                    <ArrowUp className="w-3.5 h-3.5" /> {r.upvote_count || 0}
                                </div>
                            </div>

                            <div className="flex gap-2 mt-3">
                                <button className="flex-1 bg-[#1e3a5f] text-white text-xs py-2 rounded-lg">{r.type}</button>
                                <button className="flex-1 bg-orange-100 text-orange-600 text-xs py-2 rounded-lg">Assign</button>
                            </div>

                        </div>
                    ))
                )}
            </div>

        </div>
    );
};

export default Reports;
