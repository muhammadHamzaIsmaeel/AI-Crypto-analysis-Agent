import { NextResponse } from "next/server";

type SymbolInfo = {
  symbol: string;
  status: string;
  baseAsset: string;
};

type ExchangeInfoResponse = {
  symbols: SymbolInfo[];
};

export async function GET() {
  const res = await fetch("https://api.binance.com/api/v3/exchangeInfo");
  const data: ExchangeInfoResponse = await res.json();

  const usdtPairs = data.symbols
    .filter((item) => item.symbol.endsWith("USDT") && item.status === "TRADING")
    .map((item) => ({
      symbol: item.symbol,
      name: item.baseAsset,
    }));

  return NextResponse.json(usdtPairs);
}
