// src/utils/fetchSymbols.ts

interface BinanceSymbol {
  symbol: string;
  status: string;
  baseAsset: string;
  quoteAsset: string;
}

interface BinanceExchangeInfo {
  symbols: BinanceSymbol[];
}

export async function fetchBinanceSymbols() {
  const res = await fetch("https://api.binance.com/api/v3/exchangeInfo");
  const data: BinanceExchangeInfo = await res.json();

  const usdtPairs = data.symbols
    .filter((item) => item.symbol.endsWith("USDT") && item.status === "TRADING")
    .map((item) => ({
      symbol: item.symbol,
      name: item.baseAsset,
    }));

  return usdtPairs;
}
