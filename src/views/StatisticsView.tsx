import { useBudget } from '../context/BudgetContext';
import { formatCurrency } from '../utils/formatters';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

export default function StatisticsView() {
  const { transactions } = useBudget();

  // Category Distribution
  const expenseByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc: any, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const pieData = Object.entries(expenseByCategory).map(([name, value]) => ({ name, value }));
  const COLORS = ['#1a8a5c', '#27ae60', '#e74c3c', '#f39c12', '#9b59b6', '#3498db', '#1abc9c', '#34495e', '#d35400', '#7f8c8d'];

  // Monthly Trend (Mocking some months for visual if empty)
  const monthlyData = [
    { name: 'Ocak', gelir: 0, gider: 0 },
    { name: 'Şubat', gelir: 0, gider: 0 },
    { name: 'Mart', gelir: 0, gider: 0 },
  ];

  transactions.forEach(t => {
    const month = new Date(t.date).getMonth();
    if (month === 0) t.type === 'income' ? monthlyData[0].gelir += t.amount : monthlyData[0].gider += t.amount;
    if (month === 1) t.type === 'income' ? monthlyData[1].gelir += t.amount : monthlyData[1].gider += t.amount;
    if (month === 2) t.type === 'income' ? monthlyData[2].gelir += t.amount : monthlyData[2].gider += t.amount;
  });

  return (
    <div className="space-y-6 pb-20">
      <h1 className="text-2xl font-bold text-gray-800 px-2">İstatistikler</h1>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
        <div>
          <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-4">Harcama Dağılımı</h3>
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
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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

        <div className="pt-6 border-t border-gray-50">
          <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-4">Aylık Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="gelir" fill="#27ae60" radius={[4, 4, 0, 0]} name="Gelir" />
                <Bar dataKey="gider" fill="#e74c3c" radius={[4, 4, 0, 0]} name="Gider" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Categories List */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-4">En Çok Harcananlar</h3>
        <div className="space-y-4">
          {pieData.sort((a, b) => b.value - a.value).slice(0, 5).map((item, idx) => (
            <div key={item.name} className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span className="text-gray-700 font-medium">{item.name}</span>
              </div>
              <span className="font-bold text-gray-900">{formatCurrency(item.value)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
