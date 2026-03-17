import { useState } from 'react';
import { BudgetProvider } from './context/BudgetContext';
import DashboardView from './views/DashboardView';
import AddView from './views/AddView';
import HistoryView from './views/HistoryView';
import StatisticsView from './views/StatisticsView';
import GoalsView from './views/GoalsView';
import { LayoutDashboard, Plus, History, PieChart, Target } from 'lucide-react';

type View = 'dashboard' | 'add' | 'history' | 'stats' | 'goals';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <DashboardView />;
      case 'add': return <AddView />;
      case 'history': return <HistoryView />;
      case 'stats': return <StatisticsView />;
      case 'goals': return <GoalsView />;
      default: return <DashboardView />;
    }
  };

  return (
    <BudgetProvider>
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-24">
        {/* Main Content Area */}
        <main className="max-w-md mx-auto p-4 pt-8">
          {renderView()}
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50 max-w-md mx-auto shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-3xl">
          <NavButton 
            active={currentView === 'dashboard'} 
            onClick={() => setCurrentView('dashboard')} 
            icon={<LayoutDashboard size={24} />} 
            label="Panel" 
          />
          <NavButton 
            active={currentView === 'history'} 
            onClick={() => setCurrentView('history')} 
            icon={<History size={24} />} 
            label="Geçmiş" 
          />
          
          {/* Central Add Button */}
          <button 
            onClick={() => setCurrentView('add')}
            className={`-mt-12 w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-90 ${currentView === 'add' ? 'bg-orange-500 text-white' : 'bg-[#1a8a5c] text-white'}`}
          >
            <Plus size={32} strokeWidth={3} />
          </button>

          <NavButton 
            active={currentView === 'stats'} 
            onClick={() => setCurrentView('stats')} 
            icon={<PieChart size={24} />} 
            label="İstatistik" 
          />
          <NavButton 
            active={currentView === 'goals'} 
            onClick={() => setCurrentView('goals')} 
            icon={<Target size={24} />} 
            label="Hedefler" 
          />
        </nav>
      </div>
    </BudgetProvider>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-[#1a8a5c]' : 'text-gray-400'}`}
    >
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
    </button>
  );
}
