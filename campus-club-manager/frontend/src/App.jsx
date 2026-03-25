import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import RoleGuard from './components/RoleGuard.jsx';

import LandingPage from './pages/landing/LandingPage.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import RegisterPage from './pages/auth/RegisterPage.jsx';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage.jsx';

import StudentDashboard from './pages/student/StudentDashboard.jsx';
import BrowseClubs from './pages/student/BrowseClubs.jsx';
import ClubDetail from './pages/student/ClubDetail.jsx';
import MyMemberships from './pages/student/MyMemberships.jsx';
import EventsList from './pages/student/EventsList.jsx';
import EventDetail from './pages/student/EventDetail.jsx';

import ClubAdminDashboard from './pages/clubAdmin/ClubAdminDashboard.jsx';
import MemberRequests from './pages/clubAdmin/MemberRequests.jsx';
import MemberRoster from './pages/clubAdmin/MemberRoster.jsx';
import ManageRoles from './pages/clubAdmin/ManageRoles.jsx';
import CreateEvent from './pages/clubAdmin/CreateEvent.jsx';
import ManageEvents from './pages/clubAdmin/ManageEvents.jsx';
import ClubSettings from './pages/clubAdmin/ClubSettings.jsx';

import SuperAdminDashboard from './pages/superAdmin/SuperAdminDashboard.jsx';
import ClubApprovals from './pages/superAdmin/ClubApprovals.jsx';
import ManageClubAdmins from './pages/superAdmin/ManageClubAdmins.jsx';
import AllClubs from './pages/superAdmin/AllClubs.jsx';
import SystemStats from './pages/superAdmin/SystemStats.jsx';

import ProfilePage from './pages/common/ProfilePage.jsx';
import NotFoundPage from './pages/common/NotFoundPage.jsx';
import UnauthorizedPage from './pages/common/UnauthorizedPage.jsx';

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* Student */}
      <Route element={<ProtectedRoute><RoleGuard allowedRoles={['student']}><DashboardLayout /></RoleGuard></ProtectedRoute>}>
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/clubs" element={<BrowseClubs />} />
        <Route path="/student/clubs/:id" element={<ClubDetail />} />
        <Route path="/student/memberships" element={<MyMemberships />} />
        <Route path="/student/events" element={<EventsList />} />
        <Route path="/student/events/:id" element={<EventDetail />} />
      </Route>

      {/* Club Admin */}
      <Route element={<ProtectedRoute><RoleGuard allowedRoles={['club_admin']}><DashboardLayout /></RoleGuard></ProtectedRoute>}>
        <Route path="/club-admin/dashboard" element={<ClubAdminDashboard />} />
        <Route path="/club-admin/requests" element={<MemberRequests />} />
        <Route path="/club-admin/roster" element={<MemberRoster />} />
        <Route path="/club-admin/roles" element={<ManageRoles />} />
        <Route path="/club-admin/events/create" element={<CreateEvent />} />
        <Route path="/club-admin/events" element={<ManageEvents />} />
        <Route path="/club-admin/settings" element={<ClubSettings />} />
      </Route>

      {/* Super Admin */}
      <Route element={<ProtectedRoute><RoleGuard allowedRoles={['super_admin']}><DashboardLayout /></RoleGuard></ProtectedRoute>}>
        <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} />
        <Route path="/super-admin/approvals" element={<ClubApprovals />} />
        <Route path="/super-admin/admins" element={<ManageClubAdmins />} />
        <Route path="/super-admin/clubs" element={<AllClubs />} />
        <Route path="/super-admin/stats" element={<SystemStats />} />
      </Route>

      {/* Common */}
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
