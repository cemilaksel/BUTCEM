import { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Trash2, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function HistoryView() {
  const { transactions, deleteTransaction } = useBudget();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

  const filteredTransactions = transactions
    .filter(t => {
      const matchesSearch = t.note.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           t.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === 'all' || t.type === filter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6 pb-20">
      <h1 className="text-2xl font-bold text-gray-800 px-2">İşlem Geçmişi</h1>

      {/* Search & Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Ara (not veya kategori)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-100 rounded-xl pl-12 pr-4 py-3 shadow-sm focus:ring-2 focus:ring-[#1a8a5c] outline-none"
          />
        </div>
        <div className="flex gap-2">
          <FilterButton active={filter === 'all'} onClick={() => setFilter('all')} label="Tümü" />
          <FilterButton active={filter === 'income'} onClick={() => setFilter('income')} label="Gelir" />
          <FilterButton active={filter === 'expense'} onClick={() => setFilter('expense')} label="Gider" />
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((t) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={t.id} 
                className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 flex justify-between items-center"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${t.type === 'income' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {t.category.split(' ')[0]}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{t.note || t.category}</p>
                    <p className="text-xs text-gray-400">{formatDate(t.date)} • {t.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className={`font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </p>
                  <button 
                    onClick={() => deleteTransaction(t.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-20 text-gray-400 italic">
              Kayıt bulunamadı.
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function FilterButton({ active, onClick, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${active ? 'bg-[#1a8a5c] text-white shadow-md' : 'bg-white text-gray-400 border border-gray-100'}`}
    >
      {label}
    </button>
  );
}
