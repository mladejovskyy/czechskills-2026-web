import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import BlogCard from "@/components/Blog/BlogCard";
import Link from "next/link";
import { getBlogPosts, getCategories, getTags, getFaqCategories } from "@/lib/api";
import type { BlogPost, Category, Tag, FaqCategory } from "@/types/api";
import type { Metadata } from "next";
import './blog.css';

export const metadata: Metadata = {
    title: "Blog | Editorial Archive Car Rental",
    description: "Články o automobilové kultuře, historii a životním stylu. Inspirujte se příběhy z našeho archivu.",
};

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ page?: string; tag?: string }> }) {
    const { page, tag } = await searchParams;

    let posts: BlogPost[] = [];
    let categories: Category[] = [];
    let tags: Tag[] = [];
    let faqCategories: FaqCategory[] = [];
    let totalPages = 1;

    try {
        const [blogRes, catRes, tagsRes, faqRes] = await Promise.all([
            getBlogPosts({ tag, page, limit: "9" }),
            getCategories(),
            getTags(),
            getFaqCategories(),
        ]);
        posts = blogRes.data;
        totalPages = blogRes.pagination.totalPages;
        categories = catRes.data;
        tags = tagsRes.data;
        faqCategories = faqRes.data;
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
                        Život v <span className="highlight">pohybu.</span>
                    </h1>
                    <p>
                        Příběhy z cest, automobilová kultura a svět za volantem.
                    </p>
                </div>
            </section>

            {/* FILTERS + POSTS */}
            <section className="blogListing" id="blogListing">
                <div className="container">
                    {categories.length > 0 && (
                        <div className="filters">
                            <Link href="/blog/" className={!tag ? "active" : ""}>Vše</Link>
                            {categories.map((cat) => (
                                <Link
                                    key={cat.id}
                                    href={`/blog/${cat.slug}/`}
                                >
                                    {cat.name}
                                </Link>
                            ))}
                        </div>
                    )}

                    {tags.length > 0 && (
                        <div className="tag-filters">
                            {tags.map((t) => (
                                <Link
                                    key={t.id}
                                    href={`/blog/?tag=${t.slug}`}
                                    className={tag === t.slug ? "active" : ""}
                                >
                                    {t.name}
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
                        <p className="empty">Žádné články k zobrazení.</p>
                    )}

                    {totalPages > 1 && (
                        <div className="pagination">
                            {currentPage > 1 && (
                                <Link
                                    href={`/blog/?${tag ? `tag=${tag}&` : ""}page=${currentPage - 1}`}
                                    className="pagination-link"
                                >
                                    Předchozí
                                </Link>
                            )}
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                <Link
                                    key={p}
                                    href={`/blog/?${tag ? `tag=${tag}&` : ""}page=${p}`}
                                    className={`pagination-link ${p === currentPage ? "active" : ""}`}
                                >
                                    {p}
                                </Link>
                            ))}
                            {currentPage < totalPages && (
                                <Link
                                    href={`/blog/?${tag ? `tag=${tag}&` : ""}page=${currentPage + 1}`}
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
