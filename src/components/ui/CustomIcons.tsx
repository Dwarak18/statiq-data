import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

/**
 * Custom Bespoke Vector Icons crafted for STATIQDATA Enterprise Intelligence Platform
 */

export function InstitutionalEmblemIcon({ size = 24, className = '', ...props }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <rect x="3" y="3" width="26" height="26" rx="6" stroke="currentColor" strokeWidth="2" strokeOpacity="0.8"/>
      <path d="M9 22V16M14 22V11M19 22V14M24 22V8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="24" cy="8" r="2.5" fill="currentColor" />
    </svg>
  );
}

export function QuantumSeriesIcon({ size = 24, className = '', ...props }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path d="M4 26L11 17L17 21L28 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="11" cy="17" r="2" fill="currentColor"/>
      <circle cx="17" cy="21" r="2" fill="currentColor"/>
      <circle cx="28" cy="6" r="3" fill="currentColor"/>
      <path d="M4 28H28" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="2 2"/>
    </svg>
  );
}

export function SecAuditShieldIcon({ size = 24, className = '', ...props }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path d="M16 3L27 7V15C27 22.5 22 27.5 16 30C10 27.5 5 22.5 5 15V7L16 3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M11 16L14.5 19.5L21 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function HedgeFundAnalyticsIcon({ size = 24, className = '', ...props }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <rect x="7" y="10" width="5" height="12" rx="1.5" stroke="currentColor" strokeWidth="2"/>
      <path d="M9.5 5V10M9.5 22V27" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      
      <rect x="20" y="6" width="5" height="14" rx="1.5" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.2"/>
      <path d="M22.5 3V6M22.5 20V25" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function GlobalMacroSphereIcon({ size = 24, className = '', ...props }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="2"/>
      <ellipse cx="16" cy="16" rx="12" ry="5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2"/>
      <path d="M16 4V28" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}

export function GoldTierCrownIcon({ size = 24, className = '', ...props }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path d="M5 24L7 10L13 16L16 6L19 16L25 10L27 24H5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <rect x="5" y="25" width="22" height="3" rx="1" fill="currentColor"/>
    </svg>
  );
}
