import { redirect } from "next/navigation";
import { getFaqCategories } from "@/lib/api";

export default async function FaqIndexPage() {
    let firstSlug: string | null = null;

    try {
        const res = await getFaqCategories();
        if (res.data.length > 0) {
            firstSlug = res.data[0].slug;
        }
    } catch (e) {
        console.error("Failed to fetch FAQ categories:", e);
    }

    redirect(firstSlug ? `/faq/${firstSlug}/` : "/");
}
