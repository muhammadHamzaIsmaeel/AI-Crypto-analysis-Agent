"use client";
import { useEffect, useRef, useState } from "react";

interface Props {
  setSymbol: (symbol: string) => void;
  initialSymbol?: string;
}

// Define the TradingViewWidget type (basic placeholder, you can extend if needed)
type TradingViewWidget = {
  remove: () => void;
  onChartReady: (callback: () => void) => void;
  chart: () => {
    onSymbolChanged: () => {
      subscribe: (param: null, callback: (symbolFull: string) => void) => void;
    };
  };
};

export default function TradingViewChart({
  setSymbol,
  initialSymbol = "BTCUSDT",
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const widgetRef = useRef<TradingViewWidget | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (widgetRef.current) {
        widgetRef.current.remove();
        widgetRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.id = "tradingview-widget-script";

    script.onload = () => {
      setIsScriptLoaded(true);

      // @ts-expect-error TradingView is a global variable
      widgetRef.current = new TradingView.widget({
        container_id: "tradingview-container",
        autosize: true,
        symbol: `BINANCE:${initialSymbol}`,
        interval: "15",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        toolbar_bg: "#f1f3f6",
        enable_publishing: false,
        allow_symbol_change: true,
        save_image: false,
        studies: [
          "RSI@tv-basicstudies",
          "MACD@tv-basicstudies",
          "Volume@tv-basicstudies",
        ],
        overrides: {
          "paneProperties.background": "#0f172a",
          "paneProperties.vertGridProperties.color": "#1e293b",
          "paneProperties.horzGridProperties.color": "#1e293b",
        },
        disabled_features: [
          "header_fullscreen_button",
          "header_compare",
          "header_screenshot",
        ],
      });

      const interval = setInterval(() => {
        // @ts-expect-error TradingView is a global variable
        if (window.TradingView && widgetRef.current) {
          widgetRef.current.onChartReady(() => {
            widgetRef.current?.chart().onSymbolChanged().subscribe(null, (symbolFull: string) => {
              const symbolParts = symbolFull.split(":");
              if (symbolParts.length > 1) {
                const newSymbol = symbolParts[1];
                setSymbol(newSymbol);
              }
            });
            clearInterval(interval);
          });
        }
      }, 500);
    };

    if (!document.getElementById("tradingview-widget-script")) {
      document.body.appendChild(script);
    } else if (isScriptLoaded) {
      script.onload?.(new Event("load"));
    }

    return () => {
      if (widgetRef.current) {
        widgetRef.current.remove();
        widgetRef.current = null;
      }
    };
  }, [initialSymbol, setSymbol, isScriptLoaded]);

  return (
    <div className="w-full border border-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div
        id="tradingview-container"
        ref={containerRef}
        className="h-[500px]"
      />
      {!isScriptLoaded && (
        <div className="h-[500px] flex items-center justify-center bg-gray-900">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading TradingView...</p>
          </div>
        </div>
      )}
    </div>
  );
}
