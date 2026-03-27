'use client'
import './Footer.css';
import Link from "next/link";
import {useRouter} from 'next/navigation';

interface FooterProps {
    marginTop?: number;
}

export default function Footer({marginTop = 0}: FooterProps) {
    const router = useRouter();

    const scrollToTarget = async (sectionId: string) => {
        const currentPath = window.location.pathname;
        const offset = window.innerWidth >= 768 ? 50 : 60;

        if (currentPath === '/') {
            const section = document.getElementById(sectionId);
            if (section) {
                const topPosition = section.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({top: topPosition, behavior: 'smooth'});
            }
        } else {
            await router.push('/');
            setTimeout(() => {
                const section = document.getElementById(sectionId);
                if (section) {
                    const topPosition = section.getBoundingClientRect().top + window.pageYOffset - offset;
                    window.scrollTo({top: topPosition, behavior: 'smooth'});
                }
            }, 100);
        }
    }

    return (
        <footer style={{marginTop: marginTop}}>
            <div className="container">
                <div className="row">
                    <div className="item left">
                        <img
                            onClick={() => scrollToTarget('hero')}
                            src="/images/logo.webp"
                            alt="KellyCars Logo"
                            className='logo'
                            draggable="false"
                            loading="lazy"
                            width={270}
                            height={186}
                        />
                    </div>
                    <div className="group empty"></div>
                    <div className="group">
                        <h2>Navigace</h2>
                        <ul>
                            <li>
                                <Link href='/vozy-pronajem/' aria-label='Vozy k pronájmu'>Vozy k pronájmu</Link>
                            </li>
                            <li>
                                <Link href='/blog/' aria-label='Blog'>Blog</Link>
                            </li>
                            <li>
                                <Link href='/faq/' aria-label='Časté dotazy'>FAQ</Link>
                            </li>
                        </ul>
                    </div>
                    <div className="group">
                        <h2>FAQ</h2>
                        <ul>
                            <li>
                                <Link href='/faq/pronajem/' aria-label='FAQ Pronájem'>Pronájem</Link>
                            </li>
                            <li>
                                <Link href='/faq/platby-a-kauce/' aria-label='FAQ Platby a kauce'>Platby a kauce</Link>
                            </li>
                            <li>
                                <Link href='/faq/pojisteni/' aria-label='FAQ Pojištění'>Pojištění</Link>
                            </li>
                            <li>
                                <Link href='/faq/podminky/' aria-label='FAQ Podmínky'>Podmínky</Link>
                            </li>
                        </ul>
                    </div>
                    <div className="group">
                        <h2>Kontakt</h2>
                        <ul>
                            <li>
                                <Link
                                    href="tel:+420735219480"
                                    className="link"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Zavolejte nám"
                                >
                                    +420 735 219 480
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="mailto:info@kellycars.cz"
                                    className="link"
                                    aria-label="Napište nám"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    info@kellycars.cz
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="https://maps.app.goo.gl/"
                                    className="link"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Naše adresa"
                                >
                                    Vinohradská 12, Praha 2, 120 00
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="row-two">
                    <p className="sm">KellyCars s.r.o.</p>
                    <p className="sm">IČO: 09182736</p>
                    <p className="sm">Vinohradská 12, Praha 2, 120 00</p>
                </div>
            </div>
            <div className="bottom">
                <div className="container">
                    <hr />
                    <div className="row">
                        <div className="group">
                            <p className="copyright sm">&copy; {new Date().getFullYear()} KellyCars.cz, Všechna práva vyhrazena.</p>
                        </div>
                        <p className="sm author">Web & Design <a href="https://mladejovsky.cz/" rel='noopener' aria-label='Tvůrce webu' target='_blank'>mladejovsky</a></p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
