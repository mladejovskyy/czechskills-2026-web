import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import Button from "@/components/Button/Button";
import FaqContent from "@/components/Faq/FaqContent";
import { getFaqCategories } from "@/lib/api";
import type { Metadata } from "next";
import './faq.css';

export const metadata: Metadata = {
    title: "FAQ | Editorial Archive Car Rental",
    description: "Často kladené otázky k pronájmu historických a archivních vozidel. Vše o rezervaci, pojištění, cenách a podmínkách.",
};

export default async function FaqPage() {
    let categories: Awaited<ReturnType<typeof getFaqCategories>>['data'] = [];

    try {
        const res = await getFaqCategories();
        categories = res.data;
    } catch (e) {
        console.error("Failed to fetch FAQ:", e);
    }

    return (
        <>
            <Navbar subpage />

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
                        <FaqContent categories={categories} />
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
