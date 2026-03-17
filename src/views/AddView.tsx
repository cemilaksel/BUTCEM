import { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../utils/formatters';
import { PlusCircle, Target, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

export default function AddView() {
  const { addTransaction, addGoal, setLimit, setInitialBalance, initialBalance } = useBudget();
  const [activeTab, setActiveTab] = useState<'transaction' | 'goal' | 'limit' | 'balance'>('transaction');

  // Transaction State
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Goal State
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalCurrent, setGoalCurrent] = useState('');

  // Limit State
  const [limitCat, setLimitCat] = useState(EXPENSE_CATEGORIES[0]);
  const [limitAmount, setLimitAmount] = useState('');

  // Balance State
  const [newBalance, setNewBalance] = useState(initialBalance.toString());

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;
    addTransaction({
      amount: Number(amount),
      type,
      category,
      note,
      date: new Date(date).toISOString()
    });
    setAmount('');
    setNote('');
    alert('Kayıt eklendi!');
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalName || !goalTarget) return;
    addGoal({
      name: goalName,
      targetAmount: Number(goalTarget),
      currentAmount: Number(goalCurrent) || 0
    });
    setGoalName('');
    setGoalTarget('');
    setGoalCurrent('');
    alert('Hedef eklendi!');
  };

  const handleSetLimit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!limitAmount) return;
    setLimit({
      category: limitCat,
      limitAmount: Number(limitAmount)
    });
    setLimitAmount('');
    alert('Bütçe limiti güncellendi!');
  };

  const handleSetBalance = (e: React.FormEvent) => {
    e.preventDefault();
    setInitialBalance(Number(newBalance));
    alert('Başlangıç bakiyesi güncellendi!');
  };

  return (
    <div className="space-y-6 pb-20">
      <h1 className="text-2xl font-bold text-gray-800 px-2">Yeni Ekle</h1>

      {/* Sub-tabs */}
      <div className="flex bg-gray-100 p-1 rounded-xl overflow-x-auto scrollbar-hide">
        <TabButton active={activeTab === 'transaction'} onClick={() => setActiveTab('transaction')} label="Kayıt" />
        <TabButton active={activeTab === 'goal'} onClick={() => setActiveTab('goal')} label="Hedef" />
        <TabButton active={activeTab === 'limit'} onClick={() => setActiveTab('limit')} label="Limit" />
        <TabButton active={activeTab === 'balance'} onClick={() => setActiveTab('balance')} label="Bakiye" />
      </div>

      <motion.div 
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
      >
        {activeTab === 'transaction' && (
          <form onSubmit={handleAddTransaction} className="space-y-4">
            <div className="flex gap-2 p-1 bg-gray-50 rounded-lg">
              <button 
                type="button"
                onClick={() => { setType('expense'); setCategory(EXPENSE_CATEGORIES[0]); }}
                className={`flex-1 py-2 rounded-md font-bold transition-all ${type === 'expense' ? 'bg-red-500 text-white shadow-md' : 'text-gray-400'}`}
              >
                Gider
              </button>
              <button 
                type="button"
                onClick={() => { setType('income'); setCategory(INCOME_CATEGORIES[0]); }}
                className={`flex-1 py-2 rounded-md font-bold transition-all ${type === 'income' ? 'bg-green-500 text-white shadow-md' : 'text-gray-400'}`}
              >
                Gelir
              </button>
            </div>

            <Input label="Tutar (TL)" type="number" value={amount} onChange={setAmount} placeholder="0" required />
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase">Kategori</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-gray-50 border-none rounded-xl p-4 text-gray-700 focus:ring-2 focus:ring-[#1a8a5c]"
              >
                {(type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <Input label="Not" type="text" value={note} onChange={setNote} placeholder="Açıklama girin..." />
            <Input label="Tarih" type="date" value={date} onChange={setDate} />

            <button type="submit" className="w-full bg-[#1a8a5c] text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 mt-4">
              <PlusCircle size={20} /> Kaydet
            </button>
          </form>
        )}

        {activeTab === 'goal' && (
          <form onSubmit={handleAddGoal} className="space-y-4">
            <Input label="Hedef Adı" type="text" value={goalName} onChange={setGoalName} placeholder="Örn: Tatil Birikimi" required />
            <Input label="Hedef Tutar (TL)" type="number" value={goalTarget} onChange={setGoalTarget} placeholder="0" required />
            <Input label="Mevcut Birikim (TL)" type="number" value={goalCurrent} onChange={setGoalCurrent} placeholder="0" />
            
            <button type="submit" className="w-full bg-[#1a8a5c] text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 mt-4">
              <Target size={20} /> Hedef Ekle
            </button>
          </form>
        )}

        {activeTab === 'limit' && (
          <form onSubmit={handleSetLimit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase">Gider Kategorisi</label>
              <select 
                value={limitCat}
                onChange={(e) => setLimitCat(e.target.value)}
                className="w-full bg-gray-50 border-none rounded-xl p-4 text-gray-700 focus:ring-2 focus:ring-[#1a8a5c]"
              >
                {EXPENSE_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <Input label="Aylık Limit Tutarı (TL)" type="number" value={limitAmount} onChange={setLimitAmount} placeholder="0" required />
            
            <button type="submit" className="w-full bg-[#1a8a5c] text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 mt-4">
              <ShieldAlert size={20} /> Limiti Belirle
            </button>
          </form>
        )}

        {activeTab === 'balance' && (
          <form onSubmit={handleSetBalance} className="space-y-4">
            <Input label="Başlangıç Bakiyesi (TL)" type="number" value={newBalance} onChange={setNewBalance} placeholder="0" required />
            <p className="text-xs text-gray-400 italic">Bu tutar, tüm gelir ve giderlerin üzerine eklenir.</p>
            
            <button type="submit" className="w-full bg-[#1a8a5c] text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 mt-4">
              Güncelle
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}

function TabButton({ active, onClick, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${active ? 'bg-white text-[#1a8a5c] shadow-sm' : 'text-gray-400'}`}
    >
      {label}
    </button>
  );
}

function Input({ label, ...props }: any) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-bold text-gray-400 uppercase">{label}</label>
      <input 
        {...props}
        onChange={(e) => props.onChange(e.target.value)}
        className="w-full bg-gray-50 border-none rounded-xl p-4 text-gray-700 focus:ring-2 focus:ring-[#1a8a5c]"
      />
    </div>
  );
}
