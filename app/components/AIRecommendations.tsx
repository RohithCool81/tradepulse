'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, TrendingUp, AlertTriangle, BarChart2 } from 'lucide-react';

interface Recommendation {
  type: 'buy' | 'sell' | 'hold';
  symbol: string;
  confidence: number;
  reason: string;
}

interface RiskMetric {
  level: 'Low' | 'Medium' | 'High';
  score: number;
  description: string;
}

interface SectorRisk {
  sector: string;
  level: 'Low' | 'Medium' | 'High';
  score: number;
  description: string;
  holdings: number;
}

const mockRecommendations: Recommendation[] = [
  {
    type: 'buy',
    symbol: 'AAPL',
    confidence: 85,
    reason: 'Strong technical indicators and positive market sentiment'
  },
  {
    type: 'sell',
    symbol: 'TSLA',
    confidence: 75,
    reason: 'Approaching resistance level with weakening momentum'
  },
  {
    type: 'hold',
    symbol: 'MSFT',
    confidence: 90,
    reason: 'Stable performance with potential upside in cloud services'
  }
];

const overallRisk: RiskMetric = {
  level: 'Medium',
  score: 65,
  description: 'Portfolio shows moderate risk with balanced diversification'
};

const sectorRisks: SectorRisk[] = [
  {
    sector: 'Technology',
    level: 'High',
    score: 82,
    description: 'High concentration in volatile tech stocks',
    holdings: 45
  },
  {
    sector: 'Finance',
    level: 'Medium',
    score: 58,
    description: 'Balanced exposure to banking and fintech',
    holdings: 25
  },
  {
    sector: 'Healthcare',
    level: 'Low',
    score: 35,
    description: 'Well-diversified across pharma and biotech',
    holdings: 15
  },
  {
    sector: 'Consumer',
    level: 'Medium',
    score: 62,
    description: 'Mixed exposure to retail and e-commerce',
    holdings: 15
  }
];

export function AIRecommendations() {
  const [currentSector, setCurrentSector] = useState(0);
  const [showAllSectors, setShowAllSectors] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!showAllSectors) {
        setCurrentSector((prev) => (prev + 1) % sectorRisks.length);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [showAllSectors]);

  return (
    <div className="space-y-6">
      {/* AI Insights Header */}
      <div className="flex items-center gap-2">
        <Brain className="w-5 h-5 text-blue-500" />
        <h2 className="text-xl font-semibold">AI Insights</h2>
      </div>

      {/* Overall Risk Analysis */}
      <Card className="p-4 border-blue-500/20 hover:shadow-blue-500/5 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            <h3 className="font-medium">Overall Risk Analysis</h3>
          </div>
          <div className={`px-2 py-1 rounded text-sm ${
            overallRisk.level === 'High' ? 'bg-red-500/10 text-red-500' :
            overallRisk.level === 'Medium' ? 'bg-yellow-500/10 text-yellow-500' :
            'bg-green-500/10 text-green-500'
          }`}>
            {overallRisk.level} Risk
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Risk Score</span>
            <span className="font-medium">{overallRisk.score}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                overallRisk.level === 'High' ? 'bg-red-500' :
                overallRisk.level === 'Medium' ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
              style={{ width: `${overallRisk.score}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {overallRisk.description}
          </p>
        </div>
      </Card>

      {/* Sector Risk Analysis */}
      <Card className="p-4 border-blue-500/20 hover:shadow-blue-500/5 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-blue-500" />
            <h3 className="font-medium">Sector Risk Analysis</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAllSectors(!showAllSectors)}
            className="text-xs"
          >
            {showAllSectors ? 'Show Less' : 'Show All'}
          </Button>
        </div>
        <div className="space-y-4">
          {(showAllSectors ? sectorRisks : [sectorRisks[currentSector]]).map((risk, index) => (
            <div key={risk.sector} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <div className="font-medium">{risk.sector}</div>
                  <div className="text-xs text-muted-foreground">{risk.holdings}% of portfolio</div>
                </div>
                <div className={`px-2 py-1 rounded text-xs ${
                  risk.level === 'High' ? 'bg-red-500/10 text-red-500' :
                  risk.level === 'Medium' ? 'bg-yellow-500/10 text-yellow-500' :
                  'bg-green-500/10 text-green-500'
                }`}>
                  {risk.level} Risk
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    risk.level === 'High' ? 'bg-red-500' :
                    risk.level === 'Medium' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${risk.score}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {risk.description}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Trading Recommendations */}
      <Card className="p-4 border-blue-500/20 hover:shadow-blue-500/5 transition-all duration-300">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-blue-500" />
          <h3 className="font-medium">Trading Recommendations</h3>
        </div>
        <div className="space-y-4">
          {mockRecommendations.slice(0, showAll ? undefined : 2).map((rec, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{rec.symbol}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    rec.type === 'buy' ? 'bg-green-500/10 text-green-500' :
                    rec.type === 'sell' ? 'bg-red-500/10 text-red-500' :
                    'bg-blue-500/10 text-blue-500'
                  }`}>
                    {rec.type.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{rec.reason}</p>
              </div>
              <div className="text-right">
                <div className="font-medium">{rec.confidence}%</div>
                <div className="text-xs text-muted-foreground">confidence</div>
              </div>
            </div>
          ))}
          {!showAll && mockRecommendations.length > 2 && (
            <Button
              variant="ghost"
              className="w-full text-sm text-muted-foreground hover:text-foreground"
              onClick={() => setShowAll(true)}
            >
              Show More
            </Button>
          )}
        </div>
      </Card>

      {/* Portfolio Tips */}
      <Card className="p-4 border-blue-500/20 hover:shadow-blue-500/5 transition-all duration-300">
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 className="w-4 h-4 text-blue-500" />
          <h3 className="font-medium">Portfolio Tips</h3>
        </div>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5" />
            Consider rebalancing your tech sector allocation to reduce concentration risk
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5" />
            Set stop-loss orders for volatile positions to protect gains
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5" />
            Look for opportunities in defensive sectors for better diversification
          </li>
        </ul>
      </Card>
    </div>
  );
} 