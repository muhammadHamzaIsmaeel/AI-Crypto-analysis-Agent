"use client";
import Head from "next/head";
import TradingViewChart from "@/components/TradingViewChart";
import useCandleData from "@/hooks/useCandleData";
import AIAnalysis from "@/components/AIAnalysis";
import useAIAnalysis from "@/hooks/useGeminiAnalysis";
import { 
  FaChartLine, 
  FaRobot, 
  FaSearch,
  FaStar,
  FaRegStar,
  FaBars,
  FaTimes
} from "react-icons/fa";
import { 
  IoMdRefresh,
  IoMdTrendingUp,
  IoMdTrendingDown
} from "react-icons/io";
import { useState, useEffect, useMemo } from "react";
import { FiFilter } from "react-icons/fi";
import { GiTrade } from "react-icons/gi";

export default function Home() {
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [updateInterval, setUpdateInterval] = useState(5);
  const [lastUpdated, setLastUpdated] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showAllCoins, setShowAllCoins] = useState(false);
  const [trendFilter, setTrendFilter] = useState<"all" | "up" | "down">("all");
  const [allCoins, setAllCoins] = useState<{ symbol: string; name: string }[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const candles = useCandleData(symbol, "15m");
  const analysisResult = useAIAnalysis(candles, symbol);

  // Filter and sort coins
  const filteredCoins = useMemo(() => {
    return allCoins.filter(coin => {
      const matchesSearch = coin.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            coin.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTrend = trendFilter === "all" || 
                          (trendFilter === "up" && Math.random() > 0.5) ||
                          (trendFilter === "down" && Math.random() <= 0.5);
      return matchesSearch && matchesTrend;
    }).sort((a, b) => {
      const aFav = favorites.includes(a.symbol);
      const bFav = favorites.includes(b.symbol);
      if (aFav && !bFav) return -1;
      if (!aFav && bFav) return 1;
      return a.symbol.localeCompare(b.symbol);
    });
  }, [searchQuery, favorites, trendFilter, allCoins]);

  // Update timestamp
  useEffect(() => {
    const updateTime = () => {
      setLastUpdated(new Date().toLocaleTimeString());
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadSymbols = async () => {
      const res = await fetch("/api/symbols");
      const coins = await res.json();
      setAllCoins(coins);
    };
    loadSymbols();
  }, []);

  const refreshData = () => {
    setLastUpdated(new Date().toLocaleTimeString());
    setSymbol(prev => prev + " ");
    setTimeout(() => setSymbol(prev => prev.trim()), 10);
  };

  const toggleFavorite = (coinSymbol: string) => {
    setFavorites(prev => 
      prev.includes(coinSymbol)
        ? prev.filter(s => s !== coinSymbol)
        : [...prev, coinSymbol]
    );
  };

  return (
    <>
      <Head>
        <title>Pro Crypto AI Trader</title>
        <meta name="description" content="Advanced AI-powered cryptocurrency trading assistant" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <main className="min-h-screen bg-gray-950 text-white">
        {/* Enhanced Top Navigation */}
        <nav className="bg-gray-900 border-b border-gray-800 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button 
              className="lg:hidden text-gray-400 hover:text-white mr-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
            <GiTrade className="text-teal-400 text-xl sm:text-2xl" />
            <h1 className="font-bold text-lg sm:text-xl bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
              AI Crypto Trader Pro
            </h1>
          </div>
          <div className="flex items-center gap-3 sm:gap-5">
            <button 
              onClick={refreshData}
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm bg-gray-800 hover:bg-gray-700 px-3 sm:px-4 py-1 sm:py-2 rounded-lg transition-all duration-200 hover:scale-105"
            >
              <IoMdRefresh className={`${lastUpdated ? "animate-spin-once" : ""}`} />
              <span className="hidden sm:inline">Refresh Data</span>
              <span className="sm:hidden">Refresh</span>
            </button>
            <div className="text-xs sm:text-sm text-gray-300 flex items-center gap-1 sm:gap-2">
              <span className="text-gray-400 hidden sm:inline">Last update:</span>
              <span className="text-gray-400 sm:hidden">Updated:</span>
              <span className="font-mono text-yellow-400">{lastUpdated}</span>
            </div>
          </div>
        </nav>

        <div className="flex">
          {/* Enhanced Left Sidebar - Coin Selection */}
          <div className={`lg:col-span-1 bg-gray-900 border border-gray-800 p-4 sm:p-5 shadow-lg fixed lg:static z-10 h-[calc(100vh-64px)] lg:h-auto w-3/4 sm:w-1/2 md:w-1/3 lg:w-auto transition-all duration-300 ease-in-out transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
            <div className="mb-4 sm:mb-5 flex items-center justify-between">
              <h2 className="font-semibold text-base sm:text-lg flex items-center gap-2 sm:gap-3">
                <FaChartLine className="text-teal-400 text-lg sm:text-xl" />
                <span>Market Pairs</span>
              </h2>
              <div className="flex gap-1 sm:gap-2">
                <button 
                  onClick={() => setTrendFilter("up")}
                  className={`p-1 sm:p-2 rounded-lg transition-colors ${trendFilter === "up" ? "bg-green-900/50 text-green-400" : "text-gray-400 hover:bg-gray-800"}`}
                  title="Show uptrending"
                >
                  <IoMdTrendingUp className="text-base sm:text-lg" />
                </button>
                <button 
                  onClick={() => setTrendFilter("down")}
                  className={`p-1 sm:p-2 rounded-lg transition-colors ${trendFilter === "down" ? "bg-red-900/50 text-red-400" : "text-gray-400 hover:bg-gray-800"}`}
                  title="Show downtrending"
                >
                  <IoMdTrendingDown className="text-base sm:text-lg" />
                </button>
                <button 
                  onClick={() => setTrendFilter("all")}
                  className={`p-1 sm:p-2 rounded-lg transition-colors ${trendFilter === "all" ? "bg-blue-900/50 text-blue-400" : "text-gray-400 hover:bg-gray-800"}`}
                  title="Show all"
                >
                  <FiFilter className="text-base sm:text-lg" />
                </button>
              </div>
            </div>

            <div className="relative mb-4 sm:mb-5">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search coins..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-1 sm:space-y-2 h-[calc(100%-180px)] sm:h-[1000px] overflow-y-auto custom-scrollbar">
              {filteredCoins.slice(0, showAllCoins ? undefined : 100).map((coin) => (
                <div
                  key={coin.symbol}
                  onClick={() => {
                    setSymbol(coin.symbol);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-between p-2 sm:p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-800/70 ${
                    symbol === coin.symbol ? "bg-teal-900/30 border border-teal-800/50 shadow-md" : "bg-gray-800/50"
                  }`}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(coin.symbol);
                      }}
                      className={`transition-colors duration-200 ${favorites.includes(coin.symbol) ? "text-yellow-400 hover:text-yellow-300" : "text-gray-500 hover:text-yellow-400"}`}
                    >
                      {favorites.includes(coin.symbol) ? <FaStar /> : <FaRegStar />}
                    </button>
                    <div>
                      <div className="font-medium text-sm sm:text-base">{coin.symbol}</div>
                      <div className="text-xs text-gray-400 truncate max-w-[100px] sm:max-w-[120px]">{coin.name}</div>
                    </div>
                  </div>
                  <div className="text-xs flex items-center gap-1">
                    <span className={Math.random() > 0.5 ? "text-green-400" : "text-red-400"}>
                      {Math.random() > 0.5 ? "+" : "-"}{(Math.random() * 5).toFixed(2)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {filteredCoins.length > 100 && !showAllCoins && (
              <button
                onClick={() => setShowAllCoins(true)}
                className="w-full mt-2 sm:mt-4 text-xs sm:text-sm text-center text-teal-400 hover:text-teal-300 py-1 sm:py-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors duration-200"
              >
                Show all {filteredCoins.length} coins...
              </button>
            )}
          </div>

          {/* Enhanced Main Content */}
          <div className="lg:col-span-3 w-full lg:pl-6">
            {/* Overlay for mobile menu */}
            {isMobileMenuOpen && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-0 lg:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
            )}
            
            <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
              {/* Chart and Analysis */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
                <div className="xl:col-span-2 bg-gray-900 rounded-xl border border-gray-800 p-4 sm:p-5 shadow-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-5 gap-3">
                    <h2 className="font-semibold text-base sm:text-lg flex items-center gap-2 sm:gap-3">
                      <FaChartLine className="text-teal-400 text-lg sm:text-xl" />
                      <span>{symbol} Chart</span>
                    </h2>
                    <select
                      value={updateInterval}
                      onChange={(e) => setUpdateInterval(Number(e.target.value))}
                      className="bg-gray-800 text-white text-sm rounded-lg px-3 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 w-full sm:w-auto"
                    >
                      <option value={1}>1m Updates</option>
                      <option value={5}>5m Updates</option>
                      <option value={15}>15m Updates</option>
                      <option value={30}>30m Updates</option>
                      <option value={60}>1h Updates</option>
                    </select>
                  </div>
                  <div className="">
                    <TradingViewChart 
                      setSymbol={setSymbol}
                      initialSymbol={symbol}
                    />
                  </div>
                </div>

                <div className="xl:col-span-1">
                  <AIAnalysis result={analysisResult} />
                </div>
              </div>

              {/* Enhanced Market Overview */}
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 sm:p-5 shadow-lg">
                <h2 className="font-semibold text-base sm:text-lg flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
                  <FaRobot className="text-pink-400 text-lg sm:text-xl" />
                  <span>Market Pulse</span>
                </h2>
                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                  {['BTC', 'ETH', 'SOL', 'XRP'].map(coin => {
                    const isUp = Math.random() > 0.5;
                    const changePercent = (Math.random() * 5).toFixed(2);
                    const price = (Math.random() * 50000).toFixed(2);
                    const signals = ['Strong Buy', 'Buy', 'Neutral', 'Sell', 'Strong Sell'];
                    const signal = signals[Math.floor(Math.random() * 5)];
                    
                    return (
                      <div key={coin} className="bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-700 hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-bold text-sm sm:text-base text-gray-300">{coin}/USDT</div>
                            <div className="text-xl sm:text-2xl font-bold mt-1 sm:mt-2">
                              ${price}
                            </div>
                          </div>
                          <div className={`text-xs sm:text-sm px-2 py-1 rounded-full ${
                            isUp ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
                          }`}>
                            {isUp ? '+' : '-'}{changePercent}%
                          </div>
                        </div>
                        <div className="mt-2 sm:mt-3 flex justify-between items-center">
                          <div className="text-xs text-gray-400">
                            AI Signal: 
                          </div>
                          <div className={`text-xs font-semibold ${
                            signal.includes('Buy') ? 'text-green-400' : 
                            signal.includes('Sell') ? 'text-red-400' : 'text-yellow-400'
                          }`}>
                            {signal}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

    </>
  );
}