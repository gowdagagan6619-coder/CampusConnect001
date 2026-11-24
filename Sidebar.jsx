import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  CheckCircle2,
  Bell,
  BookOpen,
  User,
  BarChart3,
  Users,
  LogOut,
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, isAdmin, logout } = useAuth();

  const studentNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Explore Events', path: '/events', icon: Calendar },
    { name: 'My Registrations', path: '/my-registrations', icon: CheckCircle2 },
    { name: 'Announcements', path: '/announcements', icon: Bell },
    { name: 'Study Materials', path: '/materials', icon: BookOpen },
    { name: 'My Profile', path: '/profile', icon: User },
  ];

  const adminNavItems = [
    { name: 'Analytics Overview', path: '/admin', icon: BarChart3 },
    { name: 'Manage Events', path: '/admin/events', icon: Calendar },
    { name: 'Announcements', path: '/admin/announcements', icon: Bell },
    { name: 'Study Materials', path: '/admin/materials', icon: BookOpen },
    { name: 'Student Directory', path: '/admin/students', icon: Users },
  ];

  const navItems = isAdmin ? adminNavItems : studentNavItems;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col justify-between`}
      >
        {/* Navigation Links */}
        <div className="p-4 space-y-1 overflow-y-auto">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {isAdmin ? 'Administration Portal' : 'Student Menu'}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 shadow-sm shadow-brand-500/10'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-brand-600' : 'text-slate-400'
                      }`}
                    />
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Bottom Profile Summary & Sign Out */}
        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 mb-2">
            <p className="text-xs font-bold text-slate-800 truncate">{user?.name}</p>
            <p className="text-[11px] text-slate-500 truncate">{user?.department || user?.email}</p>
          </div>

          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 w-full transition-colors"
          >
            <LogOut className="w-4 h-4 text-rose-500" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
