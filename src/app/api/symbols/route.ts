import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'; // Ensure this is dynamic

type SymbolInfo = {
  symbol: string;
  status: string;
  baseAsset: string;
};

export async function GET() {
  try {
    const res = await fetch("https://api.binance.com/api/v3/exchangeInfo");
    if (!res.ok) {
      throw new Error(`Binance API responded with ${res.status}`);
    }
    
    const data = await res.json();
    
    const usdtPairs = data.symbols
      .filter((item: SymbolInfo) => item.symbol.endsWith("USDT") && item.status === "TRADING")
      .map((item: SymbolInfo) => ({
        symbol: item.symbol,
        name: item.baseAsset,
      }));

    return NextResponse.json(usdtPairs, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store, max-age=0'
      }
    });
  } catch (error) {
    console.error('Error fetching symbols:', error);
    return NextResponse.json(
      { error: 'Failed to fetch symbols' },
      { status: 500 }
    );
  }
}