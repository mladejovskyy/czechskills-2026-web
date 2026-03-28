'use client'
import './Navbar.css';
import {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import Button from "@/components/Button/Button";
import Link from "next/link";
import IconChevron from "@/components/Svg/IconChevron";
import {motion, AnimatePresence} from "framer-motion";

interface NavbarProps {
    subpage?: boolean;
}

const faqCategories = [
    {label: 'Pronájem', slug: 'pronajem'},
    {label: 'Platby a kauce', slug: 'platby-a-kauce'},
    {label: 'Pojištění', slug: 'pojisteni'},
    {label: 'Podmínky', slug: 'podminky'},
];

export default function Navbar({subpage}: NavbarProps) {
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const [scrolled, setScrolled] = useState<boolean>(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const router = useRouter();

    const toggleMenu = (): void => {
        setMenuOpen(!menuOpen);
        if (menuOpen) {
            setOpenDropdown(null);
        }
    };

    const handleScroll = (): void => {
        if (window.scrollY > 120) {
            setScrolled(true);
        } else {
            setScrolled(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTarget = async (sectionId: string): Promise<void> => {
        const currentPath = window.location.pathname;
        const offset = window.innerWidth >= 768 ? 70 : 80;

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
        <div className={`nav ${scrolled || menuOpen ? 'scrolled' : ''}`} id={`${subpage ? 'subpage' : ''}`}>
            <nav className="container">
                <div className="nav-left">
                    <img src="/images/logo.webp" width={115} height={80} className="nav-logo" alt="KellyCars Logo" onClick={() => scrollToTarget('hero')} />
                    <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
                        <li className="nav-link" data-aos="fade-down" data-aos-once="true" data-aos-delay="100">
                            <a onClick={() => scrollToTarget('proc-my')} aria-label="Proč my">
                                Proč my
                            </a>
                        </li>
                        <li className="nav-link" data-aos="fade-down" data-aos-once="true" data-aos-delay="150">
                            <a onClick={() => scrollToTarget('o-nas')} aria-label="O nás">
                                O nás
                            </a>
                        </li>
                        <li className="nav-link" data-aos="fade-down" data-aos-once="true" data-aos-delay="200">
                            <a onClick={() => scrollToTarget('reference')} aria-label="Reference">
                                Reference
                            </a>
                        </li>
                        <li className="nav-link" data-aos="fade-down" data-aos-once="true" data-aos-delay="250">
                            <a onClick={() => scrollToTarget('kontakty')} aria-label="Kontakty">
                                Kontakty
                            </a>
                        </li>
                        <li className="nav-link" data-aos="fade-down" data-aos-once="true" data-aos-delay="300">
                            <Link href="/vozy-pronajem/" aria-label="Vozy k pronájmu">
                                Vozy k pronájmu
                            </Link>
                        </li>
                        <li className="nav-link" data-aos="fade-down" data-aos-once="true" data-aos-delay="350">
                            <Link href="/blog/" aria-label="Blog">
                                Blog
                            </Link>
                        </li>
                        <li
                            className="nav-link nav-dropdown"
                            data-aos="fade-down"
                            data-aos-once="true"
                            data-aos-delay="400"
                            onMouseEnter={() => window.innerWidth >= 1280 && setOpenDropdown('faq')}
                            onMouseLeave={() => window.innerWidth >= 1280 && setOpenDropdown(null)}
                        >
                            <div
                                className="nav-dropdown-trigger"
                                onClick={() => window.innerWidth < 1280 && setOpenDropdown(openDropdown === 'faq' ? null : 'faq')}
                            >
                                <Link href="/faq/" aria-label="Časté dotazy">
                                    FAQ
                                </Link>
                                <IconChevron
                                    width={24}
                                    height={24}
                                    color="#333"
                                    className={`nav-dropdown-icon ${openDropdown === 'faq' ? 'open' : ''}`}
                                />
                            </div>
                            <AnimatePresence>
                                {openDropdown === 'faq' && (
                                    <motion.ul
                                        className="nav-dropdown-menu"
                                        initial={{opacity: 0, y: -10}}
                                        animate={{opacity: 1, y: 0}}
                                        exit={{opacity: 0, y: -10}}
                                        transition={{duration: 0.2}}
                                    >
                                        {faqCategories.map((cat) => (
                                            <li key={cat.slug}>
                                                <Link
                                                    href={`/faq/${cat.slug}/`}
                                                    onClick={() => setOpenDropdown(null)}
                                                >
                                                    {cat.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </motion.ul>
                                )}
                            </AnimatePresence>
                        </li>
                        <li className="nav-link-btn-mobile" data-aos="fade-down" data-aos-once="true" data-aos-delay="500">
                            <Button
                                type="primary"
                                url="/vozy-pronajem/"
                                ariaLabel="Zobrazit dostupná auta"
                            >
                                Zobrazit dostupná auta
                            </Button>
                        </li>
                    </ul>
                </div>
                <div className={`burger-menu ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </div>
                <div className="btns-row" data-aos="fade-down" data-aos-once="true" data-aos-delay="500">
                    <Button
                        type={scrolled || menuOpen ? "primary" : "secondary"}
                        url="/vozy-pronajem/"
                        ariaLabel="Zobrazit dostupná auta"
                    >
                        Zobrazit dostupná auta
                    </Button>
                </div>
            </nav>
        </div>
    );
}
