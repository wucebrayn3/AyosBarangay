import React, { useEffect, useState } from "react";
import { Shield, Users as UsersIcon, UserCog, UserPlus } from "lucide-react";
import api, { tokenStore, WS_BASE_URL } from "../../services/api";

const roleColor = (role) => {
  switch (role) {
    case "admin": return "bg-pink-100 text-pink-700";
    case "staff": return "bg-blue-100 text-blue-700";
    case "purok_leader": return "bg-purple-100 text-purple-700";
    default: return "bg-gray-100 text-gray-700";
  }
};

const displayRole = (role) => (role || "resident").replace("_", " ");

const Users = () => {
  const [users, setUsers] = useState([]);

  const loadUsers = () => {
    api.get("/users/")
      .then((res) => setUsers(res.data.map((user) => {
        const name = `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.username;
        return {
          ...user,
          name,
          initials: name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
          status: "Active",
        };
      })))
      .catch(console.log);
  };

  useEffect(() => {
    loadUsers();
    const token = tokenStore.getAccess();
    const socket = new WebSocket(`${WS_BASE_URL}/ws/users/${token ? `?token=${token}` : ""}`);
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "event" && message.entity === "user") loadUsers();
    };
    return () => socket.close();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-1">Access Control</p>
          <h1 className="text-3xl font-bold text-[#1e3a5f] mb-2">Users & Roles</h1>
        </div>
        <button className="flex items-center gap-2 bg-[#f97316] hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-lg shadow-orange-500/30">
          <UserPlus className="w-5 h-5" />
          Invite User
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border rounded-xl p-5">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
            <UsersIcon className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-[#1e3a5f]">{users.filter((u) => u.role === "resident").length}</p>
          <p className="text-sm text-gray-500">Residents</p>
        </div>
        <div className="bg-white border rounded-xl p-5">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-3">
            <Shield className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-[#1e3a5f]">{users.filter((u) => u.role === "purok_leader").length}</p>
          <p className="text-sm text-gray-500">Purok Leaders</p>
        </div>
        <div className="bg-white border rounded-xl p-5">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
            <UserCog className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-[#1e3a5f]">{users.filter((u) => u.role === "staff").length}</p>
          <p className="text-sm text-gray-500">Staff</p>
        </div>
        <div className="bg-white border rounded-xl p-5">
          <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-3">
            <Shield className="w-6 h-6 text-pink-600" />
          </div>
          <p className="text-3xl font-bold text-[#1e3a5f]">{users.filter((u) => u.role === "admin").length}</p>
          <p className="text-sm text-gray-500">Admins</p>
        </div>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                {["NAME", "EMAIL", "ROLE", "PUROK", "STATUS"].map((heading) => (
                  <th key={heading} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user, index) => (
                <tr key={user.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#1e3a5f] rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{user.initials}</span>
                      </div>
                      <span className="text-sm font-medium text-[#1e3a5f]">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4"><span className="text-sm text-gray-600">{user.email || "No email"}</span></td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${roleColor(user.role)}`}>
                      {displayRole(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4"><span className="text-sm text-gray-600">{user.purok || "-"}</span></td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
