import React, { useEffect, useState } from "react";
import { Users, Save, X } from "lucide-react";
import api from "../../services/api";

const TEAMS = ["Team Alpha", "Team Bravo", "Team Charlie"];

const WorkerAssignment = () => {
  const [issues, setIssues] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ team: "", assignee: "" });

  useEffect(() => {
    Promise.all([
      api.get("/infrastructure-issues/"),
      api.get("/assignments/"),
      api.get("/users/"),
    ])
      .then(([issueRes, assignRes, usersRes]) => {
        setIssues(issueRes.data);
        setAssignments(assignRes.data);
        setUsers(usersRes.data);
      })
      .catch(err => console.log(err));
  }, []);

  const getAssignment = (issueId) =>
    assignments.find(a => a.issue === issueId);

  const startEdit = (issueId) => {
    const a = getAssignment(issueId);
    setEditingId(issueId);
    setEditForm({
      team: a?.team || "",
      assignee: a?.assignee || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ team: "", assignee: "" });
  };

  const handleSave = async (issueId) => {
    const existing = getAssignment(issueId);
    const payload = {
      issue: issueId,
      team: editForm.team,
      assignee: editForm.assignee || users.find(u => u.role === "staff")?.id || users[0]?.id,
    };
    try {
      if (existing) {
        const res = await api.patch(`/assignments/${existing.id}/`, payload);
        setAssignments(prev => prev.map(a => a.id === existing.id ? res.data : a));
      } else {
        const res = await api.post("/assignments/", payload);
        setAssignments(prev => [...prev, res.data]);
      }
      cancelEdit();
    } catch (err) {
      alert("Could not save assignment. " + (err.response?.data?.detail || err.message));
    }
  };

  const teamCards = TEAMS.map(name => {
    const count = assignments.filter(a => a.team === name).length;
    const done = issues.filter(i => i.status === "resolved" && assignments.some(a => a.issue === i.id && a.team === name)).length;
    return { name, active: count, done, status: count > 0 ? "onfield" : "available" };
  });

  return (
    <div>
      <p className="text-xs font-bold text-orange-500 uppercase">Worker Assignment</p>
      <h1 className="text-2xl font-bold text-[#1e3a5f] mb-4">Maintenance Teams</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {teamCards.map((team, idx) => (
          <div key={idx} className="bg-white border rounded-xl p-4 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-[#1e3a5f] text-white rounded-lg flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-[#1e3a5f]">{team.name}</h2>
            <div className="flex justify-between text-xs mt-3">
              <div><p className="text-gray-500">ACTIVE</p><p className="font-bold">{team.active}</p></div>
              <div><p className="text-gray-500">DONE</p><p className="font-bold">{team.done}</p></div>
            </div>
            <span className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${
              team.status === "onfield" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"
            }`}>{team.status === "onfield" ? "On Field" : "Available"}</span>
          </div>
        ))}
      </div>

      <div className="bg-white border rounded-xl p-4 overflow-x-auto">
        <h2 className="font-bold text-[#1e3a5f] mb-3">Active Assignments</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="py-2">REF</th>
              <th className="py-2">TASK</th>
              <th className="py-2">TEAM</th>
              <th className="py-2">STATUS</th>
              <th className="py-2">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {issues.length === 0 ? (
              <tr><td colSpan="5" className="text-gray-400 py-4 text-center">No issues yet...</td></tr>
            ) : (
              issues.map((item) => {
                const assignment = getAssignment(item.id);
                const isEditing = editingId === item.id;
                return (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 font-mono text-xs">{item.id}</td>
                    <td className="py-3">{item.title}</td>
                    <td className="py-3">
                      {isEditing ? (
                        <select value={editForm.team} onChange={e => setEditForm({...editForm, team: e.target.value})}
                          className="border rounded px-2 py-1 text-xs">
                          <option value="">Select team</option>
                          {TEAMS.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      ) : (
                        <span className="text-xs font-medium">{assignment?.team || "Unassigned"}</span>
                      )}
                    </td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        item.status === "resolved" ? "bg-green-100 text-green-600"
                        : item.status === "in_progress" ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-600"
                      }`}>{item.status?.replace("_", " ").toUpperCase()}</span>
                    </td>
                    <td className="py-3">
                      {isEditing ? (
                        <div className="flex gap-1">
                          <button onClick={() => handleSave(item.id)}
                            className="p-1 bg-green-500 text-white rounded hover:bg-green-600"><Save className="w-3 h-3" /></button>
                          <button onClick={cancelEdit}
                            className="p-1 bg-gray-300 text-gray-600 rounded hover:bg-gray-400"><X className="w-3 h-3" /></button>
                        </div>
                      ) : (
                        <button onClick={() => startEdit(item.id)}
                          className="text-xs text-[#f97316] hover:text-orange-700 font-medium">Assign Team</button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkerAssignment;
