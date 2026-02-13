import { ConversionResult } from "@/types";
import { formatAmount } from "@/utils/currency/currency";

interface ConversionHistoryProps {
  history: ConversionResult[];
  showHistory: boolean;
  onToggle: () => void;
  onClear: () => void;
  onLoadConversion: (conversion: ConversionResult) => void;
}

export function ConversionHistory({
  history,
  showHistory,
  onToggle,
  onClear,
  onLoadConversion,
}: ConversionHistoryProps) {
  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Conversion History</h2>
        <div className="flex gap-2">
          {history.length > 0 && (
            <button
              onClick={onClear}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 text-sm"
            >
              Clear History
            </button>
          )}
          <button
            onClick={onToggle}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 text-sm"
          >
            {showHistory ? "Hide" : "Show"} ({history.length})
          </button>
        </div>
      </div>

      {showHistory && (
        <div className="space-y-2">
          {history.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No conversion history yet
            </p>
          ) : (
            history.map((conversion, index) => (
              <div
                key={index}
                onClick={() => onLoadConversion(conversion)}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">
                      {formatAmount(conversion.amount)} {conversion.from} →{" "}
                      {formatAmount(conversion.result)} {conversion.to}
                    </div>
                    <div className="text-sm text-gray-600">
                      Rate: 1 {conversion.from} ={" "}
                      {formatAmount(conversion.rate, 4)} {conversion.to}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(conversion.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
