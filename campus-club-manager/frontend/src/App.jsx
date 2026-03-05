import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landing/LandingPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
    </Routes>
  );
}
