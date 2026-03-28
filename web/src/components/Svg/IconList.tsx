import { IconProps } from './types';

export default function IconList({ width = 20, height = 20, color = '#92400E', className = '' }: IconProps) {
    return (
        <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <rect x="2" y="3" width="16" height="14" rx="2" stroke={color} strokeWidth="1.5"/>
            <path d="M6 7h8M6 10h8M6 13h5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
    );
}
