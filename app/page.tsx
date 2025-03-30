'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { PortfolioChart } from './components/PortfolioChart';

function generateChartData() {
  return Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    value: 120000 + Math.sin(i * 0.5) * 5000 + Math.random() * 2000
  }));
}

export default function Home() {
  const [chartData, setChartData] = useState(generateChartData());

  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(generateChartData());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-500/20 via-background to-background animate-gradient" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent" />

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Title Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 px-4 py-2 rounded-full mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-sm text-blue-500">Hackathon Project</span>
          </div>
          <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-500 to-primary/60 animate-gradient-x">
            TradePulse
          </h1>
          <p className="text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
            Experience the future of portfolio management with AI-powered insights and real-time market analysis
          </p>
          <div className="mt-8">
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8 py-6 bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105">
                Launch Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Metrics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-blue-500/20 shadow-lg hover:shadow-blue-500/5 transition-all duration-300 card-hover">
            <div className="text-4xl font-bold text-primary">1M+</div>
            <div className="text-muted-foreground mt-2">Data points analyzed daily</div>
          </div>
          <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-primary/20 shadow-lg hover:shadow-primary/5 transition-all duration-300 card-hover">
            <div className="text-4xl font-bold text-primary">99.9%</div>
            <div className="text-muted-foreground mt-2">Accuracy rate</div>
          </div>
          <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-blue-500/20 shadow-lg hover:shadow-blue-500/5 transition-all duration-300 card-hover">
            <div className="text-4xl font-bold text-primary">24/7</div>
            <div className="text-muted-foreground mt-2">Real-time updates</div>
          </div>
        </div>

        {/* iPad Mockup */}
        <div className="flex justify-center items-center perspective-1000">
          <div className="relative w-[1024px] h-[768px] bg-zinc-800 rounded-[55px] border-[14px] border-zinc-700 rotate-y-12 transform-gpu hover:rotate-y-8 transition-transform duration-500 shadow-2xl">
            {/* iPad Screen */}
            <div className="absolute inset-0 rounded-[40px] overflow-hidden bg-background">
              {/* Dashboard Content */}
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-2xl font-bold">Portfolio Overview</h2>
                    <p className="text-muted-foreground">Today's Performance</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
                      <span className="text-green-500 font-medium">+12.8% Today</span>
                    </div>
                  </div>
                </div>
                <div className="h-[400px]">
                  <PortfolioChart data={chartData} />
                </div>
                <div className="grid grid-cols-3 gap-6 mt-8">
                  <div className="p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-blue-500/20">
                    <div className="text-sm text-muted-foreground">Total Value</div>
                    <div className="text-2xl font-bold mt-1">$124,892.63</div>
                    <div className="text-sm text-green-500 mt-1">+$2,489.12</div>
                  </div>
                  <div className="p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-primary/20">
                    <div className="text-sm text-muted-foreground">Active Positions</div>
                    <div className="text-2xl font-bold mt-1">14</div>
                    <div className="text-sm text-muted-foreground mt-1">Across 6 markets</div>
                  </div>
                  <div className="p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-blue-500/20">
                    <div className="text-sm text-muted-foreground">Win Rate</div>
                    <div className="text-2xl font-bold mt-1">87.5%</div>
                    <div className="text-sm text-muted-foreground mt-1">Last 30 days</div>
                  </div>
                </div>
              </div>
            </div>
            {/* iPad Camera */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-zinc-900"></div>
            {/* iPad Reflection */}
            <div className="absolute inset-0 rounded-[40px] ipad-reflection pointer-events-none"></div>
          </div>
        </div>
      </div>
    </main>
  );
}
