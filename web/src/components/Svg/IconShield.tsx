import { IconProps } from './types';

export default function IconShield({ width = 20, height = 20, color = '#92400E', className = '' }: IconProps) {
    return (
        <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M10 1.5L3 4.5v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9v-5L10 1.5z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M7 10l2 2 4-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
}
