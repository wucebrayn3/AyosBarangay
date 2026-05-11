import React, { useEffect, useState } from "react";
import { Shield, Users as UsersIcon, UserCog, UserPlus, X, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
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
  const [showInvite, setShowInvite] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [inviteForm, setInviteForm] = useState({ username: "", email: "", password: "", role: "resident", first_name: "", last_name: "" });

  const loadUsers = () => {
    api.get("/users/")
      .then((res) => setUsers(res.data.map((user) => {
        const name = `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.username;
        return {
          ...user,
          name,
          initials: name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
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

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      await api.post("/users/", inviteForm);
      setShowInvite(false);
      setInviteForm({ username: "", email: "", password: "", role: "resident", first_name: "", last_name: "" });
      loadUsers();
    } catch (err) {
      alert("Could not create user. " + (err.response?.data?.detail || JSON.stringify(err.response?.data) || err.message));
    }
  };

  const handleRoleChange = async (user, newRole) => {
    try {
      await api.patch(`/users/${user.id}/`, { role: newRole });
      loadUsers();
      setEditUser(null);
    } catch (err) {
      alert("Could not change role. " + (err.response?.data?.detail || err.message));
    }
  };

  const handleToggleActive = async (user) => {
    try {
      await api.patch(`/users/${user.id}/`, { is_active: !user.is_active });
      loadUsers();
    } catch (err) {
      alert("Could not update user. " + (err.response?.data?.detail || err.message));
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete user "${user.username}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/users/${user.id}/`);
      loadUsers();
    } catch (err) {
      alert("Could not delete user. " + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-1">Access Control</p>
          <h1 className="text-3xl font-bold text-[#1e3a5f] mb-2">Users & Roles</h1>
        </div>
        <button onClick={() => setShowInvite(true)}
          className="flex items-center gap-2 bg-[#f97316] hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-lg shadow-orange-500/30">
          <UserPlus className="w-5 h-5" /> Invite User
        </button>
      </div>

      {/* Invite Modal */}
      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowInvite(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div className="relative bg-white rounded-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#1e3a5f]">Invite User</h2>
              <button onClick={() => setShowInvite(false)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleInvite} className="space-y-4">
              <input required placeholder="Username" value={inviteForm.username} onChange={e => setInviteForm({...inviteForm, username: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316]" />
              <div className="flex gap-2">
                <input placeholder="First name" value={inviteForm.first_name} onChange={e => setInviteForm({...inviteForm, first_name: e.target.value})}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316]" />
                <input placeholder="Last name" value={inviteForm.last_name} onChange={e => setInviteForm({...inviteForm, last_name: e.target.value})}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316]" />
              </div>
              <input required type="email" placeholder="Email" value={inviteForm.email} onChange={e => setInviteForm({...inviteForm, email: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316]" />
              <input required type="password" placeholder="Password" value={inviteForm.password} onChange={e => setInviteForm({...inviteForm, password: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316]" />
              <select value={inviteForm.role} onChange={e => setInviteForm({...inviteForm, role: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316] bg-white">
                <option value="resident">Resident</option>
                <option value="staff">Staff</option>
                <option value="purok_leader">Purok Leader</option>
                <option value="admin">Admin</option>
              </select>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowInvite(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-[#f97316] text-white rounded-lg hover:bg-orange-600">Create User</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setEditUser(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div className="relative bg-white rounded-2xl max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-[#1e3a5f] mb-2">Change Role</h2>
            <p className="text-sm text-gray-500 mb-4">User: <strong>{editUser.username}</strong> (current: {displayRole(editUser.role)})</p>
            <div className="space-y-2">
              {["resident", "staff", "purok_leader", "admin"].map(role => (
                <button key={role} onClick={() => handleRoleChange(editUser, role)}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${editUser.role === role ? "bg-[#1e3a5f] text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                >{displayRole(role)}</button>
              ))}
            </div>
            <button onClick={() => setEditUser(null)} className="mt-4 w-full py-2 text-sm text-gray-500 hover:text-gray-700">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border rounded-xl p-5">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3"><UsersIcon className="w-6 h-6 text-blue-600" /></div>
          <p className="text-3xl font-bold text-[#1e3a5f]">{users.filter((u) => u.role === "resident").length}</p>
          <p className="text-sm text-gray-500">Residents</p>
        </div>
        <div className="bg-white border rounded-xl p-5">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-3"><Shield className="w-6 h-6 text-purple-600" /></div>
          <p className="text-3xl font-bold text-[#1e3a5f]">{users.filter((u) => u.role === "purok_leader").length}</p>
          <p className="text-sm text-gray-500">Purok Leaders</p>
        </div>
        <div className="bg-white border rounded-xl p-5">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3"><UserCog className="w-6 h-6 text-blue-600" /></div>
          <p className="text-3xl font-bold text-[#1e3a5f]">{users.filter((u) => u.role === "staff").length}</p>
          <p className="text-sm text-gray-500">Staff</p>
        </div>
        <div className="bg-white border rounded-xl p-5">
          <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-3"><Shield className="w-6 h-6 text-pink-600" /></div>
          <p className="text-3xl font-bold text-[#1e3a5f]">{users.filter((u) => u.role === "admin").length}</p>
          <p className="text-sm text-gray-500">Admins</p>
        </div>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                {["NAME", "EMAIL", "ROLE", "PUROK", "STATUS", "ACTIONS"].map((heading) => (
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
                    <button onClick={() => setEditUser(user)}
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity ${roleColor(user.role)}`}
                      title="Click to change role">
                      {displayRole(user.role)}
                    </button>
                  </td>
                  <td className="px-6 py-4"><span className="text-sm text-gray-600">{user.purok || "-"}</span></td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${user.is_active !== false ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {user.is_active !== false ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleToggleActive(user)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                        title={user.is_active !== false ? "Disable account" : "Enable account"}>
                        {user.is_active !== false ? <ToggleRight className="w-4 h-4 text-green-600" /> : <ToggleLeft className="w-4 h-4 text-gray-400" />}
                      </button>
                      <button onClick={() => handleDelete(user)}
                        className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete user">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
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
