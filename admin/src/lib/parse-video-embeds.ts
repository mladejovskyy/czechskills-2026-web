/**
 * Parses `{url}` shortcodes in blog content and replaces them with
 * responsive video embed HTML.
 *
 * Supports YouTube and Vimeo. Unknown URLs render as a plain link.
 *
 * Usage in content: {https://www.youtube.com/watch?v=dQw4w9WgXcQ}
 */
export function parseVideoEmbeds(html: string): string {
  return html.replace(
    /\{(https?:\/\/[^\s}]+)\}/g,
    (_, url: string) => {
      const youtubeId = getYouTubeId(url);
      if (youtubeId) {
        return `<div class="video-embed"><iframe src="https://www.youtube.com/embed/${youtubeId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>`;
      }

      const vimeoId = getVimeoId(url);
      if (vimeoId) {
        return `<div class="video-embed"><iframe src="https://player.vimeo.com/video/${vimeoId}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>`;
      }

      return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    }
  );
}

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match?.[1] ?? null;
}

function getVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match?.[1] ?? null;
}
