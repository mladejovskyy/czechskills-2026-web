import { IconProps } from './types';

export default function IconDiamond({ width = 32, height = 32, color = '#92400E', className = '' }: IconProps) {
    return (
        <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M16 28L3 13l4-8h18l4 8L16 28z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
            <path d="M3 13h26M11 5l-4 8 9 15M21 5l4 8-9 15M16 5v8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
}
