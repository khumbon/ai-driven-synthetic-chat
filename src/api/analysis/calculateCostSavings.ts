// Calculate cost savings based on time saved (assuming $300/hour lawyer rate)
export const calculateCostSavings = (timeSavedHours: number): string => {
  const hourlyRate = 300;
  const costSavings = timeSavedHours * hourlyRate;
  return `$${costSavings.toLocaleString()}`;
};
