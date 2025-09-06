"use client";
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, Info, AlertTriangle, Lightbulb, Zap, ChevronDown } from 'lucide-react';

interface CalloutProps {
  type?: 'info' | 'warning' | 'success' | 'error' | 'tip' | 'note';
  title?: string;
  children: React.ReactNode;
  collapsible?: boolean;
  className?: string;
}

const calloutConfig = {
  info: {
    icon: Info,
    className: 'border-blue-200 bg-blue-50 text-blue-900',
    iconClassName: 'text-blue-600',
    titleClassName: 'text-blue-800'
  },
  warning: {
    icon: AlertTriangle,
    className: 'border-yellow-200 bg-yellow-50 text-yellow-900',
    iconClassName: 'text-yellow-600',
    titleClassName: 'text-yellow-800'
  },
  success: {
    icon: CheckCircle,
    className: 'border-green-200 bg-green-50 text-green-900',
    iconClassName: 'text-green-600',
    titleClassName: 'text-green-800'
  },
  error: {
    icon: AlertCircle,
    className: 'border-red-200 bg-red-50 text-red-900',
    iconClassName: 'text-red-600',
    titleClassName: 'text-red-800'
  },
  tip: {
    icon: Lightbulb,
    className: 'border-purple-200 bg-purple-50 text-purple-900',
    iconClassName: 'text-purple-600',
    titleClassName: 'text-purple-800'
  },
  note: {
    icon: Zap,
    className: 'border-indigo-200 bg-indigo-50 text-indigo-900',
    iconClassName: 'text-indigo-600',
    titleClassName: 'text-indigo-800'
  }
};

export function Callout({ type = 'info', title, children, collapsible = false, className }: CalloutProps) {
  const [isExpanded, setIsExpanded] = useState(!collapsible);
  const config = calloutConfig[type];
  const Icon = config.icon;

  return (
    <div className={cn(
      'my-6 border rounded-lg p-4 transition-all duration-200',
      config.className,
      className
    )}>
      <div className="flex items-start">
        <div className={cn('flex-shrink-0 mr-3 mt-0.5', config.iconClassName)}>
          <Icon size={20} />
        </div>
        <div className="flex-1 min-w-0">
          {(title || collapsible) && (
            <div className="flex items-center justify-between mb-2">
              <h3 className={cn('font-semibold text-sm', config.titleClassName)}>
                {title || type.charAt(0).toUpperCase() + type.slice(1)}
              </h3>
              {collapsible && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className={cn(
                    'p-1 rounded hover:bg-black/5 transition-colors',
                    config.iconClassName
                  )}
                  aria-expanded={isExpanded}
                  aria-label={isExpanded ? 'Collapse' : 'Expand'}
                >
                  <ChevronDown 
                    size={16} 
                    className={cn(
                      'transition-transform duration-200',
                      isExpanded ? 'rotate-180' : ''
                    )}
                  />
                </button>
              )}
            </div>
          )}
          {isExpanded && (
            <div className="prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
