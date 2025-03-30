'use client';

import { useMemo, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Bar,
  ComposedChart,
  Line
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BarChart3, LineChart as LineChartIcon } from 'lucide-react';

type ChartData = {
  timestamp: string;
  value: number;
  volume?: number;
};

interface PortfolioChartProps {
  data: ChartData[];
  period?: '1D' | '1W' | '1M' | '1Y';
}

export function PortfolioChart({ data, period = '1D' }: PortfolioChartProps) {
  const [showVolume, setShowVolume] = useState(true);
  const [showMA, setShowMA] = useState(true);
  const [chartType, setChartType] = useState<'area' | 'line'>('area');

  // Calculate moving average
  const enhancedData = useMemo(() => {
    const period = 5; // Shorter period for smoother line
    return data.map((point, index) => {
      let ma = null;
      if (index >= period - 1) {
        const slice = data.slice(index - period + 1, index + 1);
        ma = slice.reduce((sum, p) => sum + p.value, 0) / period;
      }
      return { ...point, ma };
    });
  }, [data]);

  const formatXAxis = (tickItem: string) => {
    const date = new Date(tickItem);
    
    switch (period) {
      case '1D':
        return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      case '1W':
        return date.toLocaleDateString(undefined, { weekday: 'short' });
      case '1M':
        return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
      case '1Y':
        return date.toLocaleDateString(undefined, { month: 'short' });
      default:
        return tickItem;
    }
  };

  const formatTooltipLabel = (label: string) => {
    const date = new Date(label);
    
    switch (period) {
      case '1D':
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      case '1W':
        return date.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
      case '1M':
        return date.toLocaleDateString([], { month: 'long', day: 'numeric' });
      case '1Y':
        return date.toLocaleDateString([], { month: 'long', year: 'numeric' });
      default:
        return label;
    }
  };

  const formatYAxis = (value: number) => {
    return `$${value.toLocaleString()}`;
  };

  const formatVolume = (volume: number) => {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(volume);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <Button
            variant={showVolume ? "default" : "outline"}
            size="sm"
            onClick={() => setShowVolume(!showVolume)}
            className="text-xs rounded-lg"
          >
            Volume
          </Button>
          <Button
            variant={showMA ? "default" : "outline"}
            size="sm"
            onClick={() => setShowMA(!showMA)}
            className="text-xs rounded-lg"
          >
            Moving Avg
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant={chartType === 'area' ? "default" : "outline"}
            size="sm"
            onClick={() => setChartType('area')}
            className="text-xs rounded-lg"
          >
            <BarChart3 className="w-4 h-4 mr-1" />
            Area
          </Button>
          <Button
            variant={chartType === 'line' ? "default" : "outline"}
            size="sm"
            onClick={() => setChartType('line')}
            className="text-xs rounded-lg"
          >
            <LineChartIcon className="w-4 h-4 mr-1" />
            Line
          </Button>
        </div>
      </div>
      <div className="flex-1 rounded-xl overflow-hidden bg-zinc-900/30 p-6">
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={enhancedData} margin={{ top: 10, right: 30, left: 60, bottom: 30 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false}
              stroke="#27272a"
              opacity={0.4}
            />
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatXAxis}
              stroke="#52525b"
              tick={{ fill: '#a1a1aa', fontSize: 12 }}
              tickLine={{ stroke: '#52525b' }}
              axisLine={{ stroke: '#52525b' }}
              dy={16}
              minTickGap={30}
              interval="preserveStartEnd"
            />
            <YAxis
              yAxisId="price"
              tickFormatter={formatYAxis}
              stroke="#52525b"
              tick={{ fill: '#a1a1aa', fontSize: 12 }}
              tickLine={{ stroke: '#52525b' }}
              axisLine={{ stroke: '#52525b' }}
              dx={-10}
            />
            {showVolume && (
              <YAxis
                yAxisId="volume"
                orientation="left"
                tickFormatter={formatVolume}
                stroke="#71717a"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                dx={10}
              />
            )}
            <Tooltip
              contentStyle={{
                backgroundColor: '#18181b',
                border: '1px solid #27272a',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              labelStyle={{ color: '#a1a1aa', marginBottom: '4px' }}
              itemStyle={{ color: '#e4e4e7' }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
              labelFormatter={formatTooltipLabel}
            />
            {showVolume && (
              <Bar
                yAxisId="volume"
                dataKey="volume"
                fill="#4f46e5"
                opacity={0.2}
                radius={[2, 2, 0, 0]}
              />
            )}
            {chartType === 'area' ? (
              <Area
                yAxisId="price"
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            ) : (
              <Line
                yAxisId="price"
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 6,
                  fill: "#818cf8",
                  stroke: "#6366f1",
                  strokeWidth: 2,
                }}
              />
            )}
            {showMA && (
              <Line
                yAxisId="price"
                type="monotone"
                dataKey="ma"
                stroke="#22c55e"
                strokeWidth={1.5}
                dot={false}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 