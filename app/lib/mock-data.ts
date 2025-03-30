export interface ChartData {
  timestamp: string;
  value: number;
  volume: number;
}

function generateMockData(days: number, trend: 'up' | 'down' | 'volatile' = 'up'): ChartData[] {
  const data: ChartData[] = [];
  const baseValue = 10000;
  const baseVolume = 1000000;
  
  let currentValue = baseValue;
  let currentVolume = baseVolume;

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Format date as MM/DD/YYYY
    const formattedDate = date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });

    // Generate value based on trend
    const trendFactor = trend === 'up' ? 1.002 : trend === 'down' ? 0.998 : 1;
    const randomFactor = 1 + (Math.random() * 0.04 - 0.02); // ±2% random variation
    currentValue = currentValue * trendFactor * randomFactor;

    // Generate volume with some randomness
    currentVolume = baseVolume * (1 + (Math.random() * 0.6 - 0.3)); // ±30% random variation

    data.push({
      timestamp: formattedDate,
      value: currentValue,
      volume: currentVolume
    });
  }

  return data;
}

export const mockTimePeriodsData = {
  '1D': generateMockData(1, 'volatile'),
  '1W': generateMockData(7, 'up'),
  '1M': generateMockData(30, 'up'),
  '3M': generateMockData(90, 'volatile'),
  '1Y': generateMockData(365, 'up'),
} as const;

export type TimePeriod = keyof typeof mockTimePeriodsData; 