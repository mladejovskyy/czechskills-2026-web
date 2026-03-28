import { IconProps } from './types';

export default function IconPrice({ width = 32, height = 32, color = '#92400E', className = '' }: IconProps) {
    return (
        <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M4 17.172V6a2 2 0 0 1 2-2h11.172a2 2 0 0 1 1.414.586l9.828 9.828a2 2 0 0 1 0 2.828l-9.172 9.172a2 2 0 0 1-2.828 0L4.586 18.586A2 2 0 0 1 4 17.172z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
            <circle cx="11" cy="11" r="2" fill={color}/>
        </svg>
    );
}
