import { IconProps } from './types';

export default function IconCurator({ width = 32, height = 32, color = '#92400E', className = '' }: IconProps) {
    return (
        <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <circle cx="16" cy="11" r="5" stroke={color} strokeWidth="2"/>
            <path d="M6 27c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke={color} strokeWidth="2" strokeLinecap="round"/>
            <path d="M21 8l2 2 4-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
}
