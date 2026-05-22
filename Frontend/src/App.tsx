import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AgentApp from './AgentApp';
import { ROUTES } from './lib/routes';
import LandingPage from './pages/LandingPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.home} element={<LandingPage />} />
        <Route path={ROUTES.agent} element={<AgentApp />} />
        <Route path="/app" element={<Navigate to={ROUTES.agent} replace />} />
        <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
