interface SwapButtonProps {
  onClick: () => void;
}

export function SwapButton({ onClick }: SwapButtonProps) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 flex items-center justify-center w-full sm:w-auto shadow-md hover:shadow-lg"
      title="Swap currencies"
      aria-label="Swap currencies"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
        />
      </svg>
    </button>
  );
}
