import { useEffect, useState } from "react";
import { FaArrowUp, FaArrowDown, FaPause, FaExclamationTriangle } from "react-icons/fa";
import { GiCash, GiPayMoney, GiTwoCoins } from "react-icons/gi";

interface Props {
  result: string;
}

const SignalIndicator = ({ signal }: { signal: string }) => {
  const getSignalDetails = () => {
    switch (signal.toLowerCase()) {
      case 'strong buy':
        return { icon: <FaArrowUp className="text-2xl" />, color: 'bg-green-600', text: 'Strong Buy' };
      case 'buy':
        return { icon: <FaArrowUp className="text-xl" />, color: 'bg-green-500', text: 'Buy' };
      case 'strong sell':
        return { icon: <FaArrowDown className="text-2xl" />, color: 'bg-red-600', text: 'Strong Sell' };
      case 'sell':
        return { icon: <FaArrowDown className="text-xl" />, color: 'bg-red-500', text: 'Sell' };
      case 'wait':
        return { icon: <FaPause className="text-xl" />, color: 'bg-yellow-500', text: 'Wait' };
      default:
        return { icon: <GiTwoCoins className="text-xl" />, color: 'bg-gray-500', text: 'Neutral' };
    }
  };

  const { icon, color, text } = getSignalDetails();

  return (
    <div className={`${color} text-white px-3 py-2 rounded-lg flex items-center gap-2`}>
      {icon}
      <span className="font-bold">{text}</span>
    </div>
  );
};

const formatLine = (line: string) => {
  // Handle bullet points, bold text, and links
  const parts = line.split(/(\*\*[^*]+\*\*|\[.*?\]\(.*?\))/g);
  
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-yellow-400">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("[") && part.includes("](")) {
      const text = part.match(/\[(.*?)\]/)?.[1] || "";
      const url = part.match(/\((.*?)\)/)?.[1] || "";
      return (
        <a 
          key={i} 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          {text}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
};

export default function AIAnalysis({ result }: Props) {
  const [signal, setSignal] = useState("");
  const [riskLevel, setRiskLevel] = useState("medium");
  const [keyLevels, setKeyLevels] = useState<{support?: string, resistance?: string}>({});

  useEffect(() => {
    // Extract signal from analysis
    const signalMatch = result.match(/recommendation.*?(strong buy|buy|strong sell|sell|wait)/i);
    setSignal(signalMatch?.[1] || "");

    // Extract risk level
    const riskMatch = result.match(/risk.*?(low|medium|high)/i);
    setRiskLevel(riskMatch?.[1]?.toLowerCase() || "medium");

    // Extract support/resistance
    const supportMatch = result.match(/support.*?(\d+\.?\d*)/i);
    const resistanceMatch = result.match(/resistance.*?(\d+\.?\d*)/i);
    setKeyLevels({
      support: supportMatch?.[1],
      resistance: resistanceMatch?.[1]
    });
  }, [result]);

  const lines = result.split("\n").filter(line => line.trim());

  return (
    <div className="mt-4 p-4 bg-gray-800 rounded-xl border border-gray-700">
      {/* Signal Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-700">
        <div>
          <h2 className="text-xl font-bold text-white">AI Trading Signal</h2>
          <p className="text-gray-400 text-sm">Real-time market analysis</p>
        </div>
        {signal && <SignalIndicator signal={signal} />}
      </div>

      {/* Key Levels */}
      {(keyLevels.support || keyLevels.resistance) && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          {keyLevels.support && (
            <div className="bg-blue-900/30 p-3 rounded-lg border border-blue-800/50">
              <div className="flex items-center gap-2 text-blue-300">
                <GiCash />
                <span className="font-medium">Support</span>
              </div>
              <div className="text-xl font-bold mt-1">{keyLevels.support}</div>
            </div>
          )}
          {keyLevels.resistance && (
            <div className="bg-purple-900/30 p-3 rounded-lg border border-purple-800/50">
              <div className="flex items-center gap-2 text-purple-300">
                <GiPayMoney />
                <span className="font-medium">Resistance</span>
              </div>
              <div className="text-xl font-bold mt-1">{keyLevels.resistance}</div>
            </div>
          )}
        </div>
      )}

      {/* Risk Indicator */}
      <div className={`mb-6 p-3 rounded-lg flex items-start gap-3 ${
        riskLevel === 'high' ? 'bg-red-900/30 border-red-800/50' : 
        riskLevel === 'low' ? 'bg-green-900/30 border-green-800/50' : 
        'bg-yellow-900/30 border-yellow-800/50'
      } border`}>
        <FaExclamationTriangle className={`mt-1 ${
          riskLevel === 'high' ? 'text-red-400' : 
          riskLevel === 'low' ? 'text-green-400' : 
          'text-yellow-400'
        }`} />
        <div>
          <h3 className="font-semibold">Risk Assessment: <span className="capitalize">{riskLevel}</span></h3>
          <p className="text-sm opacity-80 mt-1">
            {riskLevel === 'high' ? 
              "High volatility - Consider smaller position sizes" : 
              riskLevel === 'low' ? 
              "Lower risk opportunity - Still use proper risk management" : 
              "Moderate risk - Standard position sizing recommended"}
          </p>
        </div>
      </div>

      {/* Analysis Content */}
      <div className="space-y-4 text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">
        {lines.map((line, index) => {
          // Skip empty lines or lines that were parsed as signals/levels
          if (!line.trim() || 
              line.toLowerCase().includes('recommendation') || 
              line.toLowerCase().includes('risk') ||
              line.toLowerCase().includes('support') ||
              line.toLowerCase().includes('resistance')) {
            return null;
          }

          // Section Headings
          if (line.startsWith("## ")) {
            return (
              <h3 key={index} className="font-bold text-lg mt-6 mb-3 text-white border-b border-gray-700 pb-2">
                {line.replace("## ", "")}
              </h3>
            );
          }

          // Subheadings
          if (line.startsWith("### ")) {
            return (
              <h4 key={index} className="font-semibold mt-4 mb-2 text-white">
                {line.replace("### ", "")}
              </h4>
            );
          }

          // Bullet points
          if (line.startsWith("- ")) {
            return (
              <div key={index} className="flex gap-2">
                <span>•</span>
                <p>{formatLine(line.replace("- ", ""))}</p>
              </div>
            );
          }

          // Numbered lists
          if (/^\d+\.\s/.test(line)) {
            return (
              <div key={index} className="flex gap-2">
                <span>{line.match(/^\d+/)}.</span>
                <p>{formatLine(line.replace(/^\d+\.\s/, ""))}</p>
              </div>
            );
          }

          // Default paragraph
          return (
            <p key={index} className="mb-3">
              {formatLine(line)}
            </p>
          );
        })}
      </div>
    </div>
  );
}