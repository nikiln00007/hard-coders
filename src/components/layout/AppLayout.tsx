// ============================================================
// App Layout — Sidebar + Main Content Shell
// ============================================================
import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Receipt, Clock, TrendingUp, ShoppingBag,
  Search, Shield, Target, Brain, Calculator, FileText,
  SettingsIcon, Menu, X, Sun, Moon, ChevronLeft,
} from 'lucide-react';
import { useAppState } from '../../app/providers';

const NAV_ITEMS = [
  { path: '/', label: 'Overview', icon: LayoutDashboard },
  { path: '/expenses', label: 'Expenses', icon: Receipt },
  { path: '/life-hours', label: 'Life-Hours', icon: Clock },
  { path: '/simulator', label: 'Future Simulator', icon: TrendingUp },
  { path: '/should-i-buy', label: 'Should I Buy?', icon: ShoppingBag },
  { path: '/leak-detector', label: 'Leak Detector', icon: Search },
  { path: '/scam-shield', label: 'Scam Shield', icon: Shield },
  { path: '/life-goals', label: 'Life Goals', icon: Target },
  { path: '/personality', label: 'Money Personality', icon: Brain },
  { path: '/tax-savings', label: 'Tax & Savings', icon: Calculator },
  { path: '/report', label: 'Money Report', icon: FileText },
  { path: '/settings', label: 'Settings', icon: SettingsIcon },
];

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { state, dispatch } = useAppState();
  const location = useLocation();
  const isDark = state.preferences.theme === 'dark';

  const currentNav = NAV_ITEMS.find(
    n => n.path === location.pathname || (n.path === '/' && location.pathname === '/')
  );

  const toggleTheme = () => {
    dispatch({
      type: 'UPDATE_PREFERENCES',
      payload: { theme: isDark ? 'light' : 'dark' },
    });
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 mb-2">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet to-violet-bright flex items-center justify-center flex-shrink-0">
          <span className="text-white font-extrabold text-lg">W</span>
        </div>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="overflow-hidden"
          >
            <h1 className="font-bold text-lg tracking-tight">WorthIt</h1>
            <p className="text-[10px] text-muted leading-none">Make Money Make Sense</p>
          </motion.div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-violet/15 text-violet-bright'
                  : 'text-muted hover:text-soft-white hover:bg-surface-2'
              }`
            }
            end={item.path === '/'}
          >
            <item.icon size={18} className="flex-shrink-0" />
            {sidebarOpen && (
              <span className="truncate">{item.label}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Theme Toggle */}
      <div className="px-4 py-4 border-t border-border">
        <button
          onClick={toggleTheme}
          className="btn btn-ghost w-full justify-start gap-3 text-sm"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
          {sidebarOpen && <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col border-r border-border transition-all duration-300 flex-shrink-0 ${
          sidebarOpen ? 'w-64' : 'w-[72px]'
        }`}
        style={{ backgroundColor: isDark ? 'var(--color-surface)' : 'var(--color-light-surface)' }}
      >
        <SidebarContent />
        {/* Collapse toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute top-5 right-0 translate-x-1/2 z-20 w-6 h-6 rounded-full border border-border bg-surface flex items-center justify-center hover:border-violet transition-colors"
          style={{
            left: sidebarOpen ? '248px' : '60px',
            backgroundColor: isDark ? 'var(--color-surface)' : 'var(--color-light-surface)',
          }}
        >
          <ChevronLeft size={12} className={`transition-transform ${!sidebarOpen ? 'rotate-180' : ''}`} />
        </button>
      </aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-72 z-50 flex flex-col border-r border-border lg:hidden"
              style={{ backgroundColor: isDark ? 'var(--color-surface)' : 'var(--color-light-surface)' }}
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 btn btn-ghost btn-icon"
              >
                <X size={18} />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <header
          className="sticky top-0 z-30 border-b border-border backdrop-blur-xl px-4 sm:px-6 py-3 flex items-center justify-between"
          style={{ backgroundColor: isDark ? 'rgba(11, 7, 24, 0.85)' : 'rgba(250, 250, 254, 0.85)' }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="btn btn-ghost btn-icon lg:hidden"
            >
              <Menu size={20} />
            </button>
            <div>
              <h2 className="font-semibold text-base">{currentNav?.label || 'WorthIt'}</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {state.preferences.profileType === 'demo' && (
              <span className="demo-banner hidden sm:flex">
                📊 Demo Data — Priya's Finances
              </span>
            )}
            <button onClick={toggleTheme} className="btn btn-ghost btn-icon lg:hidden">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 sm:p-6 max-w-[1400px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
