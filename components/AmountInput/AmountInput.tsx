interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  label?: string;
}

export function AmountInput({
  value,
  onChange,
  error,
  label,
}: AmountInputProps) {
  return (
    <div className="flex-1 w-full sm:w-auto">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter amount"
        step="1"
        min="0"
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none text-lg transition-colors ${
          error ? "border-red-300 focus:ring-red-500" : "border-gray-300"
        }`}
      />
    </div>
  );
}
