import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft, Home } from 'lucide-react';
import Button from '../../components/common/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 rounded-3xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 mb-6 shadow-sm">
        <Compass className="w-10 h-10 animate-spin-slow" />
      </div>

      <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-2">
        404 - Page Not Found
      </h1>
      <p className="text-sm text-slate-500 max-w-md mb-8 leading-relaxed">
        The page or academic resource you are attempting to access does not exist, has been moved, or has been archived.
      </p>

      <div className="flex items-center gap-3">
        <Link to="/">
          <Button variant="primary" icon={Home} size="md">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
