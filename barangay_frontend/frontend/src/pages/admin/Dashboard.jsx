import React, { useEffect, useState } from "react";
import api, { apiCategoryToLabel } from "../../services/api";

const Dashboard = () => {

    const [summary, setSummary] = useState({});
    const [recent, setRecent] = useState([]);
    const [puroks, setPuroks] = useState([]);

    useEffect(() => {
        Promise.all([
            api.get("/dashboard/summary/"),
            api.get("/infrastructure-issues/?ordering=-created_at"),
            api.get("/community-concerns/?ordering=-created_at"),
            api.get("/puroks/"),
        ])
        .then(([summaryRes, infraRes, concernRes, purokRes]) => {
            setSummary(summaryRes.data);
            setRecent([
                ...infraRes.data.filter(i => i.status !== "resolved").map((item) => ({ ...item, type: "Infrastructure" })),
                ...concernRes.data.filter(i => i.status !== "resolved").map((item) => ({ ...item, type: "Concern" })),
            ].slice(0, 6));
            setPuroks(purokRes.data);
        })
        .catch(err => console.log(err));
    }, []);

    const total = (summary.infrastructure_total || 0) + (summary.concerns_total || 0);
    const pending = summary.pending_total || 0;
    const resolved = summary.resolved_total || 0;
    const inProgress = recent.filter(i => i.status === "in_progress").length;

    return (
        <div>

            {/* STATS */}
            <div className="grid grid-cols-4 gap-4 mb-6">

                <div className="bg-white p-4 rounded-xl border">
                    Total Reports <h2 className="text-xl font-bold">{total}</h2>
                </div>

                <div className="bg-white p-4 rounded-xl border">
                    Pending <h2 className="text-xl font-bold text-yellow-500">{pending}</h2>
                </div>

                <div className="bg-white p-4 rounded-xl border">
                    In Progress <h2 className="text-xl font-bold text-orange-500">{inProgress}</h2>
                </div>

                <div className="bg-white p-4 rounded-xl border">
                    Resolved <h2 className="text-xl font-bold text-green-500">{resolved}</h2>
                </div>

            </div>

            {/* TABLE + CHART */}
            <div className="grid grid-cols-2 gap-4">

                <div className="bg-white p-4 rounded-xl border">
                    <h3 className="font-bold mb-3">Recent Reports</h3>
                    <div className="space-y-2">
                        {recent.length === 0 ? (
                            <p className="text-gray-400 text-sm">No data yet</p>
                        ) : recent.map((item) => (
                            <div key={`${item.type}-${item.id}`} className="flex justify-between border-b pb-2 text-sm">
                                <span className="text-[#1e3a5f]">{item.title}</span>
                                <span className="text-gray-500">{apiCategoryToLabel(item.category)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl border">
                    <h3 className="font-bold mb-3">Complaints per Purok</h3>
                    <div className="space-y-2">
                        {puroks.map((purok) => (
                            <div key={purok.id} className="flex justify-between text-sm">
                                <span>{purok.name}</span>
                                <span className="font-semibold">{(purok.total_infrastructure_issues || 0) + (purok.total_community_concerns || 0)}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

        </div>
    );
};

export default Dashboard;
