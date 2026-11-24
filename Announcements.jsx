import React, { useState, useEffect } from 'react';
import { Search, Bell, Pin } from 'lucide-react';
import AnnouncementCard from '../../components/cards/AnnouncementCard';
import EmptyState from '../../components/common/EmptyState';
import { CardSkeleton } from '../../components/common/Skeleton';
import { announcementService } from '../../services/announcementService';

const priorities = ['All', 'urgent', 'high', 'medium', 'low'];
const categories = ['All', 'Exam', 'Placement', 'Academic', 'Event', 'General'];

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (selectedPriority !== 'All') params.priority = selectedPriority;
      if (selectedCategory !== 'All') params.category = selectedCategory;

      const data = await announcementService.getAnnouncements(params);
      setAnnouncements(data.announcements || []);
    } catch (error) {
      console.error('[Announcements Error]', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAnnouncements();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, selectedPriority, selectedCategory]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Campus Notice Board
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Official announcements, examination circulars, placement notifications, and campus updates
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search circulars and notices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        {/* Priority Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
            Priority:
          </span>
          {priorities.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setSelectedPriority(p)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize transition-all ${
                selectedPriority === p
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
            Topic:
          </span>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === c
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Announcements List */}
      {loading ? (
        <div className="space-y-4">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : announcements.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notices found"
          description="No official circulars match your current search terms or filters."
          actionLabel="Reset Filters"
          onAction={() => {
            setSearch('');
            setSelectedPriority('All');
            setSelectedCategory('All');
          }}
        />
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <AnnouncementCard
              key={announcement._id}
              announcement={announcement}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Announcements;
