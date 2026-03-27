"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { scrollToTarget, goToAndScroll } from "@/utils/scroll";

interface ButtonProps {
    type?: 'primary' | 'secondary';
    children: React.ReactNode;
    scrollTo?: string;
    icon?: React.ComponentType<{ width?: number | string; height?: number | string; className?: string }>;
    iconUrl?: string;
    iconAlt?: string;
    iconWidth?: number;
    iconHeight?: number;
    iconLoading?: 'lazy' | 'eager';
    isArrow?: boolean;
    url?: string;
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
    htmlType?: 'button' | 'submit' | 'reset';
    ariaLabel?: string;
    target?: string;
    rel?: string;
    scrollToAfterRedirect?: string;
}

export default function Button({
    type = 'primary',
    scrollTo,
    icon: Icon,
    iconUrl,
    iconAlt,
    iconWidth,
    iconHeight,
    iconLoading = 'lazy',
    isArrow = true,
    url,
    className = '',
    children,
    onClick,
    disabled = false,
    htmlType = 'button',
    ariaLabel,
    target,
    rel,
    scrollToAfterRedirect
}: ButtonProps) {
    const router = useRouter();

    const buttonClasses = `btn btn-${type} ${className}`.trim();
    const arrowSrc = type === 'primary' ? '/images/icons/arrow-black.svg' : '/images/icons/arrow-white.svg';

    // Render icon - either as component or img
    const renderIcon = () => {
        if (Icon) {
            return <Icon width={iconWidth} height={iconHeight} className="btn-icon" />;
        }
        if (iconUrl) {
            return (
                <img
                    src={iconUrl}
                    alt={iconAlt}
                    width={iconWidth}
                    height={iconHeight}
                    loading={iconLoading}
                    draggable={false}
                    className="btn-icon"
                />
            );
        }
        return null;
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
        if (disabled) {
            e.preventDefault();
            return;
        }

        if (scrollToAfterRedirect && url) {
            e.preventDefault();
            goToAndScroll(url, scrollToAfterRedirect, router);
        } else if (scrollTo) {
            e.preventDefault();
            scrollToTarget(scrollTo, router);
        } else if (onClick) {
            onClick();
        }
    };

    // If it's an external link, render as anchor tag
    if (url) {
        const isExternal = url.startsWith('http') || url.startsWith('//') || url.startsWith('tel:') || url.startsWith('mailto:');

        if (isExternal) {
            return (
                <a
                    href={url}
                    className={buttonClasses}
                    onClick={handleClick}
                    target={target}
                    rel={rel}
                    aria-disabled={disabled}
                    aria-label={ariaLabel}
                >
                    {renderIcon()}
                    {children}
                    {isArrow && <img src={arrowSrc} alt="" className="btn-arrow" />}
                </a>
            );
        }

        // Internal link using Next.js Link
        return (
            <Link
                href={url}
                className={buttonClasses}
                onClick={handleClick}
                aria-disabled={disabled}
                aria-label={ariaLabel}
            >
                {renderIcon()}
                {children}
                {isArrow && <img src={arrowSrc} alt="" className="btn-arrow" />}
            </Link>
        );
    }

    // Regular button
    return (
        <button
            type={htmlType}
            className={buttonClasses}
            onClick={handleClick}
            disabled={disabled}
            aria-label={ariaLabel}
        >
            {renderIcon()}
            {children}
            {isArrow && <img src={arrowSrc} alt="" className="btn-arrow" />}
        </button>
    );
}