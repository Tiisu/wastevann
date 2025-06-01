import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'dots' | 'pulse' | 'bounce';
  className?: string;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'default',
  className,
  text
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  if (variant === 'dots') {
    return (
      <div className={cn('flex flex-col items-center space-y-4', className)}>
        <div className="flex space-x-2">
          <div className={cn('bg-waste-600 rounded-full animate-bounce', sizeClasses[size])} style={{animationDelay: '0ms'}}></div>
          <div className={cn('bg-waste-500 rounded-full animate-bounce', sizeClasses[size])} style={{animationDelay: '150ms'}}></div>
          <div className={cn('bg-waste-400 rounded-full animate-bounce', sizeClasses[size])} style={{animationDelay: '300ms'}}></div>
        </div>
        {text && (
          <p className={cn('text-gray-600 dark:text-gray-400 font-medium', textSizeClasses[size])}>
            {text}
          </p>
        )}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn('flex flex-col items-center space-y-4', className)}>
        <div className={cn('bg-gradient-to-r from-waste-600 to-waste-400 rounded-full animate-pulse', sizeClasses[size])}></div>
        {text && (
          <p className={cn('text-gray-600 dark:text-gray-400 font-medium animate-pulse', textSizeClasses[size])}>
            {text}
          </p>
        )}
      </div>
    );
  }

  if (variant === 'bounce') {
    return (
      <div className={cn('flex flex-col items-center space-y-4', className)}>
        <div className={cn('bg-waste-600 rounded-full animate-bounce-slow', sizeClasses[size])}></div>
        {text && (
          <p className={cn('text-gray-600 dark:text-gray-400 font-medium', textSizeClasses[size])}>
            {text}
          </p>
        )}
      </div>
    );
  }

  // Default spinner
  return (
    <div className={cn('flex flex-col items-center space-y-4', className)}>
      <div className={cn('animate-spin rounded-full border-4 border-gray-200 dark:border-gray-700', sizeClasses[size])}>
        <div className="rounded-full border-4 border-transparent border-t-waste-600 border-r-waste-500"></div>
      </div>
      {text && (
        <p className={cn('text-gray-600 dark:text-gray-400 font-medium', textSizeClasses[size])}>
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
