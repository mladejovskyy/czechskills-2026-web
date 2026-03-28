import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import BlogCard from "@/components/Blog/BlogCard";
import Link from "next/link";
import { getBlogPosts, getCategories, getFaqCategories } from "@/lib/api";
import type { BlogPost, Category, FaqCategory } from "@/types/api";
import type { Metadata } from "next";
import '../blog.css';

export async function generateMetadata({ params }: { params: Promise<{ categorySlug: string }> }): Promise<Metadata> {
    const { categorySlug } = await params;

    try {
        const res = await getCategories();
        const cat = res.data.find(c => c.slug === categorySlug);
        if (cat) {
            return {
                title: cat.metaTitle || `${cat.name} – Blog | Editorial Archive Car Rental`,
                description: cat.metaDesc || `Články v kategorii ${cat.name}.`,
            };
        }
    } catch {}

    return { title: "Blog | Editorial Archive Car Rental" };
}

export default async function BlogCategoryPage({ params, searchParams }: {
    params: Promise<{ categorySlug: string }>;
    searchParams: Promise<{ page?: string }>;
}) {
    const { categorySlug } = await params;
    const { page } = await searchParams;

    let posts: BlogPost[] = [];
    let categories: Category[] = [];
    let faqCategories: FaqCategory[] = [];
    let totalPages = 1;
    let activeCategoryName = "";

    try {
        const [blogRes, catRes, faqRes] = await Promise.all([
            getBlogPosts({ category: categorySlug, page, limit: "9" }),
            getCategories(),
            getFaqCategories(),
        ]);
        posts = blogRes.data;
        totalPages = blogRes.pagination.totalPages;
        categories = catRes.data;
        faqCategories = faqRes.data;
        activeCategoryName = categories.find(c => c.slug === categorySlug)?.name || "";
    } catch (e) {
        console.error("Failed to fetch blog data:", e);
    }

    const currentPage = Number(page) || 1;

    return (
        <>
            <Navbar subpage faqCategories={faqCategories} />

            {/* HERO */}
            <section className="blogHero" id="blogHero">
                <div className="container">
                    <span className="tag">Blog</span>
                    <h1>
                        {activeCategoryName || "Kategorie"}
                    </h1>
                </div>
            </section>

            {/* FILTERS + POSTS */}
            <section className="blogListing" id="blogListing">
                <div className="container">
                    {categories.length > 0 && (
                        <div className="filters">
                            <Link href="/blog/">Vše</Link>
                            {categories.map((cat) => (
                                <Link
                                    key={cat.id}
                                    href={`/blog/${cat.slug}/`}
                                    className={categorySlug === cat.slug ? "active" : ""}
                                >
                                    {cat.name}
                                </Link>
                            ))}
                        </div>
                    )}

                    {posts.length > 0 ? (
                        <div className="row">
                            {posts.map((post) => (
                                <BlogCard key={post.id} post={post} />
                            ))}
                        </div>
                    ) : (
                        <p className="empty">Žádné články v této kategorii.</p>
                    )}

                    {totalPages > 1 && (
                        <div className="pagination">
                            {currentPage > 1 && (
                                <Link
                                    href={`/blog/${categorySlug}/?page=${currentPage - 1}`}
                                    className="pagination-link"
                                >
                                    Předchozí
                                </Link>
                            )}
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                <Link
                                    key={p}
                                    href={`/blog/${categorySlug}/?page=${p}`}
                                    className={`pagination-link ${p === currentPage ? "active" : ""}`}
                                >
                                    {p}
                                </Link>
                            ))}
                            {currentPage < totalPages && (
                                <Link
                                    href={`/blog/${categorySlug}/?page=${currentPage + 1}`}
                                    className="pagination-link"
                                >
                                    Další
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </>
    );
}
