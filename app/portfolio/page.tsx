'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PortfolioChart } from '@/app/components/PortfolioChart';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { 
  PieChart, 
  BarChart3, 
  Briefcase, 
  TrendingUp, 
  AlertTriangle, 
  Scale,
  Target,
  Shuffle,
  Clock,
  Plus,
  Wallet,
  Building2,
  DollarSign,
  Newspaper,
  TrendingDown,
  Gem
} from 'lucide-react';

// Mock stock price data
const mockStockPrices = {
  AAPL: { price: 182.34, name: 'Apple Inc.' },
  MSFT: { price: 402.12, name: 'Microsoft' },
  GOOGL: { price: 142.56, name: 'Alphabet' },
  AMZN: { price: 178.23, name: 'Amazon' },
  TSLA: { price: 248.50, name: 'Tesla' },
  META: { price: 485.89, name: 'Meta' },
  NVDA: { price: 875.32, name: 'NVIDIA' },
  JPM: { price: 172.45, name: 'JPMorgan' },
  V: { price: 275.64, name: 'Visa Inc.' },
  WMT: { price: 168.92, name: 'Walmart' }
};

// Mock data - in a real app, this would come from your backend
const mockPortfolioData = {
  totalValue: 124582.34,
  dailyChange: 2.4,
  holdings: [
    { symbol: 'AAPL', allocation: 25, value: 31145.59, gain: 15.2 },
    { symbol: 'MSFT', allocation: 20, value: 24916.47, gain: 12.8 },
    { symbol: 'GOOGL', allocation: 15, value: 18687.35, gain: -3.5 },
    { symbol: 'AMZN', allocation: 15, value: 18687.35, gain: 8.9 },
    { symbol: 'NVDA', allocation: 25, value: 31145.59, gain: 45.2 },
  ],
  performance: {
    '1D': Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
      value: 120000 + Math.sin(i * 0.5) * 5000 + Math.random() * 2000
    })),
    '1W': Array.from({ length: 7 }, (_, i) => ({
      timestamp: new Date(Date.now() - (6 - i) * 86400000).toISOString(),
      value: 115000 + Math.sin(i * 0.8) * 8000 + Math.random() * 3000
    })),
    '1M': Array.from({ length: 30 }, (_, i) => ({
      timestamp: new Date(Date.now() - (29 - i) * 86400000).toISOString(),
      value: 105000 + Math.sin(i * 0.2) * 15000 + Math.random() * 5000
    })),
  },
  recentTrades: [
    { type: 'BUY', symbol: 'NVDA', quantity: 50, price: 875.42, date: '2024-03-15' },
    { type: 'SELL', symbol: 'TSLA', quantity: 100, price: 172.82, date: '2024-03-14' },
    { type: 'BUY', symbol: 'AAPL', quantity: 75, price: 172.45, date: '2024-03-13' },
  ],
  riskMetrics: {
    beta: 1.15,
    sharpeRatio: 1.8,
    volatility: 'Medium',
    drawdown: -12.5,
  },
  diversification: {
    sectorExposure: [
      { sector: 'Technology', percentage: 45 },
      { sector: 'Healthcare', percentage: 20 },
      { sector: 'Finance', percentage: 15 },
      { sector: 'Consumer', percentage: 12 },
      { sector: 'Energy', percentage: 8 },
    ],
    riskLevel: 'Moderate-Aggressive',
  },
  netWorth: {
    total: 248750.65,
    breakdown: [
      { type: 'Stocks', value: 124582.34, icon: '📈' },
      { type: 'Real Estate', value: 85000.00, icon: '🏠' },
      { type: 'Crypto', value: 15168.31, icon: '₿' },
      { type: 'Cash', value: 24000.00, icon: '💵' }
    ]
  },
  portfolioNews: [
    {
      stock: 'NVDA',
      event: "AI Chip Demand Surge",
      impact: "Positive",
      description: "NVIDIA reports record demand for AI processors",
      potentialEffect: "+3.5%",
      date: "2h ago",
      icon: '🚀'
    },
    {
      stock: 'AAPL',
      event: "iPhone 16 Leaks",
      impact: "Neutral",
      description: "New iPhone features leaked, mixed market reception",
      potentialEffect: "±1.2%",
      date: "4h ago",
      icon: '📱'
    },
    {
      stock: 'MSFT',
      event: "Cloud Revenue Growth",
      impact: "Positive",
      description: "Azure cloud services exceed market expectations",
      potentialEffect: "+2.8%",
      date: "6h ago",
      icon: '☁️'
    }
  ]
};

