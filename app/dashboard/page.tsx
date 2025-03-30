'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StockTicker } from '../components/StockTicker';
import { PortfolioChart } from '@/app/components/PortfolioChart';
import { AIRecommendations } from '../components/AIRecommendations';
import { MiniChart } from '@/app/components/MiniChart';
import { ArrowUpRight, ArrowDownRight, TrendingUp, Activity, PieChart, Bell, Globe2, Newspaper, Briefcase, TrendingDown, BarChart3, AlertTriangle, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Simplified mock data
const timePeriodsData = {
  '1D': Array.from({ length: 24 }, (_, i) => ({
    timestamp: `${i.toString().padStart(2, '0')}:00`,
    value: 120000 + Math.sin(i * 0.5) * 5000 + Math.random() * 2000,
    volume: 1000000 + Math.random() * 500000
  })),
  '1W': Array.from({ length: 7 }, (_, i) => ({
    timestamp: `Day ${i + 1}`,
    value: 115000 + Math.sin(i * 0.8) * 8000 + Math.random() * 3000,
    volume: 1000000 + Math.random() * 500000
  })),
  '1M': Array.from({ length: 30 }, (_, i) => ({
    timestamp: `Day ${i + 1}`,
    value: 105000 + Math.sin(i * 0.2) * 15000 + Math.random() * 5000,
    volume: 1000000 + Math.random() * 500000
  })),
  '3M': Array.from({ length: 90 }, (_, i) => ({
    timestamp: `Day ${i + 1}`,
    value: 95000 + Math.sin(i * 0.1) * 20000 + Math.random() * 7000,
    volume: 1000000 + Math.random() * 500000
  })),
  '1Y': Array.from({ length: 12 }, (_, i) => ({
    timestamp: `Month ${i + 1}`,
    value: 80000 + Math.sin(i * 0.3) * 25000 + Math.random() * 8000,
    volume: 1000000 + Math.random() * 500000
  }))
} as const;

type TimePeriod = keyof typeof timePeriodsData;

// Mock market news data
const marketNews = [
  {
    id: 1,
    title: "Fed Signals Potential Rate Cut",
    impact: "Positive",
    category: "Economic",
    description: "Federal Reserve hints at possible interest rate cuts in coming months, boosting market sentiment.",
    time: "2h ago"
  },
  {
    id: 2,
    title: "Tech Sector Faces Chip Shortage",
    impact: "Negative",
    category: "Industry",
    description: "Global semiconductor shortage affects tech manufacturing, leading to production delays.",
    time: "4h ago"
  },
  {
    id: 3,
    title: "Oil Prices Surge Amid Tensions",
    impact: "Mixed",
    category: "Geopolitical",
    description: "Middle East tensions drive oil prices higher, affecting energy and transportation sectors.",
    time: "6h ago"
  }
];

// Mock sector performance data
const sectorPerformance = [
  { name: "Technology", change: +2.4, trend: "up" },
  { name: "Healthcare", change: -0.8, trend: "down" },
  { name: "Finance", change: +1.2, trend: "up" },
  { name: "Energy", change: +3.1, trend: "up" },
  { name: "Consumer", change: -0.3, trend: "down" }
];

// Add mini chart data
const miniChartData = {
  daily: Array.from({ length: 24 }, (_, i) => ({
    time: i,
    value: 100 + Math.sin(i * 0.5) * 10 + Math.random() * 5
  })),
  weekly: Array.from({ length: 7 }, (_, i) => ({
    time: i,
    value: 100 + Math.sin(i * 0.8) * 15 + Math.random() * 8
  }))
};

// Add top performing assets data
const topAssets = [
  { symbol: 'NVDA', name: 'NVIDIA', change: +4.2, price: 789.50 },
  { symbol: 'AAPL', name: 'Apple', change: +2.8, price: 175.20 },
  { symbol: 'MSFT', name: 'Microsoft', change: +1.9, price: 425.30 }
];

type Period = '1D' | '1W' | '1M' | '3M' | 'YTD';

const PERIODS: Period[] = ['1D', '1W', '1M', '3M', 'YTD'];

type ChartData = {
  timestamp: string;
  value: number;
  volume?: number;
};

function generateChartData(period: '1D' | '1W' | '1M' | '1Y') {
  const now = new Date();
  const data: ChartData[] = [];
  const baseValue = 100000;
  let timeStep: number;
  let steps: number;
  
  switch (period) {
    case '1D':
      timeStep = 15 * 60 * 1000; // 15 minutes
      steps = 24 * 4; // 24 hours * 4 (15-min intervals)
      break;
    case '1W':
      timeStep = 24 * 60 * 60 * 1000; // 1 day
      steps = 7; // 7 days
      break;
    case '1M':
      timeStep = 24 * 60 * 60 * 1000; // 1 day
      steps = 30; // 30 days
      break;
    case '1Y':
      timeStep = 7 * 24 * 60 * 60 * 1000; // 1 week
      steps = 52; // 52 weeks
      break;
  }

  for (let i = steps - 1; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - (i * timeStep));
    const randomChange = (Math.random() - 0.5) * 0.02; // -1% to +1% change
    const value = baseValue * (1 + randomChange * (steps - i));
    const volume = Math.floor(Math.random() * 1000000) + 500000;
    
    data.push({
      timestamp: timestamp.toISOString(),
      value: Math.round(value),
      volume,
    });
  }

  return data;
}

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'1D' | '1W' | '1M' | '1Y'>('1D');
  const chartData = useMemo(() => generateChartData(selectedPeriod), [selectedPeriod]);

  return (
    <main className="min-h-screen bg-zinc-950 py-8">
      <div className="container mx-auto px-4">
        {/* Net Worth Section */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
          <div className="md:col-span-2 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-zinc-100">Trad</h1>
              <p className="text-zinc-400 text-sm">Welcome back, Trader</p>
            </div>
            <Button variant="outline" size="sm" className="gap-2 text-zinc-300 border-zinc-800">
              <Activity className="w-4 h-4" />
              Market Open
            </Button>
          </div>
          <Card className="p-3 bg-zinc-900/50 border-zinc-800 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <div>
              <div className="text-sm font-medium text-zinc-100">NYSE Active</div>
              <div className="text-xs text-zinc-500">4h 22m left</div>
            </div>
          </Card>
          <Card className="p-3 bg-zinc-900/50 border-zinc-800 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <div>
              <div className="text-sm font-medium text-zinc-100">VIX: 18.24</div>
              <div className="text-xs text-zinc-500">Moderate volatility</div>
            </div>
          </Card>
          <Card className="p-3 bg-zinc-900/50 border-zinc-800 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <div>
              <div className="text-sm font-medium text-zinc-100">S&P 500</div>
              <div className="text-xs text-green-500">+1.2% today</div>
            </div>
          </Card>
          <Card className="p-3 bg-zinc-900/50 border-zinc-800 flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-indigo-500" />
            <div>
              <div className="text-sm font-medium text-zinc-100">Global Markets</div>
              <div className="text-xs text-green-500">Most markets up</div>
            </div>
          </Card>
        </div>

        {/* Portfolio Performance */}
        <div className="mb-12">
          <Card className="p-6 bg-zinc-900/50 border-zinc-800">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className="text-xl font-semibold text-zinc-100">Portfolio Performance</h2>
              </div>
              <div className="flex gap-2">
                {(['1D', '1W', '1M', '1Y'] as const).map((period) => (
                  <Button
                    key={period}
                    variant={selectedPeriod === period ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedPeriod(period)}
                    className="text-xs"
                  >
                    {period}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Main Chart */}
            <div className="h-[400px] mb-8">
              <PortfolioChart data={chartData} period={selectedPeriod} />
            </div>

            {/* Technical Indicators */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* RSI Card */}
                <Card className="p-4 bg-zinc-900/30 border-zinc-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-zinc-100">RSI</span>
                    <span className="text-sm text-zinc-400">14-period</span>
                  </div>
                  <div className="h-[100px]">
                    <MiniChart
                      data={Array.from({ length: 24 }, (_, i) => ({
                        time: i,
                        value: 50 + Math.sin(i * 0.5) * 20
                      }))}
                      color="#8b5cf6"
                      height={100}
                    />
                  </div>
                </Card>

                {/* MACD Card */}
                <Card className="p-4 bg-zinc-900/30 border-zinc-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-zinc-100">MACD</span>
                    <span className="text-sm text-zinc-400">12,26,9</span>
                  </div>
                  <div className="h-[100px]">
                    <MiniChart
                      data={Array.from({ length: 24 }, (_, i) => ({
                        time: i,
                        value: Math.sin(i * 0.3) * 10
                      }))}
                      color="#ec4899"
                      height={100}
                    />
                  </div>
                </Card>

                {/* Volume Card */}
                <Card className="p-4 bg-zinc-900/30 border-zinc-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-zinc-100">Volume</span>
                    <span className="text-sm text-zinc-400">Daily</span>
                  </div>
                  <div className="h-[100px]">
                    <MiniChart
                      data={Array.from({ length: 24 }, (_, i) => ({
                        time: i,
                        value: 50 + Math.random() * 50
                      }))}
                      color="#2dd4bf"
                      height={100}
                    />
                  </div>
                </Card>
              </div>
            </div>
          </Card>
        </div>

        {/* Market Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-4 bg-zinc-900/50 border-zinc-800">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-blue-500" />
              <h3 className="font-medium text-zinc-100">Market Cap</h3>
            </div>
            <div className="text-2xl font-bold text-zinc-100 mb-2">$2.45T</div>
            <div className="text-sm text-green-500 mb-4">+2.8%</div>
            <div className="h-[60px]">
              <MiniChart
                data={Array.from({ length: 24 }, (_, i) => ({
                  time: i,
                  value: 100 + Math.sin(i * 0.5) * 10
                }))}
                color="#3b82f6"
              />
            </div>
          </Card>

          <Card className="p-4 bg-zinc-900/50 border-zinc-800">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-violet-500" />
              <h3 className="font-medium text-zinc-100">Volume</h3>
            </div>
            <div className="text-2xl font-bold text-zinc-100 mb-2">425.8M</div>
            <div className="text-sm text-red-500 mb-4">-1.2%</div>
            <div className="h-[60px]">
              <MiniChart
                data={Array.from({ length: 24 }, (_, i) => ({
                  time: i,
                  value: 100 + Math.cos(i * 0.5) * 20
                }))}
                color="#8b5cf6"
              />
            </div>
          </Card>

          <Card className="p-4 bg-zinc-900/50 border-zinc-800">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="font-medium text-zinc-100">P/E Ratio</h3>
            </div>
            <div className="text-2xl font-bold text-zinc-100 mb-2">24.5</div>
            <div className="text-sm text-green-500 mb-4">+0.8%</div>
            <div className="h-[60px]">
              <MiniChart
                data={Array.from({ length: 24 }, (_, i) => ({
                  time: i,
                  value: 100 + Math.sin(i * 0.3) * 15
                }))}
                color="#f59e0b"
              />
            </div>
          </Card>
        </div>

        {/* News and Recent Trades Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Market News */}
          <div className="p-6 rounded-lg bg-zinc-900/50 border border-zinc-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-zinc-100">Market News</h3>
              <Newspaper className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="space-y-3">
              {marketNews.map((news) => (
                <div key={news.id} className="p-3 rounded-lg bg-zinc-900/30 border border-zinc-800/50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-zinc-100 mb-1">{news.title}</div>
                      <p className="text-xs text-zinc-500 line-clamp-2">{news.description}</p>
                    </div>
                    <div className="flex flex-col items-end ml-4">
                      <span className={cn(
                        "text-xs px-2 py-1 rounded-full mb-2",
                        news.impact === "Positive" ? "bg-green-500/10 text-green-500" :
                        news.impact === "Negative" ? "bg-red-500/10 text-red-500" :
                        "bg-yellow-500/10 text-yellow-500"
                      )}>
                        {news.impact}
                      </span>
                      <span className="text-xs text-zinc-500">{news.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Trades */}
          <div className="p-6 rounded-lg bg-zinc-900/50 border border-zinc-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-zinc-100">Recent Trades</h3>
              <Briefcase className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-900/30 border border-zinc-800/50">
                <div>
                  <div className="font-medium text-zinc-100">Bought TSLA</div>
                  <div className="text-sm text-zinc-500">100 @ $248.50</div>
                </div>
                <div className="text-green-500 flex items-center gap-1">
                  <ArrowUpRight className="w-4 h-4" />
                  +$1,240
                </div>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-900/30 border border-zinc-800/50">
                <div>
                  <div className="font-medium text-zinc-100">Sold META</div>
                  <div className="text-sm text-zinc-500">50 @ $485.89</div>
                </div>
                <div className="text-red-500 flex items-center gap-1">
                  <ArrowDownRight className="w-4 h-4" />
                  -$850
                </div>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-900/30 border border-zinc-800/50">
                <div>
                  <div className="font-medium text-zinc-100">Bought AAPL</div>
                  <div className="text-sm text-zinc-500">75 @ $175.20</div>
                </div>
                <div className="text-green-500 flex items-center gap-1">
                  <ArrowUpRight className="w-4 h-4" />
                  +$920
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Replace the Insights and Analytics Section */}
        <div className="mb-8">
          <Tabs defaultValue="portfolio" className="w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-zinc-100">Portfolio Stats</h2>
              <TabsList className="bg-zinc-900/50 border border-zinc-800 p-1">
                <TabsTrigger 
                  value="portfolio"
                  className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 px-4"
                >
                  Portfolio Value
                </TabsTrigger>
                <TabsTrigger 
                  value="performers"
                  className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400 px-4"
                >
                  Top Performers
                </TabsTrigger>
                <TabsTrigger 
                  value="insights"
                  className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-400 px-4"
                >
                  AI Insights
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="portfolio" className="mt-0">
              <Card className="p-4 bg-zinc-900/50 border-zinc-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <TrendingUp className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-sm text-zinc-400">Total Value</div>
                      <div className="text-2xl font-bold text-zinc-100">$124,582.34</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-green-500">+2.4% today</div>
                    <div className="text-xs text-zinc-500">+$2,891.45</div>
                  </div>
                </div>
                <div className="h-[120px]">
                  <MiniChart data={miniChartData.daily} color="#22c55e" height={120} />
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="performers" className="mt-0">
              <Card className="p-4 bg-zinc-900/50 border-zinc-800">
                <div className="grid grid-cols-3 gap-4">
                  {topAssets.map((asset) => (
                    <div key={asset.symbol} className="p-3 rounded-lg bg-zinc-900/30 border border-zinc-800/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-zinc-100">{asset.symbol}</span>
                        <div className="text-green-500 flex items-center text-sm">
                          <ArrowUpRight className="w-3 h-3" />
                          {asset.change}%
                        </div>
                      </div>
                      <div className="text-xs text-zinc-500">{asset.name}</div>
                      <div className="text-sm font-medium text-zinc-100 mt-1">${asset.price}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="mt-0">
              <Card className="p-4 bg-zinc-900/50 border-zinc-800">
                <AIRecommendations />
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Analytics Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sector Performance */}
          <Card className="p-6 bg-zinc-900/50 border-zinc-800">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-violet-500/10 rounded-lg">
                  <BarChart3 className="w-4 h-4 text-violet-400" />
                </div>
                <h3 className="text-zinc-100 font-medium">Sector Performance</h3>
              </div>
            </div>
            <div className="space-y-3">
              {sectorPerformance.map((sector) => (
                <div key={sector.name} className="flex justify-between items-center">
                  <span className="text-zinc-300">{sector.name}</span>
                  <span className={cn(
                    "flex items-center gap-1",
                    sector.change > 0 ? "text-green-500" : "text-red-500"
                  )}>
                    {sector.change > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {Math.abs(sector.change)}%
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Risk Metrics */}
          <Card className="p-6 bg-zinc-900/50 border-zinc-800">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                </div>
                <h3 className="text-zinc-100 font-medium">Risk Metrics</h3>
              </div>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-zinc-900/30 border border-zinc-800/50">
                  <div className="text-sm text-zinc-400 mb-1">Beta</div>
                  <div className="text-xl font-semibold text-zinc-100">1.15</div>
                </div>
                <div className="p-3 rounded-lg bg-zinc-900/30 border border-zinc-800/50">
                  <div className="text-sm text-zinc-400 mb-1">Sharpe Ratio</div>
                  <div className="text-xl font-semibold text-zinc-100">1.8</div>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-zinc-900/30 border border-zinc-800/50">
                <div className="text-sm text-zinc-400 mb-1">Volatility</div>
                <div className="flex items-center justify-between">
                  <div className="text-xl font-semibold text-zinc-100">Medium</div>
                  <div className="w-24 h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="w-1/2 h-full bg-amber-500" />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Portfolio Allocation */}
          <Card className="p-6 bg-zinc-900/50 border-zinc-800">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-500/10 rounded-lg">
                  <PieChart className="w-4 h-4 text-indigo-400" />
                </div>
                <h3 className="text-zinc-100 font-medium">Portfolio Allocation</h3>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-zinc-300">Stocks</span>
                <span className="text-zinc-100">65%</span>
              </div>
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className="w-[65%] h-full bg-indigo-500" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-300">Bonds</span>
                <span className="text-zinc-100">20%</span>
              </div>
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className="w-[20%] h-full bg-blue-500" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-300">Cash</span>
                <span className="text-zinc-100">15%</span>
              </div>
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className="w-[15%] h-full bg-green-500" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
} 