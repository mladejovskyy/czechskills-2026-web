"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Vehicle } from "@/types/api";

function formatPrice(price: string | number): string {
    return Number(price).toLocaleString("cs-CZ") + " Kč";
}

const transmissionLabel: Record<string, string> = {
    MANUAL: "Manuální",
    AUTOMATIC: "Automatická",
};

interface VozyClientProps {
    vehicles: Vehicle[];
    categories: string[];
}

export default function VozyClient({ vehicles, categories }: VozyClientProps) {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [activeTransmission, setActiveTransmission] = useState<string | null>(null);

    const filtered = useMemo(() => {
        return vehicles.filter((v) => {
            if (activeCategory && v.category !== activeCategory) return false;
            if (activeTransmission && v.transmission !== activeTransmission) return false;
            return true;
        });
    }, [vehicles, activeCategory, activeTransmission]);

    return (
        <>
            {/* FILTERS */}
            <section className="vozyFilters">
                <div className="container">
                    <div className="filters-row">
                        <button
                            className={`filter-btn ${!activeCategory && !activeTransmission ? "active" : ""}`}
                            onClick={() => { setActiveCategory(null); setActiveTransmission(null); }}
                        >
                            Vše
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                className={`filter-btn ${activeCategory === cat ? "active" : ""}`}
                                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                            >
                                {cat}
                            </button>
                        ))}
                        <button
                            className={`filter-btn ${activeTransmission === "MANUAL" ? "active" : ""}`}
                            onClick={() => setActiveTransmission(activeTransmission === "MANUAL" ? null : "MANUAL")}
                        >
                            Manuální
                        </button>
                        <button
                            className={`filter-btn ${activeTransmission === "AUTOMATIC" ? "active" : ""}`}
                            onClick={() => setActiveTransmission(activeTransmission === "AUTOMATIC" ? null : "AUTOMATIC")}
                        >
                            Automatická
                        </button>
                    </div>
                </div>
            </section>

            {/* GRID */}
            <section className="vozyGrid">
                <div className="container">
                    <div className="row">
                        {filtered.length > 0 ? filtered.map((car) => (
                            <Link href={`/vozy-pronajem/${car.slug}/`} className="card" key={car.id}>
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
                                        <span className="price">
                                            {formatPrice(car.pricePerDay)} <span>/ den</span>
                                        </span>
                                    </div>
                                    <p className="subtitle">{car.category} · {car.year}</p>
                                    <div className="tags">
                                        <span className="chip">{car.seats} míst</span>
                                        <span className="chip">{car.fuelType}</span>
                                        <span className="chip">{transmissionLabel[car.transmission] || car.transmission}</span>
                                    </div>
                                </div>
                            </Link>
                        )) : (
                            <div className="empty">
                                <p>Žádné vozy neodpovídají vašemu filtru.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}
