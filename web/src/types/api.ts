// Shared
export interface Media {
    id: string;
    url: string;
    alt: string;
}

// Blog
export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string | null;
    content: string;
    status: string;
    publishedAt: string | null;
    voiceOverUrl: string | null;
    category: { id: string; name: string; slug: string };
    tags: { id: string; name: string; slug: string }[];
    author: { id: string; name: string | null; username: string };
    coverImage: Media | null;
    faqs: { id: string; question: string; answer: string; sortOrder: number }[];
}

export interface BlogResponse {
    data: BlogPost[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface BlogDetailResponse {
    data: BlogPost;
}

// Vehicles
export interface Vehicle {
    id: string;
    slug: string;
    brand: string;
    model: string;
    year: number;
    category: string;
    seats: number;
    fuelType: string;
    transmission: "MANUAL" | "AUTOMATIC";
    pricePerDay: string; // Decimal comes as string from Prisma
    description: string | null;
    available: boolean;
    image: Media | null;
}

export interface VehiclesResponse {
    data: Vehicle[];
}

export interface VehicleDetailResponse {
    data: Vehicle;
}

// FAQ
export interface FaqItem {
    id: string;
    question: string;
    slug: string;
    answer: string;
    metaTitle: string | null;
    metaDesc: string | null;
    sortOrder: number;
}

export interface FaqCategory {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    metaTitle: string | null;
    metaDesc: string | null;
    sortOrder: number;
    items: FaqItem[];
}

export interface FaqResponse {
    data: FaqCategory[];
}

export interface FaqDetailResponse {
    data: FaqCategory;
}

// Categories & Tags
export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    metaTitle: string | null;
    metaDesc: string | null;
}

export interface Tag {
    id: string;
    name: string;
    slug: string;
}

export interface CategoriesResponse {
    data: Category[];
}

export interface TagsResponse {
    data: Tag[];
}

// Redirects
export interface Redirect {
    id: string;
    fromPath: string;
    toPath: string;
    type: "PERMANENT" | "TEMPORARY";
}

export interface RedirectsResponse {
    data: Redirect[];
}
