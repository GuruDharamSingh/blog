"use client";
import { useState } from 'react';

interface CalloutProps {
  type?: 'info' | 'warning' | 'success' | 'error';
  title?: string;
  children: React.ReactNode;
  collapsible?: boolean;
}

export function Callout({ type = 'info', title, children, collapsible = false }: CalloutProps) {
  const [isExpanded, setIsExpanded] = useState(!collapsible);

  const styles = {
    info: 'border-blue-200 bg-blue-50 text-blue-900',
    warning: 'border-yellow-200 bg-yellow-50 text-yellow-900',
    success: 'border-green-200 bg-green-50 text-green-900',
    error: 'border-red-200 bg-red-50 text-red-900'
  };

  const icons = {
    info: '💡',
    warning: '⚠️',
    success: '✅',
    error: '❌'
  };

  return (
    <div className={`my-6 border rounded-lg p-4 ${styles[type]}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icons[type]}</span>
          {title && <h4 className="font-semibold">{title}</h4>}
        </div>
        {collapsible && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm underline hover:no-underline"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        )}
      </div>
      {isExpanded && (
        <div className="mt-3">
          {children}
        </div>
      )}
    </div>
  );
}
