import FaqPageLayout from "@/components/Faq/FaqPageLayout";
import { getFaqCategories } from "@/lib/api";
import type { Metadata } from "next";
import '../../faq.css';

export async function generateMetadata({ params }: { params: Promise<{ categorySlug: string; faqSlug: string }> }): Promise<Metadata> {
    const { categorySlug, faqSlug } = await params;

    try {
        const res = await getFaqCategories();
        const category = res.data.find(c => c.slug === categorySlug);
        const item = category?.items.find(i => i.slug === faqSlug);
        if (item) {
            return {
                title: item.metaTitle || `${item.question} | Editorial Archive Car Rental`,
                description: item.metaDesc || item.answer.replace(/<[^>]*>/g, '').slice(0, 160),
            };
        }
    } catch {}

    return {
        title: "FAQ | Editorial Archive Car Rental",
    };
}

export default async function FaqItemPage({ params }: { params: Promise<{ categorySlug: string; faqSlug: string }> }) {
    const { categorySlug, faqSlug } = await params;

    let categories: Awaited<ReturnType<typeof getFaqCategories>>['data'] = [];

    try {
        const res = await getFaqCategories();
        categories = res.data;
    } catch (e) {
        console.error("Failed to fetch FAQ:", e);
    }

    return (
        <FaqPageLayout
            categories={categories}
            activeCategorySlug={categorySlug}
            activeFaqSlug={faqSlug}
        />
    );
}
