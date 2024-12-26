export const formatCurrency = (amount: number): string => {
  return `€${amount.toFixed(2)}`;
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};