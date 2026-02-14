interface RefreshingRatesButtonProps {
  onClick: () => void;
  isRefreshing: boolean;
}

export function RefreshingRatesButton({
  onClick,
  isRefreshing,
}: RefreshingRatesButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isRefreshing}
      className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 flex items-center justify-center w-full sm:w-auto shadow-md hover:shadow-lg disabled:bg-blue-400 disabled:cursor-not-allowed disabled:shadow-md"
      title="Refresh rates"
      aria-label="Refresh rates"
    >
      {isRefreshing ? (
        <span
          className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"
          role="status"
          aria-label="Refreshing rates"
        />
      ) : (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.5 4.5v6h6M19.5 19.5v-6h-6M19 10.5a7.5 7.5 0 00-13.3-2.1M5 13.5a7.5 7.5 0 0013.3 2.1"
          />
        </svg>
      )}
    </button>
  );
}