// Helper function to generate chart data for a stock
const generateStockData = (baseValue: number, days: number) => {
  return Array.from({ length: days }, (_, i) => ({
    timestamp: new Date(Date.now() - (days - 1 - i) * 86400000).toISOString(),
    value: baseValue * (1 + Math.sin(i * 0.2) * 0.1 + (Math.random() - 0.5) * 0.05)
  }));
};

export default function PortfolioPage() {
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M'>('1D');
  const [holdings, setHoldings] = useState(mockPortfolioData.holdings);
  const [newStock, setNewStock] = useState({ symbol: '', quantity: '', price: '' });
  const [chartData, setChartData] = useState(mockPortfolioData.performance[timeframe]);
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  // Update chart data when holdings change
  useEffect(() => {
    if (holdings.length === 0) {
      setChartData(mockPortfolioData.performance[timeframe]);
      return;
    }

    const days = timeframe === '1D' ? 24 : timeframe === '1W' ? 7 : 30;
    const combinedData = Array.from({ length: days }, (_, i) => {
      const timestamp = new Date(Date.now() - (days - 1 - i) * (timeframe === '1D' ? 3600000 : 86400000)).toISOString();
      const value = holdings.reduce((sum, holding) => {
        const stockData = generateStockData(holding.value, days);
        return sum + stockData[i].value;
      }, 0);
      return { timestamp, value };
    });

    setChartData(combinedData);
  }, [holdings, timeframe]);

  const addStock = () => {
    const symbol = newStock.symbol.toUpperCase();
    // Get current stock price from mock data or use input price
    const stockPrice = mockStockPrices[symbol as keyof typeof mockStockPrices]?.price || parseFloat(newStock.price);
    const quantity = parseFloat(newStock.quantity);
    const value = quantity * stockPrice;
    const totalPortfolioValue = holdings.reduce((sum, h) => sum + h.value, 0) + value;
    
    const newHolding = {
      symbol: symbol,
      allocation: (value / totalPortfolioValue) * 100,
      value: value,
      gain: 0,
    };

    // Update allocations for all holdings
    const updatedHoldings = holdings.map(h => ({
      ...h,
      allocation: (h.value / totalPortfolioValue) * 100
    }));

    setHoldings([...updatedHoldings, newHolding]);
    setNewStock({ symbol: '', quantity: '', price: '' });
    setDialogOpen(false); // Close the dialog

    // Show success toast with price information
    toast({
      title: "Stock Added Successfully",
      description: `Added ${quantity} shares of ${symbol} at $${stockPrice.toLocaleString()} per share.`,
      className: "bg-zinc-900 border-zinc-800 text-zinc-100",
    });
  };

  const removeStock = (symbol: string) => {
    const remainingHoldings = holdings.filter(h => h.symbol !== symbol);
    const totalValue = remainingHoldings.reduce((sum, h) => sum + h.value, 0);
    
    // Recalculate allocations
    const updatedHoldings = remainingHoldings.map(h => ({
      ...h,
      allocation: (h.value / totalValue) * 100
    }));

    setHoldings(updatedHoldings);
    if (selectedStock === symbol) {
      setSelectedStock(null);
    }
  };

  const totalValue = holdings.reduce((sum, h) => sum + h.value, 0);
  const dailyChange = holdings.reduce((sum, h) => sum + (h.value * h.gain / 100), 0);
  const dailyChangePercent = (dailyChange / totalValue) * 100;

  return (
    <main className="min-h-screen bg-zinc-950 py-8">
      <div className="container mx-auto px-4">
        {/* Net Worth Overview */}
        <div className="mb-8">
          <Card className="p-6 bg-gradient-to-br from-zinc-900/50 to-zinc-900/30 border-zinc-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Gem className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-xl font-bold text-zinc-100">Net Worth</h2>
            </div>
            <div className="text-3xl font-bold text-zinc-100 mb-4">
              ${mockPortfolioData.netWorth.total.toLocaleString()}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {mockPortfolioData.netWorth.breakdown.map((item) => (
                <div key={item.type} className="p-3 rounded-lg bg-zinc-900/30 border border-zinc-800/50">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-zinc-400 text-sm">{item.type}</span>
                  </div>
                  <div className="text-lg font-semibold text-zinc-100">
                    ${item.value.toLocaleString()}
                  </div>
                  <div className="text-xs text-zinc-500">
                    {((item.value / mockPortfolioData.netWorth.total) * 100).toFixed(1)}% of total
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Portfolio Overview */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-500/10 rounded-lg">
                <Briefcase className="w-5 h-5 text-violet-400" />
              </div>
              <h1 className="text-2xl font-bold text-zinc-100">Portfolio Overview</h1>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-500 hover:bg-blue-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Stock
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-zinc-900 border-zinc-800">
                <DialogHeader>
                  <DialogTitle className="text-zinc-100">Add New Stock</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm text-zinc-400">Stock Symbol</label>
                    <Input
                      placeholder="e.g., AAPL"
                      value={newStock.symbol}
                      onChange={(e) => {
                        const symbol = e.target.value.toUpperCase();
                        const stockData = mockStockPrices[symbol as keyof typeof mockStockPrices];
                        setNewStock({ 
                          ...newStock, 
                          symbol: symbol,
                          price: stockData ? stockData.price.toString() : newStock.price 
                        });
                      }}
                      className="bg-zinc-800 border-zinc-700 text-zinc-100"
                    />
                    {newStock.symbol && mockStockPrices[newStock.symbol as keyof typeof mockStockPrices] && (
                      <p className="text-xs text-zinc-400">
                        Current Price: ${mockStockPrices[newStock.symbol as keyof typeof mockStockPrices].price.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-zinc-400">Quantity</label>
                    <Input
                      type="number"
                      placeholder="Number of shares"
                      value={newStock.quantity}
                      onChange={(e) => setNewStock({ ...newStock, quantity: e.target.value })}
                      className="bg-zinc-800 border-zinc-700 text-zinc-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-zinc-400">Price per Share</label>
                    <Input
                      type="number"
                      placeholder="Price per share"
                      value={newStock.price}
                      onChange={(e) => setNewStock({ ...newStock, price: e.target.value })}
                      className="bg-zinc-800 border-zinc-700 text-zinc-100"
                      disabled={!!mockStockPrices[newStock.symbol as keyof typeof mockStockPrices]}
                    />
                    {newStock.quantity && newStock.price && (
                      <p className="text-sm text-zinc-400 mt-2">
                        Total Value: ${(parseFloat(newStock.quantity) * parseFloat(newStock.price)).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <Button 
                    className="w-full bg-blue-500 hover:bg-blue-600 mt-4"
                    onClick={addStock}
                    disabled={!newStock.symbol || !newStock.quantity || !newStock.price}
                  >
                    Add to Portfolio
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-zinc-900/50 border-zinc-800">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-4 h-4 text-blue-500" />
                <span className="text-zinc-400">Total Value</span>
              </div>
              <div className="text-2xl font-bold text-zinc-100">${totalValue.toLocaleString()}</div>
              <div className={`text-sm ${dailyChangePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {dailyChangePercent >= 0 ? '+' : ''}{dailyChangePercent.toFixed(2)}% today
              </div>
            </Card>
            <Card className="p-4 bg-zinc-900/50 border-zinc-800">
              <div className="flex items-center gap-2 mb-2">
                <Scale className="w-4 h-4 text-violet-500" />
                <span className="text-zinc-400">Risk Level</span>
              </div>
              <div className="text-xl font-bold text-zinc-100">{mockPortfolioData.diversification.riskLevel}</div>
              <div className="text-zinc-500 text-sm">Based on allocation</div>
            </Card>
            <Card className="p-4 bg-zinc-900/50 border-zinc-800">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-green-500" />
                <span className="text-zinc-400">Sharpe Ratio</span>
              </div>
              <div className="text-xl font-bold text-zinc-100">{mockPortfolioData.riskMetrics.sharpeRatio}</div>
              <div className="text-zinc-500 text-sm">Risk-adjusted return</div>
            </Card>
            <Card className="p-4 bg-zinc-900/50 border-zinc-800">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                <span className="text-zinc-400">Max Drawdown</span>
              </div>
              <div className="text-xl font-bold text-zinc-100">{mockPortfolioData.riskMetrics.drawdown}%</div>
              <div className="text-zinc-500 text-sm">Past 12 months</div>
            </Card>
          </div>
        </div>

        {/* Performance Chart */}
        <Card className="mb-8 p-6 bg-zinc-900/50 border-zinc-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-zinc-100">Performance</h2>
            <div className="flex gap-2">
              {(['1D', '1W', '1M'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeframe(period)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    timeframe === period
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'text-zinc-400 hover:text-zinc-100'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[400px]">
            <PortfolioChart data={chartData} />
          </div>
        </Card>

        {/* Holdings, Analysis, and News */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Holdings */}
          <Card className="col-span-2 p-6 bg-zinc-900/50 border-zinc-800">
            <h2 className="text-lg font-semibold text-zinc-100 mb-4">Holdings</h2>
            <div className="space-y-4">
              {holdings.map((holding) => (
                <div 
                  key={holding.symbol} 
                  className={`flex items-center justify-between p-4 rounded-lg bg-zinc-900/30 border border-zinc-800/50 cursor-pointer transition-colors ${
                    selectedStock === holding.symbol ? 'border-blue-500/50' : ''
                  }`}
                  onClick={() => setSelectedStock(holding.symbol)}
                >
                  <div>
                    <div className="font-medium text-zinc-100">{holding.symbol}</div>
                    <div className="text-sm text-zinc-500">{holding.allocation.toFixed(1)}% allocation</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-medium text-zinc-100">${holding.value.toLocaleString()}</div>
                      <div className={`text-sm ${holding.gain >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {holding.gain >= 0 ? '+' : ''}{holding.gain}%
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeStock(holding.symbol);
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
              {holdings.length === 0 && (
                <div className="text-center py-8 text-zinc-500">
                  No stocks in portfolio. Click "Add Stock" to get started.
                </div>
              )}
            </div>
          </Card>

          {/* Analysis Cards and Portfolio News */}
          <div className="space-y-8">
            {/* Portfolio News */}
            <Card className="p-6 bg-zinc-900/50 border-zinc-800">
              <div className="flex items-center gap-2 mb-4">
                <Newspaper className="w-4 h-4 text-blue-500" />
                <h2 className="text-lg font-semibold text-zinc-100">Portfolio News</h2>
              </div>
              <div className="space-y-4">
                {mockPortfolioData.portfolioNews.map((news, index) => (
                  <div key={index} className="p-3 rounded-lg bg-zinc-900/30 border border-zinc-800/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{news.icon}</span>
                        <span className="font-medium text-zinc-100">{news.stock}</span>
                      </div>
                      <span className="text-xs text-zinc-500">{news.date}</span>
                    </div>
                    <p className="text-sm text-zinc-300 mb-2">{news.event}</p>
                    <p className="text-xs text-zinc-400 mb-2">{news.description}</p>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        news.impact === 'Positive' 
                          ? 'bg-green-500/10 text-green-400'
                          : news.impact === 'Negative'
                          ? 'bg-red-500/10 text-red-400'
                          : 'bg-blue-500/10 text-blue-400'
                      }`}>
                        {news.impact}
                      </span>
                      <span className={`text-sm font-medium ${
                        news.potentialEffect.startsWith('+') 
                          ? 'text-green-400' 
                          : news.potentialEffect.startsWith('-')
                          ? 'text-red-400'
                          : 'text-blue-400'
                      }`}>
                        {news.potentialEffect}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Sector Exposure */}
            <Card className="p-6 bg-zinc-900/50 border-zinc-800">
              <div className="flex items-center gap-2 mb-4">
                <PieChart className="w-4 h-4 text-blue-500" />
                <h2 className="text-lg font-semibold text-zinc-100">Sector Exposure</h2>
              </div>
              <div className="space-y-3">
                {mockPortfolioData.diversification.sectorExposure.map((sector) => (
                  <div key={sector.sector} className="flex items-center justify-between">
                    <span className="text-zinc-400">{sector.sector}</span>
                    <span className="text-zinc-100">{sector.percentage}%</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Trades */}
            <Card className="p-6 bg-zinc-900/50 border-zinc-800">
              <div className="flex items-center gap-2 mb-4">
                <Shuffle className="w-4 h-4 text-violet-500" />
                <h2 className="text-lg font-semibold text-zinc-100">Recent Trades</h2>
              </div>
              <div className="space-y-3">
                {mockPortfolioData.recentTrades.map((trade, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        trade.type === 'BUY' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                      }`}>
                        {trade.type}
                      </span>
                      <span className="text-zinc-100">{trade.symbol}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-zinc-100">{trade.quantity} @ ${trade.price}</div>
                      <div className="text-xs text-zinc-500">{trade.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Trading Hours */}
            <Card className="p-6 bg-zinc-900/50 border-zinc-800">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-green-500" />
                <h2 className="text-lg font-semibold text-zinc-100">Market Hours</h2>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-400">NYSE</span>
                  <span className="text-green-500">Open</span>
                </div>
                <div className="text-xs text-zinc-500">9:30 AM - 4:00 PM EST</div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-2">
                  <div className="bg-green-500 h-full rounded-full" style={{ width: '65%' }}></div>
                </div>
                <div className="text-xs text-zinc-500 mt-1">4h 22m until close</div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
} 