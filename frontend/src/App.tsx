import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PathDetails from './pages/PathDetails';
import ProtectedRoute from './components/ProtectedRoute';
import { Layout } from 'lucide-react';
import Notification from './components/ui/Notification';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <Notification />
        {/* Navigation Header */}
        <nav className="border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3 font-black text-2xl tracking-tighter">
              <div className="p-2 bg-[var(--primary)] rounded-xl">
                <Layout className="text-[var(--primary-foreground)] w-6 h-6" />
              </div>
              <span>Skill<span className="text-[var(--primary)]">Tracker</span></span>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 py-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/path/:id"
              element={
                <ProtectedRoute>
                  <PathDetails />
                </ProtectedRoute>
              }
            />
            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Simple Footer */}
        <footer className="border-t border-slate-800 mt-20 py-12 text-center text-secondary text-sm">
          &copy; {new Date().getFullYear()} Skill Progress Tracker. All rights reserved.
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
