export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export const INCOME_CATEGORIES = [
  '💼 Maaş',
  '🏦 Faiz',
  '🏠 Kira Geliri',
  '💰 Diğer'
];

export const EXPENSE_CATEGORIES = [
  '🛒 Market',
  '🏠 Kira',
  '💡 Fatura',
  '🚌 Ulaşım',
  '💳 Kredi Kartı',
  '🏥 Sağlık',
  '🎓 Eğitim',
  '🎬 Eğlence',
  '👔 Giyim',
  '📦 Diğer'
];
