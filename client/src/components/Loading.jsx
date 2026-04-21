import React from 'react';

/**
 * Loading Component - Beautiful, customizable loading for entire app
 * 
 * Variants:
 * - 'full': Full screen with backdrop (default)
 * - 'inline': Inline in container
 * - 'overlay': Overlay on top of content
 * - 'button': Button loading state
 * - 'dots': Three dots bouncing
 * - 'sneaker': Custom sneaker animation
 */
export default function Loading({
  variant = 'full',
  size = 'md',
  text = 'Đang tải...',
  showText = true,
  backdrop = true,
  className = '',
}) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const spinnerSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  // Full screen loading with backdrop
  if (variant === 'full') {
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center ${backdrop ? 'bg-white/90 backdrop-blur-sm' : ''} ${className}`}>
        <div className="flex flex-col items-center gap-4">
          {/* Animated sneaker spinner */}
          <div className={`${sizeClasses[size]} relative`}>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 animate-pulse opacity-20"></div>
            <div className="relative w-full h-full flex items-center justify-center">
              <svg
                className={`${spinnerSizes[size]} text-orange-500 animate-bounce`}
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
              </svg>
            </div>
            {/* Rotating ring */}
            <div className="absolute inset-0 rounded-2xl border-2 border-orange-200 border-t-orange-500 animate-spin"></div>
          </div>
          {showText && (
            <div className="text-center">
              <p className="text-gray-700 font-semibold text-lg">{text}</p>
              <div className="flex gap-1 justify-center mt-2">
                <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-orange-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Inline loading for use inside containers
  if (variant === 'inline') {
    return (
      <div className={`flex flex-col items-center justify-center py-8 ${className}`}>
        <div className={`${sizeClasses[size]} relative`}>
          <div className="absolute inset-0 rounded-xl bg-orange-100 animate-pulse"></div>
          <div className="relative w-full h-full flex items-center justify-center">
            <svg className={`${spinnerSizes[size]} text-orange-500 animate-bounce`} viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
            </svg>
          </div>
          <div className="absolute inset-0 rounded-xl border-2 border-orange-200 border-t-orange-500 animate-spin"></div>
        </div>
        {showText && <p className="mt-3 text-gray-600 font-medium text-sm">{text}</p>}
      </div>
    );
  }

  // Overlay loading on top of existing content
  if (variant === 'overlay') {
    return (
      <div className={`absolute inset-0 z-40 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg ${className}`}>
        <div className="flex flex-col items-center">
          <div className={`${sizeClasses[size]} relative`}>
            <div className="absolute inset-0 rounded-xl bg-orange-100 animate-pulse"></div>
            <svg className={`${spinnerSizes[size]} relative z-10 text-orange-500 animate-bounce`} viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
            </svg>
            <div className="absolute inset-0 rounded-xl border-2 border-orange-200 border-t-orange-500 animate-spin"></div>
          </div>
          {showText && <p className="mt-2 text-gray-600 font-medium text-sm">{text}</p>}
        </div>
      </div>
    );
  }

  // Button loading state
  if (variant === 'button') {
    return (
      <span className={`inline-flex items-center gap-2 ${className}`}>
        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {text}
      </span>
    );
  }

  // Three dots bouncing
  if (variant === 'dots') {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
        <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
        <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
      </div>
    );
  }

  // Custom sneaker animation
  if (variant === 'sneaker') {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        <div className="relative">
          <svg className={`${sizeClasses[size]} text-orange-500 animate-bounce`} viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
          </svg>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-2 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
        {showText && <p className="mt-2 text-gray-600 font-medium text-sm">{text}</p>}
      </div>
    );
  }

  return null;
}

/**
 * Skeleton Components for content loading
 */
export const SkeletonCard = ({ count = 4, className = '' }) => {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-3 animate-pulse">
          {/* Image skeleton */}
          <div className="aspect-square bg-gray-200 rounded-xl mb-3"></div>
          {/* Brand skeleton */}
          <div className="h-3 bg-gray-200 rounded w-16 mb-2"></div>
          {/* Title skeleton */}
          <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
          {/* Price skeleton */}
          <div className="flex gap-2">
            <div className="h-5 bg-gray-200 rounded w-20"></div>
            <div className="h-3 bg-gray-200 rounded w-16 mt-1"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const SkeletonBanner = ({ className = '' }) => (
  <div className={`w-full h-48 md:h-64 lg:h-80 bg-gray-200 animate-pulse rounded-2xl ${className}`}></div>
);

export const SkeletonText = ({ lines = 3, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className="h-4 bg-gray-200 rounded animate-pulse"
        style={{ width: i === lines - 1 ? '60%' : '100%' }}
      ></div>
    ))}
  </div>
);

export const SkeletonProductDetail = () => (
  <div className="animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Image skeleton */}
      <div className="aspect-square bg-gray-200 rounded-3xl"></div>
      {/* Info skeleton */}
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 rounded w-24"></div>
        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
        <div className="h-10 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        <div className="h-12 bg-gray-200 rounded-xl w-full mt-6"></div>
      </div>
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 5, cols = 4 }) => (
  <div className="animate-pulse">
    {/* Header */}
    <div className="flex gap-4 mb-4 pb-4 border-b">
      {Array.from({ length: cols }).map((_, i) => (
        <div key={i} className="h-4 bg-gray-200 rounded flex-1" style={{ maxWidth: `${100 / cols}%` }}></div>
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIdx) => (
      <div key={rowIdx} className="flex gap-4 mb-3">
        {Array.from({ length: cols }).map((_, colIdx) => (
          <div key={colIdx} className="h-10 bg-gray-100 rounded flex-1" style={{ maxWidth: `${100 / cols}%` }}></div>
        ))}
      </div>
    ))}
  </div>
);

