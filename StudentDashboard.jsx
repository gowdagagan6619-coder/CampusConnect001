import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Calendar,
  CheckCircle2,
  Bell,
  BookOpen,
  ArrowRight,
  Sparkles,
  Pin,
  Clock,
  MapPin,
} from 'lucide-react';
import StatCard from '../../components/cards/StatCard';
import EventCard from '../../components/cards/EventCard';
import { CardSkeleton, StatSkeleton } from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';
import Badge from '../../components/common/Badge';
import { eventService } from '../../services/eventService';
import { announcementService } from '../../services/announcementService';
import { materialService } from '../../services/materialService';
import { formatDate } from '../../utils/helpers';

const StudentDashboard = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    registeredEventsCount: 0,
    upcomingEventsCount: 0,
    announcementsCount: 0,
    materialsCount: 0,
  });

  const [myRegistrations, setMyRegistrations] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pinnedAnnouncements, setPinnedAnnouncements] = useState([]);
  const [registeringId, setRegisteringId] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [regRes, eventsRes, announceRes, materialsRes] = await Promise.all([
        eventService.getMyRegistrations(),
        eventService.getEvents({ status: 'Upcoming' }),
        announcementService.getAnnouncements(),
        materialService.getMaterials(),
      ]);

      setMyRegistrations(regRes.registrations || []);
      setUpcomingEvents((eventsRes.events || []).slice(0, 3));

      // Extract pinned announcements
      const pinned = (announceRes.announcements || []).filter(
        (a) => a.isPinned || a.priority === 'urgent'
      );
      setPinnedAnnouncements(pinned.slice(0, 2));

      setStats({
        registeredEventsCount: regRes.count || 0,
        upcomingEventsCount: eventsRes.count || 0,
        announcementsCount: announceRes.count || 0,
        materialsCount: materialsRes.count || 0,
      });
    } catch (error) {
      console.error('[StudentDashboard Error]', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRegisterEvent = async (eventId) => {
    try {
      setRegisteringId(eventId);
      await eventService.registerForEvent(eventId);
      await fetchDashboardData(); // Refresh data
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to register for event');
    } finally {
      setRegisteringId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-700 via-indigo-600 to-brand-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-brand-900/10 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-brand-100 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Student Academic Portal</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Student'}! 👋
          </h1>

          <p className="text-sm text-brand-100 leading-relaxed">
            You are enrolled in{' '}
            <strong className="text-white font-semibold">
              {user?.department || 'Engineering'}
            </strong>{' '}
            — Semester {user?.semester || 1}. Track your registered events, campus notices, and academic study resources below.
          </p>
        </div>

        {/* Decorative corner glow */}
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Metric Counters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              title="My Registrations"
              value={stats.registeredEventsCount}
              icon={CheckCircle2}
              color="emerald"
              subtitle="Events you joined"
            />
            <StatCard
              title="Upcoming Events"
              value={stats.upcomingEventsCount}
              icon={Calendar}
              color="indigo"
              subtitle="Scheduled this term"
            />
            <StatCard
              title="Campus Notices"
              value={stats.announcementsCount}
              icon={Bell}
              color="amber"
              subtitle="Latest announcements"
            />
            <StatCard
              title="Study Resources"
              value={stats.materialsCount}
              icon={BookOpen}
              color="purple"
              subtitle="Lecture files & notes"
            />
          </>
        )}
      </div>

      {/* Pinned & Urgent Announcements Banner */}
      {pinnedAnnouncements.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Pin className="w-4 h-4 text-amber-500 fill-amber-500" />
              Pinned Campus Alerts
            </h2>
            <Link
              to="/announcements"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              <span>View Notice Board</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pinnedAnnouncements.map((notice) => (
              <div
                key={notice._id}
                className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 shadow-sm space-y-2 relative"
              >
                <div className="flex items-center gap-2">
                  <Badge type="priority" value={notice.priority} dot />
                  <Badge type="category" value={notice.category} />
                  <span className="text-[11px] text-slate-400 ml-auto">
                    {formatDate(notice.createdAt)}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                  {notice.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {notice.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Your Upcoming Registered Events */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Your Enrolled Events Schedule
            </h2>
            <p className="text-xs text-slate-500">
              Campus activities and competitions you have registered for
            </p>
          </div>
          {myRegistrations.length > 0 && (
            <Link
              to="/my-registrations"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              <span>Manage Registrations ({myRegistrations.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : myRegistrations.length === 0 ? (
          <EmptyState
            title="No event registrations yet"
            description="You have not enrolled in any upcoming campus events or competitions yet. Explore the events calendar to register!"
            actionLabel="Explore Campus Events"
            onAction={() => (window.location.href = '/events')}
            actionIcon={Calendar}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {myRegistrations.slice(0, 3).map((reg) => {
              const event = reg.event;
              if (!event) return null;
              return (
                <div
                  key={reg._id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-card space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge type="category" value={event.category} />
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        Confirmed
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                      {event.title}
                    </h3>

                    <div className="space-y-1 text-xs text-slate-500 pt-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-brand-600" />
                        <span>{formatDate(event.eventDate)} at {event.eventTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-brand-600" />
                        <span className="truncate">{event.venue}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span>Enrolled on {formatDate(reg.registrationDate)}</span>
                    <Link
                      to="/my-registrations"
                      className="font-bold text-brand-600 hover:text-brand-700"
                    >
                      View Details &rarr;
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Explore More Upcoming Events */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Featured Campus Events
            </h2>
            <p className="text-xs text-slate-500">
              Discover and join hackathons, cultural festivals, sports, and workshops
            </p>
          </div>
          <Link
            to="/events"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            <span>Explore All Events</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onRegister={handleRegisterEvent}
                isRegistering={registeringId === event._id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
