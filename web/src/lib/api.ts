import type {
    BlogResponse,
    BlogDetailResponse,
    VehiclesResponse,
    VehicleDetailResponse,
    FaqResponse,
    FaqDetailResponse,
    CategoriesResponse,
    TagsResponse,
    RedirectsResponse,
} from "@/types/api";

const API_URL = process.env.API_URL!;
const API_KEY = process.env.API_KEY!;
const TENANT = process.env.TENANT_SLUG!;

class ApiError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = "ApiError";
    }
}

async function fetchApi<T>(path: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`/api/v1/${TENANT}${path}`, API_URL);

    if (params) {
        for (const [key, value] of Object.entries(params)) {
            if (value) url.searchParams.set(key, value);
        }
    }

    const res = await fetch(url.toString(), {
        headers: {
            Authorization: `Bearer ${API_KEY}`,
        },
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new ApiError(res.status, body.error || `API error ${res.status}`);
    }

    return res.json();
}

// ── Blog ──

export function getBlogPosts(options?: {
    category?: string;
    tag?: string;
    page?: string;
    limit?: string;
}) {
    return fetchApi<BlogResponse>("/blog", options);
}

export function getBlogPost(slug: string) {
    return fetchApi<BlogDetailResponse>(`/blog/${slug}`);
}

// ── Vehicles ──

export function getVehicles(options?: {
    category?: string;
    transmission?: string;
}) {
    return fetchApi<VehiclesResponse>("/vehicles", options);
}

export function getVehicle(slug: string) {
    return fetchApi<VehicleDetailResponse>(`/vehicles/${slug}`);
}

// ── FAQ ──

export function getFaqCategories() {
    return fetchApi<FaqResponse>("/faq");
}

export function getFaqCategory(slug: string) {
    return fetchApi<FaqDetailResponse>(`/faq/${slug}`);
}

// ── Categories & Tags ──

export function getCategories() {
    return fetchApi<CategoriesResponse>("/categories");
}

export function getTags() {
    return fetchApi<TagsResponse>("/tags");
}

// ── Redirects ──

export function getRedirects() {
    return fetchApi<RedirectsResponse>("/redirects");
}
