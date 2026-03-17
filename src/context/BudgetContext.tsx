import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// --- TYPES ---

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  type: TransactionType;
  note: string;
  date: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
}

export interface BudgetLimit {
  category: string;
  limitAmount: number;
}

interface BudgetState {
  transactions: Transaction[];
  goals: Goal[];
  limits: BudgetLimit[];
  initialBalance: number;
}

interface BudgetContextType extends BudgetState {
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  addGoal: (g: Omit<Goal, 'id'>) => void;
  updateGoal: (id: string, amount: number) => void;
  deleteGoal: (id: string) => void;
  setLimit: (limit: BudgetLimit) => void;
  deleteLimit: (category: string) => void;
  setInitialBalance: (amount: number) => void;
  loadDemoData: () => void;
  clearAllData: () => void;
}

// --- CONTEXT ---

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

const STORAGE_KEY = 'butcem_data';

export const BudgetProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<BudgetState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {
      transactions: [],
      goals: [],
      limits: [],
      initialBalance: 0
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    setState(prev => ({
      ...prev,
      transactions: [{ ...t, id: crypto.randomUUID() }, ...prev.transactions]
    }));
  };

  const deleteTransaction = (id: string) => {
    setState(prev => ({
      ...prev,
      transactions: prev.transactions.filter(t => t.id !== id)
    }));
  };

  const addGoal = (g: Omit<Goal, 'id'>) => {
    setState(prev => ({
      ...prev,
      goals: [...prev.goals, { ...g, id: crypto.randomUUID() }]
    }));
  };

  const updateGoal = (id: string, amount: number) => {
    setState(prev => ({
      ...prev,
      goals: prev.goals.map(g => g.id === id ? { ...g, currentAmount: amount } : g)
    }));
  };

  const deleteGoal = (id: string) => {
    setState(prev => ({
      ...prev,
      goals: prev.goals.filter(g => g.id !== id)
    }));
  };

  const setLimit = (limit: BudgetLimit) => {
    setState(prev => {
      const existing = prev.limits.find(l => l.category === limit.category);
      if (existing) {
        return {
          ...prev,
          limits: prev.limits.map(l => l.category === limit.category ? limit : l)
        };
      }
      return { ...prev, limits: [...prev.limits, limit] };
    });
  };

  const deleteLimit = (category: string) => {
    setState(prev => ({
      ...prev,
      limits: prev.limits.filter(l => l.category !== category)
    }));
  };

  const setInitialBalance = (amount: number) => {
    setState(prev => ({ ...prev, initialBalance: amount }));
  };

  const clearAllData = () => {
    setState({
      transactions: [],
      goals: [],
      limits: [],
      initialBalance: 0
    });
  };

  const loadDemoData = () => {
    const demoTransactions: Transaction[] = [
      { id: '1', amount: 45000, category: '💼 Maaş', type: 'income', note: 'Ali Maaş', date: new Date().toISOString() },
      { id: '2', amount: 35000, category: '💼 Maaş', type: 'income', note: 'Ayşe Maaş', date: new Date().toISOString() },
      { id: '3', amount: 25000, category: '🏦 Faiz', type: 'income', note: 'Banka Faiz', date: new Date().toISOString() },
      { id: '4', amount: 12000, category: '🏠 Kira', type: 'expense', note: 'Ev Kirası', date: new Date().toISOString() },
      { id: '5', amount: 30000, category: '🛒 Market', type: 'expense', note: 'Aylık Mutfak', date: new Date().toISOString() },
      { id: '6', amount: 20000, category: '💳 Kredi Kartı', type: 'expense', note: 'Kart Ödemesi', date: new Date().toISOString() },
      { id: '7', amount: 5000, category: '💡 Fatura', type: 'expense', note: 'Elektrik/Su/Gaz', date: new Date().toISOString() },
      { id: '8', amount: 3000, category: '🚌 Ulaşım', type: 'expense', note: 'Akbil/Yakıt', date: new Date().toISOString() },
      { id: '9', amount: 8000, category: '🎓 Eğitim', type: 'expense', note: 'Okul Taksidi', date: new Date().toISOString() },
      { id: '10', amount: 4000, category: '👔 Giyim', type: 'expense', note: 'Kışlık Alışveriş', date: new Date().toISOString() },
      { id: '11', amount: 3000, category: '🎬 Eğlence', type: 'expense', note: 'Sinema/Yemek', date: new Date().toISOString() },
      { id: '12', amount: 2000, category: '🏥 Sağlık', type: 'expense', note: 'Eczane', date: new Date().toISOString() },
      { id: '13', amount: 3000, category: '📦 Diğer', type: 'expense', note: 'Beklenmedik', date: new Date().toISOString() },
    ];

    setState({
      transactions: demoTransactions,
      goals: [
        { id: 'g1', name: 'Acil Durum Fonu', targetAmount: 330000, currentAmount: 250000 },
        { id: 'g2', name: 'Seyahat', targetAmount: 200000, currentAmount: 0 }
      ],
      limits: [
        { category: '🛒 Market', limitAmount: 25000 }
      ],
      initialBalance: 0
    });
  };

  return (
    <BudgetContext.Provider value={{
      ...state,
      addTransaction,
      deleteTransaction,
      addGoal,
      updateGoal,
      deleteGoal,
      setLimit,
      deleteLimit,
      setInitialBalance,
      loadDemoData,
      clearAllData
    }}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) throw new Error('useBudget must be used within a BudgetProvider');
  return context;
};
