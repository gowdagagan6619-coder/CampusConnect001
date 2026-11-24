import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  Calendar,
  Bell,
  BookOpen,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Users,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { eventService } from '../../services/eventService';
import { formatDate } from '../../utils/helpers';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventService.getEvents({ status: 'Upcoming' });
        setFeaturedEvents((data.events || []).slice(0, 3));
      } catch (err) {
        console.error('[Home] Failed to load featured events', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const features = [
    {
      title: 'Event Management & Booking',
      desc: 'Discover college hackathons, cultural festivals, sports meets, and workshops with real-time seat tracking and 1-click registration.',
      icon: Calendar,
      color: 'bg-blue-50 text-blue-600 border-blue-100',
    },
    {
      title: 'Broadcast Notice Board',
      desc: 'Stay informed with prioritized circulars, examination schedules, placement updates, and pinned urgent college alerts.',
      icon: Bell,
      color: 'bg-amber-50 text-amber-600 border-amber-100',
    },
    {
      title: 'Academic Study Repository',
      desc: 'Access semester-wise lecture notes, lab manuals, and syllabus resources uploaded directly by academic faculty.',
      icon: BookOpen,
      color: 'bg-purple-50 text-purple-600 border-purple-100',
    },
    {
      title: 'Administration Analytics',
      desc: 'Comprehensive oversight for college administrators to manage events, student directories, file repositories, and attendance rosters.',
      icon: ShieldCheck,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-800 flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-extrabold text-slate-900 tracking-tight block leading-tight">
                CampusConnect
              </span>
              <span className="text-[10px] text-slate-500 font-semibold block leading-none">
                Campus Management System
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to={user?.role === 'admin' ? '/admin' : '/dashboard'}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 transition-colors shadow-sm"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 text-white hover:bg-brand-700 transition-colors shadow-sm shadow-brand-500/20"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Unified College Life Management Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-tight">
            Connect, Collaborate & Thrive with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">
              CampusConnect
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            A centralized SaaS platform connecting college students and administrative authorities. Explore events, register in one click, download study materials, and access verified announcements.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {isAuthenticated ? (
              <Link
                to={user?.role === 'admin' ? '/admin' : '/dashboard'}
                className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold shadow-lg shadow-brand-500/25 flex items-center gap-2 transition-all hover:-translate-y-0.5"
              >
                <span>Launch Your {user?.role === 'admin' ? 'Admin' : 'Student'} Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold shadow-lg shadow-brand-500/25 flex items-center gap-2 transition-all hover:-translate-y-0.5"
                >
                  <span>Student Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/login"
                  className="px-6 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 text-sm font-bold border border-slate-300 shadow-sm flex items-center gap-2 transition-all hover:-translate-y-0.5"
                >
                  <span>Sign In (Student / Admin)</span>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Background gradient blur */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-16 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Engineered for Modern Academic Institutions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Eliminating fragmented notice boards and manual registrations with unified role-based workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200 shadow-card hover:shadow-soft transition-all space-y-3"
                >
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${feat.color}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{feat.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Campus Events Preview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Featured Upcoming Events
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Explore campus hackathons, sports championships, and workshops
              </p>
            </div>

            <Link
              to="/login"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Sign in to register</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredEvents.map((event) => (
              <div
                key={event._id}
                className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden flex flex-col justify-between"
              >
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge type="category" value={event.category} />
                    <span className="text-[11px] font-semibold text-slate-400">
                      {event.registeredCount} / {event.capacity} Booked
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                    {event.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="pt-2 text-xs text-slate-600 space-y-1">
                    <p>📅 {formatDate(event.eventDate)} at {event.eventTime}</p>
                    <p className="truncate">📍 {event.venue}</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-500">Free Registration</span>
                  <Link
                    to="/login"
                    className="font-bold text-brand-600 hover:text-brand-800"
                  >
                    Enroll Now &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-brand-600" />
            <span className="font-semibold text-slate-800">CampusConnect</span>
            <span>— Full-Stack Campus Management System</span>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="hover:text-slate-800">
              Sign In
            </Link>
            <Link to="/register" className="hover:text-slate-800">
              Register Student
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
