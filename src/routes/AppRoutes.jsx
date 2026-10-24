import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';
import Loader from '../components/common/Loader';

// Layouts
const AdminLayout = lazy(() => import('../layouts/AdminLayout'));
const ExhibitorLayout = lazy(() => import('../layouts/ExhibitorLayout'));
const AttendeeLayout = lazy(() => import('../layouts/AttendeeLayout'));
const AuthLayout = lazy(() => import('../layouts/AuthLayout'));

// Auth Pages
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/auth/ResetPassword'));

// Admin Pages
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const ExpoManagement = lazy(() => import('../pages/admin/ExpoManagement'));
const FloorPlanManagement = lazy(() => import('../pages/admin/FloorPlanManagement'));
const ExhibitorManagement = lazy(() => import('../pages/admin/ExhibitorManagement'));
const ScheduleManagement = lazy(() => import('../pages/admin/ScheduleManagement'));
const Analytics = lazy(() => import('../pages/admin/Analytics'));
const FeedbackSupport = lazy(() => import('../pages/admin/FeedbackSupport'));

// Exhibitor Pages
const ExhibitorDashboard = lazy(() => import('../pages/exhibitor/ExhibitorDashboard'));
const ExhibitorProfile = lazy(() => import('../pages/exhibitor/ExhibitorProfile'));
const ExhibitorBooths = lazy(() => import('../pages/exhibitor/ExhibitorBooths'));
const ExhibitorMessages = lazy(() => import('../pages/exhibitor/ExhibitorMessages'));

// Attendee Pages
const AttendeeDashboard = lazy(() => import('../pages/attendee/AttendeeDashboard'));
const BrowseExpos = lazy(() => import('../pages/attendee/BrowseExpos'));
const ExpoDetails = lazy(() => import('../pages/attendee/ExpoDetails'));
const ExhibitorDirectory = lazy(() => import('../pages/attendee/ExhibitorDirectory'));
const MyBookings = lazy(() => import('../pages/attendee/MyBookings'));
const SessionBookmarks = lazy(() => import('../pages/attendee/SessionBookmarks'));

// Common Pages
const LandingPage = lazy(() => import('../pages/common/LandingPage'));
const AllExpos = lazy(() => import('../pages/common/AllExpos'));
const ExpoDetailsView = lazy(() => import('../pages/common/ExpoDetailsView'));
const AboutUs = lazy(() => import('../pages/common/AboutUs'));
const GalleryPage = lazy(() => import('../pages/common/GalleryPage'));
const ContactUs = lazy(() => import('../pages/common/ContactUs'));
const ReportFeedback = lazy(() => import('../pages/common/ReportFeedback'));
const NotFound = lazy(() => import('../pages/common/NotFound'));
const Unauthorized = lazy(() => import('../pages/common/Unauthorized'));

// Root Redirection Component
const RootRedirect = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader text="Loading EventSphere..." size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role === 'admin') return <Navigate to="/admin" replace />;
  if (user?.role === 'exhibitor') return <Navigate to="/exhibitor" replace />;
  return <Navigate to="/attendee" replace />;
};

export const AppRoutes = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <Loader text="Loading section..." size="lg" />
        </div>
      }
    >
      <Routes>
        {/* Public Landing & Showcase Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/expos" element={<AllExpos />} />
        <Route path="/expo-details/:id" element={<ExpoDetailsView />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/feedback" element={<ReportFeedback />} />
        <Route path="/dashboard" element={<RootRedirect />} />

        {/* Auth Group */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* Admin Portal (admin-only) */}
        <Route
          path="/admin"
          element={
            <RoleRoute allowedRoles={['admin']}>
              <AdminLayout />
            </RoleRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="expos" element={<ExpoManagement />} />
          <Route path="floorplan" element={<FloorPlanManagement />} />
          <Route path="exhibitors" element={<ExhibitorManagement />} />
          <Route path="schedules" element={<ScheduleManagement />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="feedback" element={<FeedbackSupport />} />
        </Route>

        {/* Exhibitor Portal (exhibitor-only) */}
        <Route
          path="/exhibitor"
          element={
            <RoleRoute allowedRoles={['exhibitor']}>
              <ExhibitorLayout />
            </RoleRoute>
          }
        >
          <Route index element={<ExhibitorDashboard />} />
          <Route path="profile" element={<ExhibitorProfile />} />
          <Route path="booths" element={<ExhibitorBooths />} />
          <Route path="messages" element={<ExhibitorMessages />} />
        </Route>

        {/* Attendee Portal (attendee-only) */}
        <Route
          path="/attendee"
          element={
            <RoleRoute allowedRoles={['attendee']}>
              <AttendeeLayout />
            </RoleRoute>
          }
        >
          <Route index element={<AttendeeDashboard />} />
          <Route path="expos" element={<BrowseExpos />} />
          <Route path="expos/:id" element={<ExpoDetails />} />
          <Route path="directory" element={<ExhibitorDirectory />} />
          <Route path="bookings" element={<MyBookings />} />
          <Route path="bookmarks" element={<SessionBookmarks />} />
          <Route path="feedback" element={<ReportFeedback />} />
        </Route>

        {/* Error Pages */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
