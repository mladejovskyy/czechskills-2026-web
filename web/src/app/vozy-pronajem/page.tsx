import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import Button from "@/components/Button/Button";
import JsonLd from "@/components/JsonLd";
import { getVehicles } from "@/lib/api";
import type { Vehicle } from "@/types/api";
import VozyClient from "./VozyClient";
import './vozy.css';

export const metadata = {
    title: "Vozy k pronájmu | KellyCars",
    description: "Prohlédněte si kompletní nabídku vozů k pronájmu. Veterány, moderní klasiky i sportovní vozy – vyberte si svou legendu.",
};

export default async function VozyPronajem() {
    let vehicles: Vehicle[] = [];

    try {
        const res = await getVehicles();
        vehicles = res.data;
    } catch (e) {
        console.error("Failed to fetch vehicles:", e);
    }

    const categories = [...new Set(vehicles.map((v) => v.category))];

    const vehicleListLd = vehicles.length > 0 ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Vozy k pronájmu – KellyCars",
        numberOfItems: vehicles.length,
        itemListElement: vehicles.map((car, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
                "@type": "Car",
                name: `${car.brand} ${car.model}`,
                url: `https://kellycars.cz/vozy-pronajem/${car.slug}/`,
                vehicleModelDate: String(car.year),
                brand: { "@type": "Brand", name: car.brand },
                model: car.model,
                ...(car.image && { image: car.image.url }),
                offers: {
                    "@type": "Offer",
                    price: Number(car.pricePerDay),
                    priceCurrency: "CZK",
                    unitText: "den",
                    availability: "https://schema.org/InStock",
                },
            },
        })),
    } : null;

    return (
        <>
            {vehicleListLd && <JsonLd data={vehicleListLd} />}

            <Navbar subpage />

            {/* HERO */}
            <section className="vozyHero">
                <div className="container">
                    <span className="tag">Nabídka vozů</span>
                    <h1>
                        Vyberte si svou <span className="highlight">legendu</span>
                    </h1>
                    <p>
                        Každý vůz v naší flotile je pečlivě vybraný pro svůj příběh, charakter a zážitek z jízdy. Projděte si kompletní nabídku.
                    </p>
                </div>
            </section>

            <VozyClient vehicles={vehicles} categories={categories} />

            {/* CTA */}
            <section className="vozyCta">
                <div className="container">
                    <div className="row">
                        <h2>Nenašli jste, co hledáte?</h2>
                        <p>
                            Kontaktujte nás a společně najdeme vůz přesně podle vašich představ. Rádi vám poradíme.
                        </p>
                        <div className="btns-row">
                            <Button
                                type="secondary"
                                url="tel:+420735219480"
                                ariaLabel="Zavolejte nám"
                                isArrow={false}
                            >
                                +420 735 219 480
                            </Button>
                            <Button
                                type="secondary"
                                url="mailto:info@kellycars.cz"
                                ariaLabel="Napište nám"
                                isArrow={false}
                            >
                                info@kellycars.cz
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
