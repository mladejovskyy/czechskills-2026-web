'use client';

import { type ReactNode } from 'react';
import type { FaqCategory } from '@/types/api';
import IconChevron from '@/components/Svg/IconChevron';
import IconSparkle from '@/components/Svg/IconSparkle';
import IconList from '@/components/Svg/IconList';
import IconShield from '@/components/Svg/IconShield';
import IconPin from '@/components/Svg/IconPin';
import IconWallet from '@/components/Svg/IconWallet';
import Link from 'next/link';

const categoryIcons: Record<string, (color: string) => ReactNode> = {
    'pronajem': (c) => <IconList color={c} />,
    'platby-a-kauce': (c) => <IconWallet color={c} />,
    'pojisteni': (c) => <IconShield color={c} />,
    'podminky': (c) => <IconPin color={c} />,
};

function getCategoryIcon(slug: string, color: string): ReactNode {
    return categoryIcons[slug]?.(color) ?? <IconSparkle color={color} />;
}

interface FaqContentProps {
    categories: FaqCategory[];
    activeCategorySlug: string;
    activeFaqSlug?: string;
}

export default function FaqContent({ categories, activeCategorySlug, activeFaqSlug }: FaqContentProps) {
    const activeCategory = categories.find(c => c.slug === activeCategorySlug);
    const activeItem = activeFaqSlug
        ? activeCategory?.items.find(i => i.slug === activeFaqSlug)
        : null;

    return (
        <div className="row">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-nav">
                    {categories.map((cat) => {
                        const isActive = cat.slug === activeCategorySlug;
                        return (
                            <Link
                                key={cat.id}
                                href={`/faq/${cat.slug}/`}
                                className={`sidebar-item ${isActive ? 'active' : ''}`}
                            >
                                {getCategoryIcon(cat.slug, isActive ? '#fff' : '#92400E')}
                                <span>{cat.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </aside>

            {/* Accordion */}
            <div className="items">
                {activeCategory?.items.map((item) => {
                    const isOpen = item.slug === activeFaqSlug;
                    const href = isOpen
                        ? `/faq/${activeCategorySlug}/`
                        : `/faq/${activeCategorySlug}/${item.slug}/`;

                    return (
                        <div key={item.id} className={`accordion ${isOpen ? 'open' : ''}`}>
                            <Link
                                href={href}
                                className="accordion-header"
                                aria-expanded={isOpen}
                                scroll={false}
                            >
                                <span>{item.question}</span>
                                <IconChevron
                                    width={20}
                                    height={20}
                                    color="#999"
                                    className={`accordion-icon ${isOpen ? 'open' : ''}`}
                                />
                            </Link>
                            {isOpen && (
                                <div className="accordion-body">
                                    <div dangerouslySetInnerHTML={{ __html: item.answer }} />
                                    <Link href="/vozy-pronajem/" className="accordion-link">
                                        Rezervovat auto nyní
                                        <span>→</span>
                                    </Link>
                                </div>
                            )}
                        </div>
                    );
                })}

                {activeCategory?.items.length === 0 && (
                    <p>V této kategorii zatím nejsou žádné otázky.</p>
                )}
            </div>
        </div>
    );
}
