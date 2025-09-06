"use client";
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Copy, Check } from 'lucide-react';
import { Button } from './Button';

interface CodeBlockProps {
  children: string;
  language?: string;
  title?: string;
  showCopy?: boolean;
  className?: string;
}

export function CodeBlock({ 
  children, 
  language = 'text', 
  title, 
  showCopy = true,
  className 
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={cn(
      'relative rounded-lg border bg-muted/50 overflow-hidden',
      className
    )}>
      {/* Header */}
      {(title || showCopy) && (
        <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/30">
          <div className="flex items-center gap-2">
            {title && (
              <span className="text-sm font-medium text-muted-foreground">
                {title}
              </span>
            )}
            {language && (
              <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                {language}
              </span>
            )}
          </div>
          {showCopy && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-8 w-8 p-0"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      )}

      {/* Code Content */}
      <div className="overflow-x-auto">
        <pre className={cn(
          'p-4 text-sm leading-relaxed',
          'scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent'
        )}>
          <code className={`language-${language}`}>
            {children}
          </code>
        </pre>
      </div>
    </div>
  );
}
