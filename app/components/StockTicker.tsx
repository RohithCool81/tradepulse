'use client';

import { useEffect, useState } from 'react';

interface StockPrice {
  symbol: string;
  name: string;
  price: number;
  change: number;
  volume: string;
}

const initialStocks: StockPrice[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 182.34, change: 2.4, volume: '32.5M' },
  { symbol: 'MSFT', name: 'Microsoft', price: 402.12, change: 1.8, volume: '28.1M' },
  { symbol: 'GOOGL', name: 'Alphabet', price: 142.56, change: -0.8, volume: '18.9M' },
  { symbol: 'AMZN', name: 'Amazon', price: 178.23, change: 3.2, volume: '25.7M' },
  { symbol: 'TSLA', name: 'Tesla', price: 248.50, change: -1.2, volume: '35.2M' },
  { symbol: 'META', name: 'Meta', price: 485.89, change: 1.5, volume: '22.3M' },
  { symbol: 'NVDA', name: 'NVIDIA', price: 875.32, change: 4.2, volume: '42.1M' },
  { symbol: 'JPM', name: 'JPMorgan', price: 172.45, change: 0.9, volume: '15.8M' },
  { symbol: 'V', name: 'Visa Inc.', price: 275.64, change: 0.5, volume: '12.4M' },
  { symbol: 'WMT', name: 'Walmart', price: 168.92, change: -0.3, volume: '8.9M' },
];

export function StockTicker() {
  const [stocks, setStocks] = useState(initialStocks);

  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prevStocks => 
        prevStocks.map(stock => ({
          ...stock,
          price: stock.price * (1 + (Math.random() * 0.02 - 0.01)),
          change: stock.change + (Math.random() * 0.4 - 0.2),
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-card/50 backdrop-blur-sm border-y border-blue-500/20">
      <div className="container mx-auto relative overflow-hidden py-2">
        <div className="animate-ticker flex whitespace-nowrap">
          {[...stocks, ...stocks].map((stock, index) => (
            <div
              key={`${stock.symbol}-${index}`}
              className="inline-flex items-center mx-8"
            >
              <div className="flex items-center gap-6">
                <div>
                  <div className="font-medium">{stock.symbol}</div>
                  <div className="text-xs text-muted-foreground">{stock.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">${stock.price.toFixed(2)}</div>
                  <div className={`text-xs ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                  </div>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <div>Vol</div>
                  <div>{stock.volume}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 