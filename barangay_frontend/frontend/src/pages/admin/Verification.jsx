import React, { useEffect, useState } from "react";
import { MapPin, Flag, Check, X, Eye, User } from "lucide-react";
import api from "../../services/api";

const Verification = () => {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    api.get("/infrastructure-issues/")
      .then(res => setIssues(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>

      {/* HEADER */}
      <div className="mb-4">
        <p className="text-xs text-orange-400 uppercase font-bold">
          Incident Verification
        </p>
        <h1 className="text-3xl font-bold text-[#1e3a5f]">
          Pending Verification
        </h1>
        <p className="text-sm text-gray-500">
          Reports awaiting admin review
        </p>
      </div>

      {/* CARDS */}
      <div className="space-y-3">

        {issues.length === 0 ? (
          <p className="text-gray-400">No verification items yet...</p>
        ) : (
          issues.map((item) => (
            <div
                key={item.id}
                className="bg-white border rounded-xl p-4 flex gap-4 items-start"
                >

                {/* IMAGE */}
                <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0" />

                {/* CONTENT */}
                <div className="flex-1">

                    {/* CODE + TIME */}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="font-mono">#{item.reference_number || "AB-0000"}</span>
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    <span>2 hours ago</span>
                    </div>

                    {/* TITLE */}
                    <h2 className="text-lg font-semibold text-[#1e3a5f] mt-1">
                    {item.title}
                    </h2>

                    {/* LOCATION + REPORTER */}
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{item.location}</span>

                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>

                    <User className="w-3.5 h-3.5" />
                    <span>{item.reported_by || "Anonymous"}</span>
                    </div>

                    {/* FLAG NOTICE */}
                    <div className="mt-3 inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg text-xs">
                    <Flag className="w-3 h-3" />
                    Possible duplicate of #AB-1043
                    </div>

                </div>

                {/* ACTION BUTTONS */}
                <div className="flex flex-col gap-2">

                    <button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-2 rounded-lg">
                    <Check className="w-3.5 h-3.5" />
                    Approve
                    </button>

                    <button className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-2 rounded-lg">
                    <X className="w-3.5 h-3.5" />
                    Reject
                    </button>

                    <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-2 rounded-lg">
                    <Eye className="w-3.5 h-3.5" />
                    Details
                    </button>

                </div>

            </div>
          ))
        )}

      </div>

    </div>
  );
};

export default Verification;