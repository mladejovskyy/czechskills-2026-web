import { IconProps } from './types';

export default function IconArrow({ width = 20, height = 20, color = '#111', className = '' }: IconProps) {
    return (
        <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M4.167 10h11.666M10 4.167L15.833 10 10 15.833" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
}
