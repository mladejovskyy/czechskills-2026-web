import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/types/api";

interface BlogCardProps {
    post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
    return (
        <Link href={`/blog/${post.category.slug}/${post.slug}/`} className="item">
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
    );
}
