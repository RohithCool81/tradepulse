'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PortfolioChart } from '@/app/components/PortfolioChart';
import { MiniChart } from '@/app/components/MiniChart';
import {
  TrendingUp,
  TrendingDown,
  Globe,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  AlertTriangle,
  Newspaper,
  Globe2,
  Building2,
  Landmark
} from 'lucide-react';

// Mock market data
const generateMarketData = () => {
  // Helper function to generate realistic price movements
  const generatePriceChange = (baseChange: number) => {
    const randomFactor = Math.random() * 0.6 - 0.3; // Random factor between -0.3 and 0.3
    return baseChange + randomFactor;
  };

  // Helper function to generate realistic volume
  const generateVolume = (base: number) => {
    const units = ['K', 'M', 'B'];
    const unit = units[Math.floor(Math.random() * 2)];
    const volume = (base + Math.random() * base * 0.2).toFixed(1);
    return `${volume}${unit}`;
  };

  return {
    indices: [
      {
        name: 'S&P 500',
        symbol: 'SPX',
        price: 5123.45 + Math.random() * 25,
        change: generatePriceChange(0.8),
        volume: '4.2B',
      },
      {
        name: 'Nasdaq',
        symbol: 'NDX',
        price: 17892.34 + Math.random() * 40,
        change: generatePriceChange(-0.5),
        volume: '5.1B',
      },
      {
        name: 'Dow Jones',
        symbol: 'DJI',
        price: 38456.78 + Math.random() * 30,
        change: generatePriceChange(0.3),
        volume: '2.8B',
      },
    ],
    indianIndices: [
      {
        name: 'Nifty 50',
        symbol: 'NIFTY',
        price: 22345.67 + Math.random() * 50,
        change: generatePriceChange(0.6),
        volume: '234.5M',
      },
      {
        name: 'Sensex',
        symbol: 'SENSEX',
        price: 74123.45 + Math.random() * 100,
        change: generatePriceChange(0.4),
        volume: '186.3M',
      },
      {
        name: 'Bank Nifty',
        symbol: 'BANKNIFTY',
        price: 46789.12 + Math.random() * 75,
        change: generatePriceChange(-0.2),
        volume: '142.8M',
      },
    ],
    trendingStocks: [
      {
        symbol: 'NVDA',
        name: 'NVIDIA Corporation',
        price: 878.45 + Math.random() * 15,
        change: generatePriceChange(2.1),
        volume: generateVolume(42.5),
      },
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        price: 172.34 + Math.random() * 5,
        change: generatePriceChange(-1.2),
        volume: generateVolume(65.8),
      },
      {
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        price: 425.67 + Math.random() * 8,
        change: generatePriceChange(0.9),
        volume: generateVolume(38.2),
      },
      {
        symbol: 'TSLA',
        name: 'Tesla, Inc.',
        price: 175.89 + Math.random() * 6,
        change: generatePriceChange(-2.3),
        volume: generateVolume(55.4),
      },
      {
        symbol: 'META',
        name: 'Meta Platforms, Inc.',
        price: 505.23 + Math.random() * 10,
        change: generatePriceChange(1.5),
        volume: generateVolume(28.7),
      },
      {
        symbol: 'AMZN',
        name: 'Amazon.com, Inc.',
        price: 178.56 + Math.random() * 7,
        change: generatePriceChange(0.7),
        volume: generateVolume(45.3),
      },
    ],
    sectors: [
      { name: 'Technology', performance: generatePriceChange(1.8), trend: 'up' },
      { name: 'Healthcare', performance: generatePriceChange(-0.7), trend: 'down' },
      { name: 'Finance', performance: generatePriceChange(0.5), trend: 'up' },
      { name: 'Energy', performance: generatePriceChange(-1.2), trend: 'down' },
      { name: 'Consumer', performance: generatePriceChange(0.9), trend: 'up' },
      { name: 'Industrial', performance: generatePriceChange(0.2), trend: 'up' },
      { name: 'Materials', performance: generatePriceChange(-0.4), trend: 'down' },
      { name: 'Real Estate', performance: generatePriceChange(0.3), trend: 'up' },
    ],
    marketBreadth: {
      advancing: 285 + Math.floor(Math.random() * 30),
      declining: 215 + Math.floor(Math.random() * 25),
      unchanged: 32 + Math.floor(Math.random() * 10),
      newHighs: 45 + Math.floor(Math.random() * 8),
      newLows: 12 + Math.floor(Math.random() * 6),
    },
    marketNews: [
      {
        title: "Fed Signals Rate Cut Timeline",
        description: "Federal Reserve hints at potential rate cuts in coming months, markets respond positively.",
        impact: {
          regions: ["US", "Global"],
          sectors: ["Banking", "Real Estate"],
          sentiment: "Positive",
          magnitude: "High"
        },
        time: "2h ago"
      },
      {
        title: "India's Tech Exports Surge",
        description: "Indian IT services exports show 15% YoY growth, boosting market sentiment.",
        impact: {
          regions: ["India", "Asia"],
          sectors: ["Technology", "Services"],
          sentiment: "Positive",
          magnitude: "Medium"
        },
        time: "4h ago"
      },
      {
        title: "Oil Prices Volatility",
        description: "Geopolitical tensions in Middle East cause oil price fluctuations.",
        impact: {
          regions: ["Global", "Middle East"],
          sectors: ["Energy", "Transportation"],
          sentiment: "Negative",
          magnitude: "High"
        },
        time: "6h ago"
      },
      {
        title: "Semiconductor Supply Chain Update",
        description: "Global chip shortage showing signs of easing, production ramping up.",
        impact: {
          regions: ["Asia", "US", "Europe"],
          sectors: ["Technology", "Automotive"],
          sentiment: "Positive",
          magnitude: "Medium"
        },
        time: "8h ago"
      }
    ],
    marketImpacts: [
      {
        event: "Interest Rate Changes",
        affects: [
          { market: "US Stocks", impact: "High", direction: "Positive" },
          { market: "Indian Markets", impact: "Medium", direction: "Positive" },
          { market: "Global Bonds", impact: "High", direction: "Negative" }
        ]
      },
      {
        event: "Oil Price Volatility",
        affects: [
          { market: "Energy Stocks", impact: "High", direction: "Positive" },
          { market: "Indian Rupee", impact: "Medium", direction: "Negative" },
          { market: "Transportation", impact: "Medium", direction: "Negative" }
        ]
      },
      {
        event: "Tech Sector Growth",
        affects: [
          { market: "NASDAQ", impact: "High", direction: "Positive" },
          { market: "Indian IT Stocks", impact: "High", direction: "Positive" },
          { market: "Asian Markets", impact: "Medium", direction: "Positive" }
        ]
      }
    ]
  };
};

