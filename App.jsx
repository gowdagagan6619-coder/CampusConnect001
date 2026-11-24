import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Routing Guards
import ProtectedRoute from './components/routing/ProtectedRoute';
import PublicRoute from './components/routing/PublicRoute';

// Layout Frame
import DashboardLayout from './components/layout/DashboardLayout';

// Public Pages
import Home from './pages/public/Home';
import NotFound from './pages/public/NotFound';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Student Portal Pages
import StudentDashboard from './pages/student/StudentDashboard';
import ExploreEvents from './pages/student/ExploreEvents';
import MyRegistrations from './pages/student/MyRegistrations';
import Announcements from './pages/student/Announcements';
import StudyMaterials from './pages/student/StudyMaterials';
import StudentProfile from './pages/student/StudentProfile';

// Admin Portal Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageEvents from './pages/admin/ManageEvents';
import EventAttendees from './pages/admin/EventAttendees';
import ManageAnnouncements from './pages/admin/ManageAnnouncements';
import ManageMaterials from './pages/admin/ManageMaterials';
import ManageStudents from './pages/admin/ManageStudents';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<Home />} />

          {/* Guest Only Routes (Redirect to dashboard if logged in) */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Protected Student Routes */}
          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<StudentDashboard />} />
              <Route path="/events" element={<ExploreEvents />} />
              <Route path="/my-registrations" element={<MyRegistrations />} />
              <Route path="/announcements" element={<Announcements />} />
              <Route path="/materials" element={<StudyMaterials />} />
              <Route path="/profile" element={<StudentProfile />} />
            </Route>
          </Route>

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/events" element={<ManageEvents />} />
              <Route path="/admin/events/:id/attendees" element={<EventAttendees />} />
              <Route path="/admin/announcements" element={<ManageAnnouncements />} />
              <Route path="/admin/materials" element={<ManageMaterials />} />
              <Route path="/admin/students" element={<ManageStudents />} />
            </Route>
          </Route>

          {/* Fallback 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
