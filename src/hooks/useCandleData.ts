import { useEffect, useState } from "react";

interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

type BinanceKline = [
  number,  // time
  string,  // open
  string,  // high
  string,  // low
  string,  // close
  ...rest: unknown[] // ignore the rest
];

export default function useCandleData(symbol = "BTCUSDT", interval = "15m") {
  const [candles, setCandles] = useState<Candle[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=50`;
        const response = await fetch(url);
        const data: BinanceKline[] = await response.json();

        const formatted: Candle[] = data.map((candle) => ({
          time: candle[0],
          open: parseFloat(candle[1]),
          high: parseFloat(candle[2]),
          low: parseFloat(candle[3]),
          close: parseFloat(candle[4]),
          volume: parseFloat(candle[5] as string),
        }));

        setCandles(formatted);
      } catch (error) {
        console.error("Error fetching candle data:", error);
      }
    };

    fetchData();
  }, [symbol, interval]);

  return candles;
}
