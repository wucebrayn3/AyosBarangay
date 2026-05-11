import React, { useState, useRef, useEffect } from 'react';
import {
    Search, Bell, LayoutDashboard, FileText, ShieldCheck, Siren,
    Users, BarChart3, MessageSquare, History, Settings, Building2, Map, LogOut, ChevronDown
} from 'lucide-react';
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { tokenStore, authApi } from '../../../services/api';

/* ─────────────────────────────────────────
   SIDEBAR
───────────────────────────────────────── */
const Sidebar = () => {
    return (
        <div className="w-64 bg-[#1e3a5f] text-white px-4 py-4 flex flex-col h-screen sticky top-0">

            {/* LOGO */}
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-[#f97316] flex items-center justify-center shadow-md">
                    <Building2 className="w-5 h-5 text-white" />
                </div>
                <div className="leading-tight">
                    <h1 className="text-base font-bold">AyosBarangay</h1>
                    <p className="text-[10px] text-blue-100 uppercase tracking-wider">Admin Console</p>
                </div>
            </div>

            {/* NAVIGATION */}
            <div className="flex-1 space-y-4 overflow-y-auto">

                {/* OVERVIEW */}
                <div>
                    <p className="text-[10px] uppercase text-blue-200 mb-1 tracking-wider">Overview</p>
                    <NavLink
                        to="/admin/dashboard"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 rounded-xl transition ${
                            isActive ? "bg-[#f97316] text-white" : "hover:bg-white/10"
                            }`
                        }
                    >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                    </NavLink>
                </div>

                {/* OPERATIONS */}
                <div>
                    <p className="text-[10px] uppercase text-blue-200 mb-1 tracking-wider">Operations</p>
                    <div className="space-y-1.5">
                        <NavLink
                            to="/admin/reports"
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2 rounded-xl transition ${
                                isActive ? "bg-[#f97316] text-white" : "hover:bg-white/10"
                                }`
                            }
                        >
                            <FileText className="w-4 h-4" />
                            Reports
                        </NavLink>

                        <NavLink
                            to="/admin/verification"
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2 rounded-xl transition ${
                                isActive ? "bg-[#f97316] text-white" : "hover:bg-white/10"
                                }`
                            }
                        >
                            <ShieldCheck className="w-4 h-4" />
                            Verification
                        </NavLink>

                        <NavLink
                            to="/admin/emergencies"
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2 rounded-xl transition ${
                                isActive ? "bg-[#f97316] text-white" : "hover:bg-white/10"
                                }`
                            }
                        >
                            <Siren className="w-4 h-4" />
                            Emergencies
                        </NavLink>

                        <NavLink
                            to="/admin/worker-assignment"
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2 rounded-xl transition ${
                                isActive ? "bg-[#f97316] text-white" : "hover:bg-white/10"
                                }`
                            }
                        >
                            <Users className="w-4 h-4" />
                            Worker Assignment
                        </NavLink>
                    </div>
                </div>

                {/* INSIGHTS */}
                <div>
                    <p className="text-[10px] uppercase text-blue-200 mb-1 tracking-wider">Insights</p>
                    <div className="space-y-1.5">
                        <NavLink
                            to="/admin/analytics"
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2 rounded-xl transition ${
                                isActive ? "bg-[#f97316] text-white" : "hover:bg-white/10"
                                }`
                            }
                        >
                            <BarChart3 className="w-4 h-4" />
                            Per-Purok Analytics
                        </NavLink>

                        <NavLink
                            to="/admin/feedback"
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2 rounded-xl transition ${
                                isActive ? "bg-[#f97316] text-white" : "hover:bg-white/10"
                                }`
                            }
                        >
                            <MessageSquare className="w-4 h-4" />
                            Comments & Feedback
                        </NavLink>

                        <NavLink
                            to="/admin/history"
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2 rounded-xl transition ${
                                isActive ? "bg-[#f97316] text-white" : "hover:bg-white/10"
                                }`
                            }
                        >
                            <History className="w-4 h-4" />
                            History & Records
                        </NavLink>
                    </div>
                </div>

                {/* ADMINISTRATION */}
                <div>
                    <p className="text-[10px] uppercase text-blue-200 mb-1 tracking-wider">Administration</p>
                    <div className="space-y-1.5">
                        <NavLink
                            to="/admin/users"
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2 rounded-xl transition ${
                                isActive ? "bg-[#f97316] text-white" : "hover:bg-white/10"
                                }`
                            }
                        >
                            <Users className="w-4 h-4" />
                            Users & Roles
                        </NavLink>

                        <NavLink
                            to="/admin/puroks"
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2 rounded-xl transition ${
                                isActive ? "bg-[#f97316] text-white" : "hover:bg-white/10"
                                }`
                            }
                        >
                            <Map className="w-4 h-4" />
                            Purok Management
                        </NavLink>

                        <NavLink
                            to="/admin/settings"
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2 rounded-xl transition ${
                                isActive ? "bg-[#f97316] text-white" : "hover:bg-white/10"
                                }`
                            }
                        >
                            <Settings className="w-4 h-4" />
                            Settings
                        </NavLink>
                    </div>
                </div>

            </div>
        </div>
    );
};

/* ─────────────────────────────────────────
   TOPBAR
───────────────────────────────────────── */
const TopBar = () => {
    const user = tokenStore.getUser();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClick = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleLogout = async () => {
        const refresh = tokenStore.getRefresh();
        try {
            if (refresh) await authApi.logout(refresh);
        } catch { /* ignore */ }
        tokenStore.clear();
        navigate('/');
    };

    const initials = user
        ? `${(user.first_name || '')[0] || ''}${(user.last_name || '')[0] || ''}`.toUpperCase() || user.username?.[0]?.toUpperCase() || 'A'
        : 'A';

    return (
        <div className="flex justify-between items-center px-6 py-4 bg-[#f4f7fb] border-b">

            <div className="relative">
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input
                    placeholder="Search reports..."
                    className="w-96 bg-white border rounded-xl pl-12 pr-4 py-3"
                />
            </div>

            <div className="flex items-center gap-4">
                <button className="w-10 h-10 bg-white border rounded-xl flex items-center justify-center">
                    <Bell className="w-5 h-5" />
                </button>

                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border hover:bg-gray-50 transition-colors"
                    >
                        <div className="w-10 h-10 bg-[#1e3a5f] rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">{initials}</span>
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-semibold">{user?.username || 'Admin User'}</p>
                            <p className="text-xs text-gray-500">{user?.role || 'Administrator'}</p>
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                    {showDropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

/* ─────────────────────────────────────────
   ADMIN LAYOUT
───────────────────────────────────────── */
const AdminLayout = () => {
    return (
        <div className="flex min-h-screen bg-[#f4f7fb]">

            {/* SIDEBAR */}
            <Sidebar />

            {/* MAIN CONTENT */}
            <div className="flex-1">
                <TopBar />

                <div className="p-6">
                    <Outlet />
                </div>
            </div>

        </div>
    );
};

export default AdminLayout;
