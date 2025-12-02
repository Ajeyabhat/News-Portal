import React from 'react';

const Skeleton = ({ type = 'card', count = 1 }) => {
  const skeletons = Array(count).fill(0);

  // Reusable skeleton pulse component
  const SkeletonPulse = ({ className = '' }) => (
    <div className={`bg-gray-200 dark:bg-gray-700 rounded animate-pulse ${className}`} />
  );

  if (type === 'card') {
    return (
      <>
        {skeletons.map((_, index) => (
          <div key={index} className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-md">
            {/* Image */}
            <SkeletonPulse className="h-48 w-full" />
            
            {/* Content */}
            <div className="p-5 space-y-3">
              <SkeletonPulse className="h-6 w-24" />
              <SkeletonPulse className="h-5 w-full" />
              <SkeletonPulse className="h-4 w-3/4" />
              <div className="pt-2 space-y-2">
                <SkeletonPulse className="h-3 w-full" />
                <SkeletonPulse className="h-3 w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </>
    );
  }

  if (type === 'featured') {
    return (
      <div className="h-96 rounded-2xl overflow-hidden shadow-2xl">
        {/* Background Image */}
        <SkeletonPulse className="w-full h-full" />
        
        {/* Overlay Content (positioned absolutely in actual use) */}
        <div className="absolute inset-0 p-8 space-y-4 hidden">
          <SkeletonPulse className="h-8 w-32" />
          <SkeletonPulse className="h-12 w-3/4" />
          <SkeletonPulse className="h-6 w-2/3" />
          <div className="flex gap-4 pt-4">
            <SkeletonPulse className="h-4 w-20" />
            <SkeletonPulse className="h-4 w-20" />
            <SkeletonPulse className="h-4 w-20" />
          </div>
        </div>
      </div>
    );
  }

  if (type === 'article') {
    return (
      <div className="space-y-4">
        <SkeletonPulse className="h-10 w-full" />
        <SkeletonPulse className="h-8 w-2/3" />
        <div className="flex gap-4 py-2">
          <SkeletonPulse className="h-3 w-24" />
          <SkeletonPulse className="h-3 w-24" />
          <SkeletonPulse className="h-3 w-24" />
        </div>
        <SkeletonPulse className="h-96 w-full" />
        <div className="space-y-2">
          <SkeletonPulse className="h-4 w-full" />
          <SkeletonPulse className="h-4 w-full" />
          <SkeletonPulse className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  // Default text skeleton
  return <SkeletonPulse className="h-4 w-full" />;
};

export default Skeleton;