export default function MarketsPage() {
  const [marketData, setMarketData] = useState(generateMarketData());
  const [selectedTab, setSelectedTab] = useState('global');

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(generateMarketData());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 py-8">
      <div className="container mx-auto px-4">
        {/* Market Selection Tabs */}
        <div className="mb-8">
          <Tabs defaultValue="global" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-zinc-900/50">
              <TabsTrigger value="global" onClick={() => setSelectedTab('global')}>
                <Globe2 className="w-4 h-4 mr-2" />
                Global Markets
              </TabsTrigger>
              <TabsTrigger value="indian" onClick={() => setSelectedTab('indian')}>
                <Landmark className="w-4 h-4 mr-2" />
                Indian Markets
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="global" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {marketData.indices.map((index) => (
                  <Card key={index.symbol} className="p-6 bg-zinc-900/50 border-zinc-800">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-zinc-100">{index.name}</h3>
                        <p className="text-sm text-zinc-500">{index.symbol}</p>
                      </div>
                      <div className={`flex items-center ${index.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {index.change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        <span>{Math.abs(index.change).toFixed(2)}%</span>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-zinc-100 mb-2">
                      ${index.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-sm text-zinc-500 mb-4">Volume: {index.volume}</div>
                    <MiniChart
                      data={Array.from({ length: 24 }, (_, i) => ({
                        time: i,
                        value: 100 + Math.sin(i * 0.5) * 10 + Math.random() * 5
                      }))}
                      color={index.change >= 0 ? "#22c55e" : "#ef4444"}
                      height={80}
                      className="mt-auto"
                    />
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="indian" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {marketData.indianIndices.map((index) => (
                  <Card key={index.symbol} className="p-6 bg-zinc-900/50 border-zinc-800">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-zinc-100">{index.name}</h3>
                        <p className="text-sm text-zinc-500">{index.symbol}</p>
                      </div>
                      <div className={`flex items-center ${index.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {index.change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        <span>{Math.abs(index.change).toFixed(2)}%</span>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-zinc-100 mb-2">
                      ₹{index.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-sm text-zinc-500 mb-4">Volume: {index.volume}</div>
                    <MiniChart
                      data={Array.from({ length: 24 }, (_, i) => ({
                        time: i,
                        value: 100 + Math.sin(i * 0.5) * 10 + Math.random() * 5
                      }))}
                      color={index.change >= 0 ? "#22c55e" : "#ef4444"}
                      height={80}
                      className="mt-auto"
                    />
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Market News and Impact Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="p-6 bg-zinc-900/50 border-zinc-800">
            <div className="flex items-center gap-2 mb-6">
              <Newspaper className="w-5 h-5 text-blue-500" />
              <h2 className="text-xl font-semibold text-zinc-100">Market News</h2>
            </div>
            <div className="space-y-4">
              {marketData.marketNews.map((news, index) => (
                <div key={index} className="p-4 rounded-lg bg-zinc-900/30 border border-zinc-800/50">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-zinc-100">{news.title}</h3>
                    <span className="text-xs text-zinc-500">{news.time}</span>
                  </div>
                  <p className="text-sm text-zinc-400 mb-3">{news.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {news.impact.regions.map((region) => (
                      <span key={region} className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-400">
                        {region}
                      </span>
                    ))}
                    {news.impact.sectors.map((sector) => (
                      <span key={sector} className="text-xs px-2 py-1 rounded-full bg-violet-500/10 text-violet-400">
                        {sector}
                      </span>
                    ))}
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      news.impact.sentiment === 'Positive' 
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-red-500/10 text-red-400'
                    }`}>
                      {news.impact.sentiment}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-zinc-900/50 border-zinc-800">
            <div className="flex items-center gap-2 mb-6">
              <Building2 className="w-5 h-5 text-violet-500" />
              <h2 className="text-xl font-semibold text-zinc-100">Market Impact Analysis</h2>
            </div>
            <div className="space-y-6">
              {marketData.marketImpacts.map((impact, index) => (
                <div key={index} className="space-y-3">
                  <h3 className="font-medium text-zinc-100">{impact.event}</h3>
                  <div className="space-y-2">
                    {impact.affects.map((affect, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded bg-zinc-900/30">
                        <span className="text-sm text-zinc-400">{affect.market}</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            affect.direction === 'Positive'
                              ? 'bg-green-500/10 text-green-400'
                              : 'bg-red-500/10 text-red-400'
                          }`}>
                            {affect.direction}
                          </span>
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-400">
                            {affect.impact}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Trending Stocks */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-zinc-100 mb-6">Trending Stocks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {marketData.trendingStocks.map((stock) => (
              <Card key={stock.symbol} className="p-4 bg-zinc-900/50 border-zinc-800">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <div className="font-medium text-zinc-100">{stock.symbol}</div>
                    <div className="text-sm text-zinc-500">{stock.name}</div>
                  </div>
                  <div>
                    <div className="text-right font-medium text-zinc-100">
                      ${stock.price.toFixed(2)}
                    </div>
                    <div className={`text-sm text-right ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                    </div>
                  </div>
                </div>
                <div className="text-xs text-zinc-500">Volume: {stock.volume}</div>
              </Card>
            ))}
          </div>
        </div>

        {/* Sector Performance and Market Breadth */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6 bg-zinc-900/50 border-zinc-800">
            <h2 className="text-xl font-semibold text-zinc-100 mb-4">Sector Performance</h2>
            <div className="space-y-4">
              {marketData.sectors.map((sector) => (
                <div key={sector.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {sector.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-zinc-100">{sector.name}</span>
                  </div>
                  <span className={sector.performance >= 0 ? 'text-green-500' : 'text-red-500'}>
                    {sector.performance >= 0 ? '+' : ''}{sector.performance}%
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-zinc-900/50 border-zinc-800">
            <h2 className="text-xl font-semibold text-zinc-100 mb-4">Market Breadth</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Advancing</span>
                  <span className="text-green-500">{marketData.marketBreadth.advancing}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Declining</span>
                  <span className="text-red-500">{marketData.marketBreadth.declining}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Unchanged</span>
                  <span className="text-zinc-100">{marketData.marketBreadth.unchanged}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">New Highs</span>
                  <span className="text-green-500">{marketData.marketBreadth.newHighs}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">New Lows</span>
                  <span className="text-red-500">{marketData.marketBreadth.newLows}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">A/D Ratio</span>
                  <span className="text-zinc-100">
                    {(marketData.marketBreadth.advancing / marketData.marketBreadth.declining).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
} 