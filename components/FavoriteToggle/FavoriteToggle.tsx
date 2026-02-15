interface FavoriteToggleProps {
  isFavorite: boolean;
  currencyCode: string;
  onToggle: () => void;
  className?: string;
}

export function FavoriteToggle({
  isFavorite,
  currencyCode,
  onToggle,
  className,
}: FavoriteToggleProps) {
  const label = isFavorite ? "Unfavorite" : "Favorite";

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={isFavorite}
      aria-label={`${label} ${currencyCode}`}
      title={`${label} ${currencyCode}`}
      className={`group inline-flex items-center justify-center border border-gray-300 rounded-lg text-gray-700 hover:border-gray-400 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className || ""}`}
    >
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill={isFavorite ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.95a1 1 0 00.95.69h4.148c.969 0 1.371 1.24.588 1.81l-3.357 2.44a1 1 0 00-.364 1.118l1.286 3.95c.3.921-.755 1.688-1.538 1.118l-3.357-2.44a1 1 0 00-1.175 0l-3.357 2.44c-.783.57-1.838-.197-1.538-1.118l1.286-3.95a1 1 0 00-.364-1.118L2.938 9.377c-.783-.57-.38-1.81.588-1.81h4.148a1 1 0 00.95-.69l1.286-3.95z"
        />
      </svg>
      <span className="sr-only group-focus-visible:not-sr-only group-focus-visible:absolute group-focus-visible:right-0 group-focus-visible:top-full group-focus-visible:mt-1 group-focus-visible:rounded-md group-focus-visible:bg-white group-focus-visible:px-2 group-focus-visible:py-1 group-focus-visible:text-xs group-focus-visible:text-gray-700 group-focus-visible:shadow">
        {label}
      </span>
    </button>
  );
}
