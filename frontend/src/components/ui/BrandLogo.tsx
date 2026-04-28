
interface BrandLogoProps {
  className?: string;
  size?: number;
}

export default function BrandLogo({ className = "", size = 24 }: BrandLogoProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M8 21V5a2 2 0 0 1 2-2h4a6 6 0 0 1 0 12H8" />
      <circle cx="13" cy="9" r="1.5" stroke="none" fill="currentColor" />
    </svg>
  );
}
