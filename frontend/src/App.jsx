import { Navigate, Route, Routes } from 'react-router-dom';
import { useLanguage } from './context/LanguageContext.jsx';
import { useAuth } from './context/AuthContext.jsx';
import { Layout } from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Scanner from './pages/Scanner.jsx';
import Search from './pages/Search.jsx';
import SiteDetail from './pages/SiteDetail.jsx';
import LanguagePicker from './pages/LanguagePicker.jsx';
import Favorites from './pages/Favorites.jsx';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx';
import TripPlanner from './pages/TripPlanner.jsx';
import FlightSearch from './pages/FlightSearch.jsx';
import TrainSearch from './pages/TrainSearch.jsx';
import BusSearch from './pages/BusSearch.jsx';
import Hotels from './pages/Hotels.jsx';
import LocalTransport from './pages/LocalTransport.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AdminPanel from './pages/AdminPanel.jsx';
import Security from './pages/Security.jsx';
import Privacy from './pages/Privacy.jsx';
import Terms from './pages/Terms.jsx';

/* Protected route wrapper — redirects to /login if not authenticated */
function RequireAuth({ children }) {
  const { isLoggedIn, ready } = useAuth();
  if (!ready) return null; // wait for localStorage hydration
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const { ready } = useLanguage();
  if (!ready) return null;

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/languages" element={<LanguagePicker />} />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <RequireAuth>
            <Layout>
              <Home />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/scanner"
        element={
          <RequireAuth>
            <Layout compact>
              <Scanner />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/search"
        element={
          <RequireAuth>
            <Layout>
              <Search />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/site/:siteId"
        element={
          <RequireAuth>
            <Layout>
              <SiteDetail />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/favorites"
        element={
          <RequireAuth>
            <Layout>
              <Favorites />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/about"
        element={
          <RequireAuth>
            <Layout>
              <About />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/trip-planner"
        element={
          <RequireAuth>
            <Layout>
              <TripPlanner />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/flights"
        element={
          <RequireAuth>
            <Layout>
              <FlightSearch />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/trains"
        element={
          <RequireAuth>
            <Layout>
              <TrainSearch />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/buses"
        element={
          <RequireAuth>
            <Layout>
              <BusSearch />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/hotels"
        element={
          <RequireAuth>
            <Layout>
              <Hotels />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/local-transport"
        element={
          <RequireAuth>
            <Layout>
              <LocalTransport />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <Layout>
              <Dashboard />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/admin"
        element={
          <RequireAuth>
            <Layout>
              <AdminPanel />
            </Layout>
          </RequireAuth>
        }
      />
      <Route path="/security" element={<Layout><Security /></Layout>} />
      <Route path="/privacy" element={<Layout><Privacy /></Layout>} />
      <Route path="/terms" element={<Layout><Terms /></Layout>} />
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
