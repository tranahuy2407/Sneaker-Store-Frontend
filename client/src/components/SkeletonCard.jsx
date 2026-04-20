import React from 'react';

const SkeletonCard = ({ count = 5 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="text-center group">
          {/* Image skeleton */}
          <div className="relative mb-3 overflow-hidden rounded-md">
            <div className="aspect-square bg-gray-200 animate-pulse rounded-md"></div>
          </div>

          {/* Title skeleton */}
          <div className="h-10 mt-2 space-y-2">
            <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2 mx-auto"></div>
          </div>

          {/* Price skeleton */}
          <div className="mt-2 space-y-1">
            <div className="h-5 bg-gray-200 animate-pulse rounded w-20 mx-auto"></div>
            <div className="h-3 bg-gray-200 animate-pulse rounded w-16 mx-auto"></div>
          </div>
        </div>
      ))}
    </>
  );
};

export const SkeletonBanner = () => (
  <div className="w-full mb-10 overflow-hidden rounded-xl shadow-lg">
    <div className="w-full h-48 md:h-64 bg-gray-200 animate-pulse"></div>
  </div>
);

export const SkeletonTitle = () => (
  <div className="mb-10 text-center">
    <div className="h-8 bg-gray-200 animate-pulse rounded w-48 mx-auto"></div>
    <div className="mt-2 h-1 bg-gray-200 animate-pulse rounded w-16 mx-auto"></div>
  </div>
);

export default SkeletonCard;
