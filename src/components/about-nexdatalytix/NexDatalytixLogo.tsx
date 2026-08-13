import React from 'react';

interface NexDatalytixLogoProps {
  className?: string;
  variant?: 'full' | 'mark-only' | 'wordmark-only';
  theme?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
  width?: string;
}

export function NexDatalytixLogo({
  className = '',
  variant = 'full',
  theme = 'dark',
  size = 'md',
  width,
}: NexDatalytixLogoProps) {
  const defaultClass =
    size === 'sm' ? 'w-28 sm:w-32' : size === 'lg' ? 'w-36 sm:w-44' : 'w-32 sm:w-36';

  const styleProps = width
    ? { width, mixBlendMode: (theme === 'light' ? 'normal' : 'multiply') as any }
    : { mixBlendMode: (theme === 'light' ? 'normal' : 'multiply') as any };

  if (variant === 'mark-only') {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <img
          src="/logo.jpeg"
          alt="NexDatalytix Emblem"
          className="h-10 w-10 object-contain mix-blend-multiply rounded-full"
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center ${className}`}>
      <img
        src="/logo_header.jpeg"
        alt="NexDatalytix Private Limited"
        className={`h-auto object-contain mix-blend-multiply ${!width ? defaultClass : ''}`}
        style={styleProps}
      />
    </div>
  );
}
