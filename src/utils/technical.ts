import { Candle } from "./Candle";

// New file src/utils/technical.ts
export function calculate24hChange(candles: Candle[]) {
  if (candles.length < 96) return 0; // 15m * 96 = 24h
  const first = candles[0].close;
  const last = candles[candles.length - 1].close;
  return ((last - first) / first) * 100;
}

export function calculateVolumeTrend(candles: Candle[]) {
  if (candles.length < 2) return 0;

  const volumes = candles.map(candle => candle.volume);
  const avgVolume = volumes.reduce((a, b) => a + b, 0) / volumes.length;

  // Compare the latest volume with the average
  const latestVolume = volumes[volumes.length - 1];
  return ((latestVolume - avgVolume) / avgVolume) * 100;
}