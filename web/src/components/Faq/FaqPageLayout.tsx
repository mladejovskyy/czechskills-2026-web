import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import Button from "@/components/Button/Button";
import FaqContent from "@/components/Faq/FaqContent";
import JsonLd from "@/components/JsonLd";
import type { FaqCategory } from "@/types/api";

interface FaqPageLayoutProps {
    categories: FaqCategory[];
    activeCategorySlug: string;
    activeFaqSlug?: string;
}

export default function FaqPageLayout({ categories, activeCategorySlug, activeFaqSlug }: FaqPageLayoutProps) {
    const activeCategory = categories.find(c => c.slug === activeCategorySlug);

    const faqPageLd = activeCategory && activeCategory.items.length > 0 ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        name: activeCategory.name,
        mainEntity: activeCategory.items.map(item => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: item.answer.replace(/<[^>]*>/g, ''),
            },
            url: `https://kellycars.cz/faq/${activeCategorySlug}/${item.slug}/`,
        })),
    } : null;

    const breadcrumbLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Domů",
                item: "https://kellycars.cz/",
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "FAQ",
                item: "https://kellycars.cz/faq/",
            },
            ...(activeCategory ? [{
                "@type": "ListItem",
                position: 3,
                name: activeCategory.name,
                item: `https://kellycars.cz/faq/${activeCategorySlug}/`,
            }] : []),
            ...(activeFaqSlug && activeCategory ? (() => {
                const item = activeCategory.items.find(i => i.slug === activeFaqSlug);
                return item ? [{
                    "@type": "ListItem",
                    position: 4,
                    name: item.question,
                    item: `https://kellycars.cz/faq/${activeCategorySlug}/${activeFaqSlug}/`,
                }] : [];
            })() : []),
        ],
    };

    return (
        <>
            {faqPageLd && <JsonLd data={faqPageLd} />}
            <JsonLd data={breadcrumbLd} />

            <Navbar subpage faqCategories={categories} />

            {/* HERO */}
            <section className="faqHero" id="faqHero">
                <div className="container">
                    <span className="tag">Centrum nápovědy</span>
                    <h1>
                        Často kladené otázky k naší{' '}
                        <span className="highlight">sbírce.</span>
                    </h1>
                </div>
            </section>

            {/* FAQ CONTENT */}
            <section className="faqContent" id="faqContent">
                <div className="container">
                    {categories.length > 0 ? (
                        <FaqContent
                            categories={categories}
                            activeCategorySlug={activeCategorySlug}
                            activeFaqSlug={activeFaqSlug}
                        />
                    ) : (
                        <p>FAQ se nepodařilo načíst.</p>
                    )}
                </div>
            </section>

            {/* CTA */}
            <section className="faqCta" id="faqCta">
                <div className="container">
                    <div className="row">
                        <div className="content">
                            <h2>Nenašli jste svou odpověď? Spojte se s námi.</h2>
                            <p>
                                Náš tým kurátorů je připraven vám pomoci s výběrem dokonalého vozu
                                pro vaši příští cestu.
                            </p>
                            <div className="btns-row">
                                <Button type="primary" url="/vozy-pronajem/" ariaLabel="Rezervovat auto">
                                    Rezervovat auto
                                </Button>
                                <Button type="secondary" url="/kontakt/" isArrow={false} ariaLabel="Kontaktovat podporu">
                                    Kontaktovat podporu
                                </Button>
                            </div>
                        </div>
                        <div className="image">
                            <div className="placeholder">car image</div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
