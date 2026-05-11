import React, { useEffect, useState } from "react";
import { AlertTriangle, Phone, MapPin } from "lucide-react";
import api, { WS_BASE_URL } from "../../services/api";

const Emergencies = () => {
  const [issues, setIssues] = useState([]);

  const loadEmergencies = () => api.get("/emergency-alerts/")
    .then(res => setIssues(res.data))
    .catch(err => console.log(err));

  useEffect(() => {
    loadEmergencies();
    const socket = new WebSocket(`${WS_BASE_URL}/ws/issues/`);
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.entity === "emergency_alert") loadEmergencies();
    };
    return () => socket.close();
  }, []);

  const handleAcknowledge = async (id) => {
    try {
      await api.patch(`/emergency-alerts/${id}/`, { acknowledged: true });
      loadEmergencies();
    } catch (err) {
      alert("Could not acknowledge. " + (err.response?.data?.detail || err.message));
    }
  };

  const handleResolve = async (id) => {
    if (!window.confirm("Mark this emergency as resolved?")) return;
    try {
      await api.delete(`/emergency-alerts/${id}/`);
      loadEmergencies();
    } catch (err) {
      alert("Could not resolve. " + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <div>
      {/* HEADER RED BOX */}
      <div className="bg-red-600 text-white rounded-xl p-6 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <AlertTriangle className="w-10 h-10" />
          <div>
            <h1 className="text-xl font-bold">Emergency Response Center</h1>
            <p className="text-sm text-red-100">
              Active incidents - coordinate response immediately.
            </p>
          </div>
        </div>
      </div>

      {/* CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {issues.length === 0 ? (
          <p className="text-gray-500 col-span-2">No emergencies reported...</p>
        ) : (
          issues
            .map((item) => (
              <div
                key={item.id}
                className="bg-white border rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                {/* TOP LABEL */}
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] px-2 py-1 rounded-full text-white ${
                    item.acknowledged ? "bg-orange-400" : "bg-red-500"
                  }`}>
                    {item.acknowledged ? "ACKNOWLEDGED" : "NEW"}
                  </span>
                  <span className="text-xs font-mono text-gray-500">
                    #{`EM-${String(item.id).padStart(3, '0')}`}
                  </span>
                </div>

                {/* TITLE */}
                <h2 className="text-lg font-semibold text-[#1e3a5f] mt-2">
                  {item.title}
                </h2>

                {/* DESCRIPTION */}
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>

                {/* LOCATION */}
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {item.latitude && item.longitude ? `${item.latitude}, ${item.longitude}` : "Location not tagged"}
                </div>

                {/* CONTACT */}
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{item.contact_number || "No contact number"}</span>
                </div>

                {/* BUTTONS */}
                <div className="flex gap-2 mt-4">
                  {!item.acknowledged && (
                    <button
                      onClick={() => handleAcknowledge(item.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs py-2 rounded-lg transition-colors"
                    >
                      Acknowledge
                    </button>
                  )}
                  <button
                    onClick={() => handleResolve(item.id)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs py-2 rounded-lg transition-colors"
                  >
                    Mark Resolved
                  </button>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default Emergencies;
