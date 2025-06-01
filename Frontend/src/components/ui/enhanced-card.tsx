import React from 'react';
import { cn } from '@/lib/utils';

interface EnhancedCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'floating' | 'gradient';
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const EnhancedCard: React.FC<EnhancedCardProps> = ({
  children,
  className,
  variant = 'default',
  hover = true,
  padding = 'md',
  rounded = 'lg'
}) => {
  const baseClasses = 'transition-all duration-300';
  
  const variantClasses = {
    default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm',
    glass: 'glass-card',
    floating: 'floating-card bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg',
    gradient: 'bg-gradient-to-br from-waste-50 to-white dark:from-gray-800 dark:to-gray-900 border border-waste-200 dark:border-waste-700 shadow-lg'
  };

  const hoverClasses = hover ? 'hover:shadow-xl hover:scale-[1.02]' : '';

  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };

  const roundedClasses = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl'
  };

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        hoverClasses,
        paddingClasses[padding],
        roundedClasses[rounded],
        className
      )}
    >
      {children}
    </div>
  );
};

interface EnhancedCardHeaderProps {
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
}

const EnhancedCardHeader: React.FC<EnhancedCardHeaderProps> = ({
  children,
  className,
  icon,
  badge
}) => {
  return (
    <div className={cn('flex items-start justify-between mb-4', className)}>
      <div className="flex items-center space-x-3">
        {icon && (
          <div className="flex-shrink-0">
            {icon}
          </div>
        )}
        <div className="flex-1">
          {children}
        </div>
      </div>
      {badge && (
        <div className="flex-shrink-0">
          {badge}
        </div>
      )}
    </div>
  );
};

interface EnhancedCardContentProps {
  children: React.ReactNode;
  className?: string;
}

const EnhancedCardContent: React.FC<EnhancedCardContentProps> = ({
  children,
  className
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      {children}
    </div>
  );
};

interface EnhancedCardFooterProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right' | 'between';
}

const EnhancedCardFooter: React.FC<EnhancedCardFooterProps> = ({
  children,
  className,
  align = 'left'
}) => {
  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between'
  };

  return (
    <div className={cn('flex items-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700', alignClasses[align], className)}>
      {children}
    </div>
  );
};

export { EnhancedCard, EnhancedCardHeader, EnhancedCardContent, EnhancedCardFooter };
