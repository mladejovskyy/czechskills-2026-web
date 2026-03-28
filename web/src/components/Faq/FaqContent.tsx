'use client';

import { useState, type ReactNode } from 'react';
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
}

export default function FaqContent({ categories }: FaqContentProps) {
    const [activeCategoryId, setActiveCategoryId] = useState(categories[0]?.id ?? '');
    const [openItemId, setOpenItemId] = useState<string | null>(
        categories[0]?.items[0]?.id ?? null
    );

    const activeCategory = categories.find(c => c.id === activeCategoryId);

    const toggleItem = (id: string) => {
        setOpenItemId(prev => prev === id ? null : id);
    };

    const switchCategory = (id: string) => {
        setActiveCategoryId(id);
        const cat = categories.find(c => c.id === id);
        setOpenItemId(cat?.items[0]?.id ?? null);
    };

    return (
        <div className="row">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-nav">
                    {categories.map((cat) => {
                        const isActive = cat.id === activeCategoryId;
                        return (
                            <button
                                key={cat.id}
                                className={`sidebar-item ${isActive ? 'active' : ''}`}
                                onClick={() => switchCategory(cat.id)}
                            >
                                {getCategoryIcon(cat.slug, isActive ? '#fff' : '#92400E')}
                                <span>{cat.name}</span>
                            </button>
                        );
                    })}
                </div>
            </aside>

            {/* Accordion */}
            <div className="items">
                {activeCategory?.items.map((item) => {
                    const isOpen = openItemId === item.id;
                    return (
                        <div key={item.id} className={`accordion ${isOpen ? 'open' : ''}`}>
                            <button
                                className="accordion-header"
                                onClick={() => toggleItem(item.id)}
                                aria-expanded={isOpen}
                            >
                                <span>{item.question}</span>
                                <IconChevron
                                    width={20}
                                    height={20}
                                    color="#999"
                                    className={`accordion-icon ${isOpen ? 'open' : ''}`}
                                />
                            </button>
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
