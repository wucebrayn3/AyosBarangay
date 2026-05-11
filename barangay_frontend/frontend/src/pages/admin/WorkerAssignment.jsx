import React, { useEffect, useState } from "react";
import { Users } from "lucide-react";
import api from "../../services/api";

const WorkerAssignment = () => {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    api.get("/infrastructure-issues/")
      .then(res => setIssues(res.data))
      .catch(err => console.log(err));
  }, []);

  // TEMP TEAM DATA (NO BACKEND YET)
  const teams = [
    { name: "Team Alpha", lead: "Juan Dela Cruz", active: 3, done: 8, status: "available" },
    { name: "Team Bravo", lead: "Maria Santos", active: 5, done: 6, status: "onfield" },
    { name: "Team Charlie", lead: "Pedro Reyes", active: 2, done: 10, status: "available" },
  ];

  return (
    <div>
      {/* LEFT LABEL */}
      <p className="text-xs font-bold text-orange-500 uppercase">
        Worker Assignment
      </p>

      {/* TITLE */}
      <h1 className="text-2xl font-bold text-[#1e3a5f] mb-4">
        Maintenance Teams
      </h1>

      {/* TEAM CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {teams.map((team, idx) => (
          <div key={idx} className="bg-white border rounded-xl p-4 hover:shadow-md transition-shadow">
            {/* ICON */}
            <div className="w-10 h-10 bg-[#1e3a5f] text-white rounded-lg flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>

            {/* TEAM NAME */}
            <h2 className="font-bold text-[#1e3a5f]">{team.name}</h2>

            {/* LEAD */}
            <p className="text-xs text-gray-500">
              Lead: <span className="font-medium">{team.lead}</span>
            </p>

            {/* STATS */}
            <div className="flex justify-between text-xs mt-3">
              <div>
                <p className="text-gray-500">ACTIVE</p>
                <p className="font-bold">{team.active}</p>
              </div>
              <div>
                <p className="text-gray-500">DONE</p>
                <p className="font-bold">{team.done}</p>
              </div>
            </div>

            {/* STATUS BADGES */}
            <div className="flex gap-2 mt-3">
              <span className={`text-xs px-2 py-1 rounded-full ${
                team.status === "onfield"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-green-100 text-green-600"
              }`}>
                {team.status === "onfield" ? "On Field" : "Available"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ASSIGNMENTS TABLE */}
      <div className="bg-white border rounded-xl p-4 overflow-x-auto">
        <h2 className="font-bold text-[#1e3a5f] mb-3">Active Assignments</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="py-2">REF</th>
              <th className="py-2">TASK</th>
              <th className="py-2">TEAM</th>
              <th className="py-2">DEADLINE</th>
              <th className="py-2">PRIORITY</th>
            </tr>
          </thead>
          <tbody>
            {issues.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-gray-400 py-4 text-center">
                  No assignments yet...
                </td>
              </tr>
            ) : (
              issues.slice(0, 5).map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 font-mono text-xs">{item.reference_number}</td>
                  <td className="py-3">{item.title}</td>
                  <td className="py-3">Team Alpha</td>
                  <td className="py-3">{item.created_at?.slice(0, 10)}</td>
                  <td className="py-3">
                    <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">
                      Medium
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkerAssignment;