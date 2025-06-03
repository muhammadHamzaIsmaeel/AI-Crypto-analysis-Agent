import { Candle } from "@/utils/Candle";

export function calculateRSI(candles: Candle[], period = 14): number {
  if (candles.length < period + 1) return 0;
  let gains = 0, losses = 0;

  for (let i = 1; i <= period; i++) {
    const diff = candles[i].close - candles[i - 1].close;
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }

  const avgGain = gains / period;
  const avgLoss = losses / period;
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}
