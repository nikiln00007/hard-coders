// ============================================================
// App Router
// ============================================================
import { createBrowserRouter } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import Dashboard from '../pages/Dashboard';
import Expenses from '../pages/Expenses';
import LifeHours from '../pages/LifeHours';
import Simulator from '../pages/Simulator';
import DecisionSandbox from '../pages/DecisionSandbox';
import LeakDetector from '../pages/LeakDetector';
import ScamShield from '../pages/ScamShield';
import LifeGoals from '../pages/LifeGoals';
import MoneyPersonality from '../pages/MoneyPersonality';
import TaxSavings from '../pages/TaxSavings';
import MoneyReport from '../pages/MoneyReport';
import Settings from '../pages/Settings';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'expenses', element: <Expenses /> },
      { path: 'life-hours', element: <LifeHours /> },
      { path: 'simulator', element: <Simulator /> },
      { path: 'should-i-buy', element: <DecisionSandbox /> },
      { path: 'leak-detector', element: <LeakDetector /> },
      { path: 'scam-shield', element: <ScamShield /> },
      { path: 'life-goals', element: <LifeGoals /> },
      { path: 'personality', element: <MoneyPersonality /> },
      { path: 'tax-savings', element: <TaxSavings /> },
      { path: 'report', element: <MoneyReport /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
]);
