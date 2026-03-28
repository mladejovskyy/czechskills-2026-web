import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import Button from "@/components/Button/Button";
import IconArrow from "@/components/Svg/IconArrow";
import JsonLd from "@/components/JsonLd";
import Image from "next/image";
import Link from "next/link";
import { getVehicle, getVehicles } from "@/lib/api";
import type { Vehicle } from "@/types/api";
import type { Metadata } from "next";
import '../vozy.css';
import './vehicle-detail.css';

function formatPrice(price: string | number): string {
    return Number(price).toLocaleString("cs-CZ") + " Kč";
}

const transmissionLabel: Record<string, string> = {
    MANUAL: "Manuální",
    AUTOMATIC: "Automatická",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;

    try {
        const res = await getVehicle(slug);
        const car = res.data;
        return {
            title: `${car.brand} ${car.model} (${car.year}) – Pronájem | KellyCars`,
            description: car.description || `Pronajměte si ${car.brand} ${car.model} (${car.year}) od ${formatPrice(car.pricePerDay)}/den. KellyCars – kurátorský výběr vozů.`,
        };
    } catch {
        return { title: "Vůz nenalezen | KellyCars" };
    }
}

export default async function VehicleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    let car: Vehicle | null = null;
    let otherVehicles: Vehicle[] = [];

    try {
        const res = await getVehicle(slug);
        car = res.data;

        const allRes = await getVehicles();
        otherVehicles = allRes.data.filter((v) => v.slug !== slug).slice(0, 3);
    } catch (e) {
        console.error("Failed to fetch vehicle:", e);
    }

    if (!car) {
        return (
            <>
                <Navbar subpage />
                <section className="vozyHero">
                    <div className="container">
                        <h1>Vůz nenalezen</h1>
                        <p>Požadovaný vůz neexistuje nebo byl odstraněn z nabídky.</p>
                        <Button type="primary" url="/vozy-pronajem/" ariaLabel="Zpět na nabídku" className="mt-6">
                            Zpět na nabídku
                        </Button>
                    </div>
                </section>
                <Footer />
            </>
        );
    }

    const vehicleLd = {
        "@context": "https://schema.org",
        "@type": "Car",
        name: `${car.brand} ${car.model}`,
        url: `https://kellycars.cz/vozy-pronajem/${car.slug}/`,
        vehicleModelDate: String(car.year),
        brand: { "@type": "Brand", name: car.brand },
        model: car.model,
        numberOfDoors: car.seats,
        fuelType: car.fuelType,
        vehicleTransmission: car.transmission === "MANUAL" ? "ManualTransmission" : "AutomaticTransmission",
        ...(car.image && { image: car.image.url }),
        offers: {
            "@type": "Offer",
            price: Number(car.pricePerDay),
            priceCurrency: "CZK",
            unitText: "den",
            availability: "https://schema.org/InStock",
        },
    };

    const specs = [
        { label: "Rok výroby", value: String(car.year) },
        { label: "Kategorie", value: car.category },
        { label: "Počet míst", value: String(car.seats) },
        { label: "Palivo", value: car.fuelType },
        { label: "Převodovka", value: transmissionLabel[car.transmission] || car.transmission },
    ];

    return (
        <>
            <JsonLd data={vehicleLd} />

            <Navbar subpage />

            {/* HERO */}
            <section className="vehicleHero">
                <div className="container">
                    <Link href="/vozy-pronajem/" className="back-link">
                        <IconArrow color="#B45309" width={14} height={14} /> Zpět na nabídku
                    </Link>

                    <div className="vehicleGrid">
                        {/* IMAGE */}
                        <div className="vehicleImage">
                            {car.image ? (
                                <Image
                                    src={car.image.url}
                                    alt={car.image.alt}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 640px"
                                    priority
                                />
                            ) : (
                                <div className="placeholder">{car.brand} {car.model}</div>
                            )}
                        </div>

                        {/* INFO */}
                        <div className="vehicleInfo">
                            <span className="category-tag">{car.category}</span>
                            <h1>{car.brand} {car.model}</h1>
                            <p className="year">{car.year}</p>

                            <div className="price-box">
                                <span className="price-value">{formatPrice(car.pricePerDay)}</span>
                                <span className="price-unit">/ den</span>
                            </div>

                            <div className="specs">
                                {specs.map((s) => (
                                    <div className="spec" key={s.label}>
                                        <span className="spec-label">{s.label}</span>
                                        <span className="spec-value">{s.value}</span>
                                    </div>
                                ))}
                            </div>

                            {car.description && (
                                <div className="description">
                                    <p>{car.description}</p>
                                </div>
                            )}

                            <div className="actions">
                                <Button
                                    type="primary"
                                    url="tel:+420735219480"
                                    ariaLabel="Zavolat a rezervovat"
                                    isArrow={false}
                                >
                                    Zavolat a rezervovat
                                </Button>
                                <Button
                                    type="secondary"
                                    url="mailto:info@kellycars.cz"
                                    ariaLabel="Napsat e-mail"
                                    isArrow={false}
                                    className="btn-outline"
                                >
                                    Napsat e-mail
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* OTHER VEHICLES */}
            {otherVehicles.length > 0 && (
                <section className="vehicleOthers">
                    <div className="container">
                        <div className="heading-row">
                            <h2>Další vozy z naší nabídky</h2>
                            <Link href="/vozy-pronajem/" className="see-all">
                                Zobrazit vše <IconArrow color="#111" width={14} height={14} />
                            </Link>
                        </div>
                        <div className="row">
                            {otherVehicles.map((v) => (
                                <Link href={`/vozy-pronajem/${v.slug}/`} className="card" key={v.id}>
                                    <div className="image-wrapper">
                                        {v.image ? (
                                            <Image
                                                src={v.image.url}
                                                alt={v.image.alt}
                                                fill
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            />
                                        ) : (
                                            <div className="placeholder">{v.brand} {v.model}</div>
                                        )}
                                    </div>
                                    <div className="info">
                                        <div className="name-price">
                                            <h3>{v.brand} {v.model}</h3>
                                            <span className="price">
                                                {formatPrice(v.pricePerDay)} <span>/ den</span>
                                            </span>
                                        </div>
                                        <p className="subtitle">{v.category} · {v.year}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <Footer />
        </>
    );
}
