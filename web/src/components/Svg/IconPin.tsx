import { IconProps } from './types';

export default function IconPin({ width = 20, height = 20, color = '#92400E', className = '' }: IconProps) {
    return (
        <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M10 18s-6-5.34-6-9a6 6 0 1 1 12 0c0 3.66-6 9-6 9z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
            <circle cx="10" cy="9" r="2" stroke={color} strokeWidth="1.5"/>
        </svg>
    );
}
