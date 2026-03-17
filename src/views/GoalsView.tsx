import { useBudget } from '../context/BudgetContext';
import { formatCurrency } from '../utils/formatters';
import { Target, Trash2, Edit2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function GoalsView() {
  const { goals, deleteGoal, updateGoal } = useBudget();

  return (
    <div className="space-y-6 pb-20">
      <h1 className="text-2xl font-bold text-gray-800 px-2">Tasarruf Hedefleri</h1>

      <div className="space-y-4">
        {goals.length > 0 ? (
          goals.map((goal) => {
            const progress = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
            return (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={goal.id} 
                className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
                      <Target size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">{goal.name}</h3>
                      <p className="text-sm text-gray-400">Hedef: {formatCurrency(goal.targetAmount)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        const newAmount = prompt('Yeni mevcut birikim tutarını girin:', goal.currentAmount.toString());
                        if (newAmount !== null && !isNaN(Number(newAmount))) {
                          updateGoal(goal.id, Number(newAmount));
                        }
                      }}
                      className="text-gray-400 hover:text-blue-500 p-2"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => deleteGoal(goal.id)}
                      className="text-gray-400 hover:text-red-500 p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-blue-600">{formatCurrency(goal.currentAmount)}</span>
                    <span className="text-gray-400">%{progress.toFixed(0)}</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-blue-500 rounded-full"
                    />
                  </div>
                </div>

                {goal.currentAmount >= goal.targetAmount && (
                  <div className="bg-green-50 text-green-600 text-xs font-bold py-2 px-4 rounded-xl text-center">
                    Tebrikler! Hedefe ulaşıldı. 🎉
                  </div>
                )}
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-20 text-gray-400 italic">
            Henüz bir hedef eklemediniz. "Ekle" sekmesinden yeni bir hedef oluşturabilirsiniz.
          </div>
        )}
      </div>
    </div>
  );
}
