import React, { useEffect, useState } from "react";
import { MapPin, Flag, Check, X, Eye, User } from "lucide-react";
import api, { getImageUrl } from "../../services/api";

const Verification = () => {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filterType, setFilterType] = useState("all");

  const loadItems = () => {
    Promise.all([
      api.get("/infrastructure-issues/?ordering=-created_at"),
      api.get("/community-concerns/?ordering=-created_at"),
    ]).then(([infraRes, concernRes]) => {
      const all = [
        ...infraRes.data.map(i => ({ ...i, _type: "infrastructure" })),
        ...concernRes.data.map(i => ({ ...i, _type: "concern" })),
      ].filter(i => i.status === "pending");
      setItems(all);
    }).catch(err => console.log(err));
  };

  useEffect(() => { loadItems(); }, []);

  const getEndpoint = (item) =>
    item._type === "infrastructure" ? "/infrastructure-issues/" : "/community-concerns/";

  const handleApprove = async (item) => {
    try {
      await api.patch(`${getEndpoint(item)}${item.id}/`, { status: "verified", is_verified: true });
      loadItems();
    } catch (err) {
      alert("Could not approve. " + (err.response?.data?.detail || err.message));
    }
  };

  const handleReject = async (item) => {
    if (!window.confirm(`Reject this ${item._type} report? This will delete it.`)) return;
    try {
      await api.delete(`${getEndpoint(item)}${item.id}/`);
      loadItems();
    } catch (err) {
      alert("Could not reject. " + (err.response?.data?.detail || err.message));
    }
  };

  const getRef = (item) => {
    const prefix = item._type === "infrastructure" ? "INF" : "CON";
    return `${prefix}-${String(item.id).padStart(4, "0")}`;
  };

  const filtered = filterType === "all" ? items : items.filter(i => i._type === filterType);

  return (
    <div>

      <div className="mb-4">
        <p className="text-xs text-orange-400 uppercase font-bold">Incident Verification</p>
        <h1 className="text-3xl font-bold text-[#1e3a5f]">Pending Verification</h1>
        <p className="text-sm text-gray-500">Reports awaiting admin review — approve to mark as verified, or reject to remove.</p>
      </div>

      {/* Type filter */}
      <div className="bg-white border rounded-xl p-1 flex gap-1 mb-4 w-fit">
        {["all", "infrastructure", "concern"].map(t => (
          <button key={t} onClick={() => setFilterType(t)}
            className={`px-3 py-1.5 text-xs rounded-lg transition ${filterType === t ? "bg-[#1e3a5f] text-white" : "text-gray-600 hover:bg-gray-100"}`}
          >
            {t === "all" ? "All" : t === "infrastructure" ? "Infrastructure" : "Concerns"}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="text-gray-400">No items pending verification.</p>
        ) : (
          filtered.map((item) => (
            <div key={`${item._type}-${item.id}`} className="bg-white border rounded-xl p-4 flex gap-4 items-start">

              <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                {item.image ? (
                  <img src={getImageUrl(item.image)} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">No image</div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="font-mono">#{getRef(item)}</span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">{item._type}</span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span>{new Date(item.created_at).toLocaleDateString()}</span>
                </div>
                <h2 className="text-lg font-semibold text-[#1e3a5f] mt-1">{item.title}</h2>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{item.address_text || "No location"}</span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <User className="w-3.5 h-3.5" />
                  <span>{item.reporter_name || "Anonymous"}</span>
                </div>
                <div className="mt-2 inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg text-xs">
                  <Flag className="w-3 h-3" />
                  {item.status?.replace("_", " ").toUpperCase() || "PENDING"}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button onClick={() => handleApprove(item)}
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-2 rounded-lg transition-colors">
                  <Check className="w-3.5 h-3.5" /> Approve
                </button>
                <button onClick={() => handleReject(item)}
                  className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-2 rounded-lg transition-colors">
                  <X className="w-3.5 h-3.5" /> Reject
                </button>
                <button onClick={() => setSelected(selected === `${item._type}-${item.id}` ? null : `${item._type}-${item.id}`)}
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-2 rounded-lg transition-colors">
                  <Eye className="w-3.5 h-3.5" /> Details
                </button>
              </div>

            </div>
          ))
        )}
      </div>

      {selected && (() => {
        const [selType, selId] = selected.split("-");
        const item = items.find(i => i._type === selType && i.id === parseInt(selId));
        if (!item) return null;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
            <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <h2 className="text-xl font-bold text-[#1e3a5f] mb-4">{item.title}</h2>
              <p className="text-gray-600 mb-4">{item.description}</p>
              <div className="text-sm text-gray-500 space-y-1">
                <p><strong>Type:</strong> {item._type}</p>
                <p><strong>Category:</strong> {item.category}</p>
                <p><strong>Status:</strong> {item.status?.replace("_", " ")}</p>
                <p><strong>Location:</strong> {item.address_text || "N/A"}</p>
                <p><strong>Reporter:</strong> {item.reporter_name || "Anonymous"}</p>
                <p><strong>Created:</strong> {new Date(item.created_at).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelected(null)}
                className="mt-4 w-full bg-gray-100 hover:bg-gray-200 py-2 rounded-lg text-sm font-medium transition-colors">Close</button>
            </div>
          </div>
        );
      })()}

    </div>
  );
};

export default Verification;
