import { useBudget } from '../context/BudgetContext';
import { formatCurrency } from '../utils/formatters';
import { TrendingUp, TrendingDown, Wallet, CalendarDays, AlertCircle, Trash2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { motion } from 'motion/react';

export default function Dashboard() {
  const { transactions, goals, limits, initialBalance, loadDemoData, clearAllData, deleteLimit } = useBudget();

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = initialBalance + totalIncome - totalExpense;
  const netFlow = totalIncome - totalExpense;

  // Daily budget calculation (remaining days in month)
  const today = new Date();
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const remainingDays = lastDayOfMonth - today.getDate() + 1;
  const dailyBudget = Math.max(0, (balance / remainingDays));

  // Chart Data
  const expenseByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc: any, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const pieData = Object.entries(expenseByCategory).map(([name, value]) => ({ name, value }));
  const COLORS = ['#1a8a5c', '#27ae60', '#e74c3c', '#f39c12', '#9b59b6', '#3498db', '#1abc9c', '#34495e', '#d35400', '#7f8c8d'];

  const barData = [
    { name: 'Gelir', miktar: totalIncome },
    { name: 'Gider', miktar: totalExpense }
  ];

  // Budget Warnings
  const exceededLimits = limits.filter(limit => {
    const spent = transactions
      .filter(t => t.type === 'expense' && t.category === limit.category)
      .reduce((acc, t) => acc + t.amount, 0);
    return spent > limit.limitAmount;
  });

  return (
    <div className="space-y-6 pb-20">
      {/* Header Balance */}
      <div className="bg-[#1a8a5c] text-white p-8 rounded-b-3xl shadow-lg -mx-4 -mt-4 text-center">
        <p className="text-sm opacity-80 uppercase tracking-widest font-semibold">Toplam Bakiye</p>
        <h1 className={`text-4xl font-bold mt-1 ${balance < 0 ? 'text-red-200' : ''}`}>
          {formatCurrency(balance)}
        </h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 px-1">
        <SummaryCard 
          title="Toplam Gelir" 
          amount={totalIncome} 
          icon={<TrendingUp className="text-green-500" />} 
          color="text-green-600"
          bgColor="bg-green-50"
        />
        <SummaryCard 
          title="Toplam Gider" 
          amount={totalExpense} 
          icon={<TrendingDown className="text-red-500" />} 
          color="text-red-600"
          bgColor="bg-red-50"
        />
        <SummaryCard 
          title="Net Akış" 
          amount={netFlow} 
          icon={<Wallet className={netFlow >= 0 ? 'text-blue-500' : 'text-red-500'} />} 
          color={netFlow >= 0 ? 'text-blue-600' : 'text-red-600'}
          bgColor={netFlow >= 0 ? 'bg-blue-50' : 'bg-red-50'}
        />
        <SummaryCard 
          title="Günlük Bütçe" 
          amount={dailyBudget} 
          icon={<CalendarDays className="text-orange-500" />} 
          color="text-orange-600"
          bgColor="bg-orange-50"
        />
      </div>

      {/* Budget Warnings */}
      {exceededLimits.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-bold flex items-center gap-2 text-red-600">
            <AlertCircle size={20} /> Bütçe Uyarıları
          </h2>
          {exceededLimits.map(limit => {
            const spent = transactions
              .filter(t => t.type === 'expense' && t.category === limit.category)
              .reduce((acc, t) => acc + t.amount, 0);
            return (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                key={limit.category} 
                className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl flex justify-between items-center"
              >
                <div>
                  <p className="font-bold text-red-800">{limit.category} Limiti Aşıldı!</p>
                  <p className="text-sm text-red-600">
                    Limit: {formatCurrency(limit.limitAmount)} | Harcanan: {formatCurrency(spent)}
                  </p>
                </div>
                <button onClick={() => deleteLimit(limit.category)} className="text-red-400 hover:text-red-600 p-2">
                  <Trash2 size={18} />
                </button>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Charts Section */}
      <div className="space-y-6">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-semibold mb-4 uppercase tracking-wider">Gider Dağılımı</h3>
          <div className="h-64">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 italic">Veri bulunamadı</div>
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-semibold mb-4 uppercase tracking-wider">Gelir vs Gider</h3>
          <div className="h-64">
            {transactions.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Bar dataKey="miktar" radius={[8, 8, 0, 0]}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#27ae60' : '#e74c3c'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 italic">Veri bulunamadı</div>
            )}
          </div>
        </div>
      </div>

      {/* Demo Buttons */}
      <div className="flex flex-col gap-3 pt-4">
        <button 
          onClick={loadDemoData}
          className="w-full bg-blue-50 text-blue-600 py-3 rounded-xl font-semibold border border-blue-100 flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          📥 Ali & Ayşe Demo Verisini Yükle
        </button>
        <button 
          onClick={clearAllData}
          className="w-full bg-gray-50 text-gray-500 py-3 rounded-xl font-semibold border border-gray-100 flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          🗑️ Tüm Verileri Temizle
        </button>
      </div>
    </div>
  );
}

function SummaryCard({ title, amount, icon, color, bgColor }: any) {
  return (
    <div className={`${bgColor} p-4 rounded-2xl border border-white/50 shadow-sm`}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-tight">{title}</span>
        {icon}
      </div>
      <p className={`text-lg font-bold ${color}`}>{formatCurrency(amount)}</p>
    </div>
  );
}
