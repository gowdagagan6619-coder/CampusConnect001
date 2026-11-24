import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Filter } from 'lucide-react';
import MaterialCard from '../../components/cards/MaterialCard';
import EmptyState from '../../components/common/EmptyState';
import { CardSkeleton } from '../../components/common/Skeleton';
import { materialService } from '../../services/materialService';

const departments = [
  'All',
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'General',
];

const semesters = ['All', '1', '2', '3', '4', '5', '6', '7', '8'];

const StudyMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedSem, setSelectedSem] = useState('All');

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (selectedDept !== 'All') params.department = selectedDept;
      if (selectedSem !== 'All') params.semester = selectedSem;

      const data = await materialService.getMaterials(params);
      setMaterials(data.materials || []);
    } catch (error) {
      console.error('[StudyMaterials Error]', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMaterials();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, selectedDept, selectedSem]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Academic Study Repository
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Download lecture notes, lab manuals, slides, and syllabus sheets uploaded by faculty
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by subject, title or topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <Filter className="w-4 h-4 text-brand-600" />
          <span>Filters:</span>
        </div>

        {/* Department select */}
        <div className="w-full sm:w-64">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                Dept: {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Semester select */}
        <div className="w-full sm:w-44">
          <select
            value={selectedSem}
            onChange={(e) => setSelectedSem(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
          >
            {semesters.map((sem) => (
              <option key={sem} value={sem}>
                {sem === 'All' ? 'All Semesters' : `Semester ${sem}`}
              </option>
            ))}
          </select>
        </div>

        {(selectedDept !== 'All' || selectedSem !== 'All' || search) && (
          <button
            type="button"
            onClick={() => {
              setSelectedDept('All');
              setSelectedSem('All');
              setSearch('');
            }}
            className="text-xs font-bold text-brand-600 hover:text-brand-800 underline ml-auto"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Materials Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : materials.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No study materials found"
          description="There are currently no notes or slides uploaded matching your department and semester filters."
          actionLabel="Show All Materials"
          onAction={() => {
            setSelectedDept('All');
            setSelectedSem('All');
            setSearch('');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((material) => (
            <MaterialCard
              key={material._id}
              material={material}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudyMaterials;
