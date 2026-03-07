import { Routes, Route } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout.jsx';
import LandingPage from './pages/landing/LandingPage.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>
    </Routes>
  );
}
