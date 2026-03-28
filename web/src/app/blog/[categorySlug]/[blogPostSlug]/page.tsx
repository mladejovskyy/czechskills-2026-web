import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import Button from "@/components/Button/Button";
import Image from "next/image";
import Link from "next/link";
import IconArrow from "@/components/Svg/IconArrow";
import { getBlogPost, getBlogPosts, getFaqCategories } from "@/lib/api";
import { formatDate, estimateReadTime, embedYouTubeVideos } from "@/lib/blog";
import type { BlogPost, FaqCategory } from "@/types/api";
import type { Metadata } from "next";
import '../../blog.css';

export async function generateMetadata({ params }: { params: Promise<{ categorySlug: string; blogPostSlug: string }> }): Promise<Metadata> {
    const { blogPostSlug } = await params;

    try {
        const res = await getBlogPost(blogPostSlug);
        const post = res.data;
        return {
            title: `${post.title} | Editorial Archive Car Rental`,
            description: post.excerpt || `Přečtěte si článek: ${post.title}`,
        };
    } catch {
        return { title: "Blog | Editorial Archive Car Rental" };
    }
}

export default async function BlogPostPage({ params }: { params: Promise<{ categorySlug: string; blogPostSlug: string }> }) {
    const { categorySlug, blogPostSlug } = await params;

    let post: BlogPost | null = null;
    let relatedPosts: BlogPost[] = [];
    let faqCategories: FaqCategory[] = [];

    try {
        const [res, faqRes] = await Promise.all([
            getBlogPost(blogPostSlug),
            getFaqCategories(),
        ]);
        post = res.data;
        faqCategories = faqRes.data;

        const relatedRes = await getBlogPosts({ category: post.category.slug, limit: "4" });
        relatedPosts = relatedRes.data.filter((p) => p.slug !== blogPostSlug).slice(0, 3);
    } catch (e) {
        console.error("Failed to fetch blog post:", e);
    }

    if (!post) {
        return (
            <>
                <Navbar subpage faqCategories={faqCategories} />
                <section className="blogHero">
                    <div className="container">
                        <h1>Článek nenalezen</h1>
                        <p>Požadovaný článek neexistuje nebo byl odstraněn.</p>
                        <Button type="primary" url="/blog/" ariaLabel="Zpět na blog" className="mt-6">
                            Zpět na blog
                        </Button>
                    </div>
                </section>
                <Footer />
            </>
        );
    }

    const readTime = estimateReadTime(post.content);

    return (
        <>
            <Navbar subpage faqCategories={faqCategories} />

            {/* ARTICLE HERO */}
            <section className="articleHero" id="articleHero">
                <div className="container">
                    <Link href={`/blog/${categorySlug}/`} className="back-link">
                        <IconArrow color="#B45309" width={14} height={14} /> {post.category.name}
                    </Link>
                    <div className="meta">
                        <Link href={`/blog/${categorySlug}/`} className="category">{post.category.name}</Link>
                        <span className="separator">·</span>
                        <span>{formatDate(post.publishedAt)}</span>
                        <span className="separator">·</span>
                        <span>{readTime} min čtení</span>
                    </div>
                    <h1>{post.title}</h1>
                    {post.excerpt && <p className="excerpt">{post.excerpt}</p>}
                    {post.author.name && (
                        <div className="author">
                            <span>Autor: <strong>{post.author.name}</strong></span>
                        </div>
                    )}
                </div>
            </section>

            {/* COVER IMAGE */}
            {post.coverImage && (
                <section className="articleCover">
                    <div className="container">
                        <div className="cover-wrapper">
                            <Image
                                src={post.coverImage.url}
                                alt={post.coverImage.alt}
                                fill
                                sizes="(max-width: 768px) 100vw, 900px"
                                priority
                            />
                        </div>
                    </div>
                </section>
            )}

            {/* ARTICLE BODY + SIDEBAR */}
            <section className="articleLayout" id="articleBody">
                <div className="container">
                    <div className="articleGrid">
                        <div className="articleMain">
                            <div
                                className="prose"
                                dangerouslySetInnerHTML={{ __html: embedYouTubeVideos(post.content) }}
                            />

                            {post.tags.length > 0 && (
                                <div className="tags">
                                    {post.tags.map((tag) => (
                                        <span key={tag.id} className="tag-pill">
                                            {tag.name}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* ARTICLE FAQ */}
                            {post.faqs.length > 0 && (
                                <div className="articleFaq">
                                    <h2>Často kladené otázky</h2>
                                    <div className="faq-list">
                                        {post.faqs
                                            .sort((a, b) => a.sortOrder - b.sortOrder)
                                            .map((faq) => (
                                                <details key={faq.id} className="faq-item">
                                                    <summary>{faq.question}</summary>
                                                    <div
                                                        className="faq-answer"
                                                        dangerouslySetInnerHTML={{ __html: faq.answer }}
                                                    />
                                                </details>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* SIDEBAR */}
                        {relatedPosts.length > 0 && (
                            <aside className="articleSidebar">
                                <div className="sidebar-heading">
                                    <h4>Další články</h4>
                                    <Link href={`/blog/${categorySlug}/`}>
                                        Vše <IconArrow color="#B45309" width={12} height={12} />
                                    </Link>
                                </div>
                                <div className="sidebar-posts">
                                    {relatedPosts.map((p) => (
                                        <Link
                                            key={p.id}
                                            href={`/blog/${p.category.slug}/${p.slug}/`}
                                            className="sidebar-post"
                                        >
                                            <div className="sidebar-post-image">
                                                {p.coverImage ? (
                                                    <Image
                                                        src={p.coverImage.url}
                                                        alt={p.coverImage.alt}
                                                        fill
                                                        sizes="280px"
                                                    />
                                                ) : (
                                                    <div className="placeholder">{p.title}</div>
                                                )}
                                            </div>
                                            <span className="sidebar-post-category">{p.category.name}</span>
                                            <h5>{p.title}</h5>
                                        </Link>
                                    ))}
                                </div>
                            </aside>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
