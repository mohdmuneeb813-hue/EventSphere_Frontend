import React from 'react';

export const Loader = ({ text = 'Loading...', size = 'default' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    default: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <div
        className={`${sizeClasses[size] || sizeClasses.default} border-terracotta-600 border-t-transparent rounded-full animate-spin`}
      />
      {text && <p className="text-sm font-medium text-slate-500 animate-pulse">{text}</p>}
    </div>
  );
};

export const TableSkeleton = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="w-full animate-pulse space-y-3">
      <div className="h-10 bg-slate-200 rounded-lg w-full"></div>
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex space-x-3">
          {[...Array(cols)].map((_, j) => (
            <div key={j} className="h-8 bg-slate-100 rounded flex-1"></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Loader;
