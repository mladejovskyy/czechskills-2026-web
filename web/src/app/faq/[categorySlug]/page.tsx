import FaqPageLayout from "@/components/Faq/FaqPageLayout";
import { getFaqCategories } from "@/lib/api";
import type { Metadata } from "next";
import '../faq.css';

export async function generateMetadata({ params }: { params: Promise<{ categorySlug: string }> }): Promise<Metadata> {
    const { categorySlug } = await params;

    try {
        const res = await getFaqCategories();
        const category = res.data.find(c => c.slug === categorySlug);
        if (category) {
            return {
                title: category.metaTitle || `${category.name} – FAQ | Editorial Archive Car Rental`,
                description: category.metaDesc || category.description || `Často kladené otázky: ${category.name}`,
            };
        }
    } catch {}

    return {
        title: "FAQ | Editorial Archive Car Rental",
    };
}

export default async function FaqCategoryPage({ params }: { params: Promise<{ categorySlug: string }> }) {
    const { categorySlug } = await params;

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
        />
    );
}
