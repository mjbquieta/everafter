'use client';

interface PhotoPlaceholderProps {
  className?: string;
  onClick?: () => void;
}

export function PhotoPlaceholder({ className = '', onClick }: PhotoPlaceholderProps) {
  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200 ${className} ${onClick ? 'cursor-pointer hover:from-stone-200 hover:to-stone-300 transition-colors' : ''}`}
      onClick={onClick}
    >
      <svg
        className="w-16 h-16 md:w-24 md:h-24 text-stone-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    </div>
  );
}
