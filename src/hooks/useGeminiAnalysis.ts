import { useEffect, useState } from "react";
import { calculateRSI } from "./useRSI";
import { calculate24hChange, calculateVolumeTrend } from "@/utils/technical";

interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export default function useAIAnalysis(candles: Candle[], symbol: string) {
  const [result, setResult] = useState("Loading AI analysis...");
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!candles || candles.length < 30) return;
      const last30 = candles.slice(-30);
      const rsi = calculateRSI(last30);

      const cleanSymbol = symbol.toUpperCase();

      const prompt = `
Provide professional trading analysis for ${cleanSymbol} in markdown format:

**📊 Technical Indicators**
- RSI(14): ${rsi.toFixed(2)} ${
        rsi > 70 ? "(Overbought)" : rsi < 30 ? "(Oversold)" : ""
      }
- Price Change (24h): ${calculate24hChange(candles)}%
- Volume Trend: ${calculateVolumeTrend(candles)}

**📈 Current Market Structure**
Identify if the market is in:
- Uptrend (Higher highs & higher lows)
- Downtrend (Lower highs & lower lows)
- Consolidation (Range-bound)

**🎯 Trading Recommendation**
Provide clear action:
- Strong Buy (if RSI < 30 & uptrend confirmation)
- Buy (if bullish structure)
- Strong Sell (if RSI > 70 & downtrend confirmation)
- Sell (if bearish structure)
- Wait (if unclear/consolidating)

Include 1-2 key support/resistance levels if apparent
`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
          }),
        }
      );

      const data = await res.json();
      const text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
      setResult(text);
    };

    fetchAnalysis();
    const interval = setInterval(fetchAnalysis, 60000);
    return () => clearInterval(interval);
  }, [candles, symbol]);

  return result;
}
