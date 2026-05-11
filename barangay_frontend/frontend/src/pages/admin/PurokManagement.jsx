import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import api from "../../services/api";

const PurokManagement = () => {
  const [puroks, setPuroks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", zone_code: "" });

  const loadPuroks = () => {
    api.get("/puroks/")
      .then(res => setPuroks(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => { loadPuroks(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    try {
      if (editing) {
        await api.patch(`/puroks/${editing}/`, form);
      } else {
        await api.post("/puroks/", form);
      }
      setShowForm(false);
      setEditing(null);
      setForm({ name: "", zone_code: "" });
      loadPuroks();
    } catch (err) {
      alert("Could not save purok. " + (err.response?.data?.detail || err.message));
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/puroks/${id}/`);
      loadPuroks();
    } catch (err) {
      alert("Could not delete purok. " + (err.response?.data?.detail || err.message));
    }
  };

  const startEdit = (p) => {
    setEditing(p.id);
    setForm({ name: p.name, zone_code: p.zone_code || "" });
    setShowForm(true);
  };

  return (
    <div>
      <p className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-1">Administration</p>
      <h1 className="text-3xl font-bold text-[#1e3a5f] mb-2">Purok Management</h1>
      <p className="text-gray-500 text-sm mb-6">Create, edit, and manage puroks across the barangay.</p>

      <div className="bg-white border rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-[#1e3a5f]">All Puroks ({puroks.length})</h2>
          <button onClick={() => { setShowForm(true); setEditing(null); setForm({ name: "", zone_code: "" }); }}
            className="flex items-center gap-2 bg-[#1e3a5f] hover:bg-[#0f2b4d] text-white text-xs px-4 py-2 rounded-lg transition-colors">
            <Plus className="w-4 h-4" /> Add Purok
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-gray-50 border rounded-xl p-4 mb-4 flex gap-3 items-end">
            <div className="flex-1">
              <label className="text-xs font-medium text-gray-600 mb-1 block">Purok Name *</label>
              <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                placeholder="e.g. Purok 1" className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]" />
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-gray-600 mb-1 block">Zone Code</label>
              <input type="text" value={form.zone_code} onChange={e => setForm({...form, zone_code: e.target.value})}
                placeholder="e.g. Z1" className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]" />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white text-xs px-4 py-2 rounded-lg transition-colors">
                <Check className="w-4 h-4" /> {editing ? "Update" : "Create"}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null); }}
                className="flex items-center gap-1 bg-gray-200 hover:bg-gray-300 text-gray-600 text-xs px-4 py-2 rounded-lg transition-colors">
                <X className="w-4 h-4" /> Cancel
              </button>
            </div>
          </form>
        )}

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="py-3 font-semibold">ID</th>
              <th className="py-3 font-semibold">Name</th>
              <th className="py-3 font-semibold">Zone Code</th>
              <th className="py-3 font-semibold">Created</th>
              <th className="py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {puroks.map(p => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="py-3 text-gray-500 font-mono text-xs">{p.id}</td>
                <td className="py-3 font-medium text-[#1e3a5f]">{p.name}</td>
                <td className="py-3 text-gray-500">{p.zone_code || "—"}</td>
                <td className="py-3 text-gray-500 text-xs">{new Date(p.created_at).toLocaleDateString()}</td>
                <td className="py-3 text-right">
                  <button onClick={() => startEdit(p)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(p.id, p.name)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {puroks.length === 0 && (
              <tr><td colSpan="5" className="py-8 text-center text-gray-400">No puroks yet. Add one above.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurokManagement;
