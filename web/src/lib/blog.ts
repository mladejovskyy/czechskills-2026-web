export function formatDate(dateString: string | null): string {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("cs-CZ", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

export function estimateReadTime(html: string): number {
    const text = html.replace(/<[^>]*>/g, "");
    const words = text.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
}

function extractYouTubeId(url: string): string | null {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
}

export function embedYouTubeVideos(html: string): string {
    return html.replace(/\{(https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)\/[^\s}]+)\}/g, (_, url) => {
        const id = extractYouTubeId(url);
        if (!id) return url;
        return `<div class="video-embed"><iframe src="https://www.youtube-nocookie.com/embed/${id}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>`;
    });
}
