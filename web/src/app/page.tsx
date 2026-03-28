import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";
import Button from "@/components/Button/Button";
import IconDocument from "@/components/Svg/IconDocument";
import IconCurator from "@/components/Svg/IconCurator";
import IconDiamond from "@/components/Svg/IconDiamond";
import IconPrice from "@/components/Svg/IconPrice";
import IconArrow from "@/components/Svg/IconArrow";
import Link from "next/link";
import Image from "next/image";
import { getBlogPosts, getVehicles } from "@/lib/api";
import type { Vehicle, BlogPost } from "@/types/api";
import './homepage.css';

const features = [
    {
        icon: <IconDocument />,
        title: "Prověřený původ",
        description: "Každý vůz prochází přísnou kontrolou mechanického stavu a ověřením kilometrového původu. Žádné kompromisy.",
    },
    {
        icon: <IconCurator />,
        title: "Ověření kurátorem",
        description: "Váš zkušený tým osobně zajistí přípravu vozu namístě po celé České republice.",
    },
    {
        icon: <IconDiamond />,
        title: "Unikátní kousky",
        description: "V nabídce naleznete vozy, které u klasických půjčoven prostě nenajdete – veterány i moderní ikony.",
    },
    {
        icon: <IconPrice />,
        title: "Transparentní cena",
        description: "Žádné skryté poplatky. Vše připraveno pro váhy cenového plánování naprosto transparentně.",
    },
];

function formatPrice(price: string | number): string {
    return Number(price).toLocaleString("cs-CZ") + " Kč";
}

export default async function Home() {
    let vehicles: Vehicle[] = [];
    let blogPosts: BlogPost[] = [];

    try {
        const [vehiclesRes, blogRes] = await Promise.all([
            getVehicles(),
            getBlogPosts({ limit: "3" }),
        ]);
        vehicles = vehiclesRes.data;
        blogPosts = blogRes.data;
    } catch (e) {
        console.error("Failed to fetch data:", e);
    }

    return (
        <>
            <Navbar />

            {/* HERO */}
            <section className="hero" id="hero">
                <div className="container">
                    <div className="row">
                        <div className="content">
                            <h1>
                                Kurátorský výběr<br />
                                <em>vašich cest.</em>
                            </h1>
                            <p>
                                Zapomeňte na běžné půjčovny. Vstupte do archivu automobilové historie
                                a současné elegance. Každý vůz v naší flotile je vybrán pro svůj příběh a charakter.
                            </p>
                            <Button type="primary" url="/vozy-pronajem/" ariaLabel="Zobrazit dostupná auta">
                                Zobrazit dostupná auta
                            </Button>
                        </div>
                        <div className="image">
                            <div className="placeholder">hero car</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section className="features" id="features">
                <div className="container">
                    <div className="row">
                        {features.map((feature, i) => (
                            <div className="item" key={i}>
                                <div className="icon">{feature.icon}</div>
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ARCHIVE */}
            <section className="archive" id="archive">
                <div className="container">
                    <div className="heading-reverse">
                        <h2>Vyberte si svou legendu</h2>
                        <span className="tag">Aktuální archiv</span>
                    </div>
                    <div className="filters">
                        <button>Všechny vozy</button>
                        <button className="active">Classeek</button>
                        <button>Modern classy</button>
                    </div>
                    <div className="row">
                        {vehicles.length > 0 ? vehicles.slice(0, 3).map((car) => (
                            <div className="item" key={car.id}>
                                <div className="image-wrapper">
                                    {car.image ? (
                                        <Image
                                            src={car.image.url}
                                            alt={car.image.alt}
                                            fill
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        />
                                    ) : (
                                        <div className="placeholder">{car.brand} {car.model}</div>
                                    )}
                                </div>
                                <div className="info">
                                    <div className="name-price">
                                        <h3>{car.brand} {car.model}</h3>
                                        <span className="price">{formatPrice(car.pricePerDay)}</span>
                                    </div>
                                    <p className="subtitle">{car.category} • {car.year}</p>
                                    <Button type="secondary" url={`/vozy-pronajem/${car.slug}/`} isArrow={true} ariaLabel={`Zobrazit ${car.brand} ${car.model}`}>
                                        Zobrazit vozy
                                    </Button>
                                </div>
                            </div>
                        )) : (
                            <p>Žádné vozy k zobrazení.</p>
                        )}
                    </div>
                </div>
            </section>

            {/* BLOG */}
            <section className="blog" id="blog">
                <div className="container">
                    <div className="heading-row">
                        <h2>Život v pohybu</h2>
                        <Link href="/blog/">
                            Číst všechny články <IconArrow color="#111" width={16} height={16} />
                        </Link>
                    </div>
                    <div className="row">
                        {blogPosts.length > 0 ? blogPosts.map((post) => (
                            <Link href={`/blog/${post.slug}/`} className="item" key={post.id}>
                                <div className="image-wrapper">
                                    {post.coverImage ? (
                                        <Image
                                            src={post.coverImage.url}
                                            alt={post.coverImage.alt}
                                            fill
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        />
                                    ) : (
                                        <div className="placeholder">{post.title}</div>
                                    )}
                                </div>
                                <span className="tag">{post.category.name}</span>
                                <h3>{post.title}</h3>
                                {post.excerpt && <p>{post.excerpt}</p>}
                            </Link>
                        )) : (
                            <p>Žádné články k zobrazení.</p>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
