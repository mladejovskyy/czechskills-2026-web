import { IconProps } from './types';

export default function IconWallet({ width = 20, height = 20, color = '#92400E', className = '' }: IconProps) {
    return (
        <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <rect x="2" y="4" width="16" height="13" rx="2" stroke={color} strokeWidth="1.5"/>
            <path d="M2 8h16" stroke={color} strokeWidth="1.5"/>
            <circle cx="14" cy="12.5" r="1.5" fill={color}/>
        </svg>
    );
}
