import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getBlogPost } from "@/actions/blog-posts";
import { getCategoriesByTenant } from "@/actions/categories";
import { BlogPostForm } from "@/components/blog/BlogPostForm";

const TENANT_SLUG = "kellycars";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session) redirect("/login");

  const tenant = session.user.tenants.find((t) => t.slug === TENANT_SLUG);
  if (!tenant) redirect("/");

  const [post, categories] = await Promise.all([
    getBlogPost(id),
    getCategoriesByTenant(tenant.id),
  ]);

  if (!post || post.tenantId !== tenant.id) notFound();

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">Upravit článek</h1>
      <BlogPostForm
        tenantId={tenant.id}
        tenantSlug={TENANT_SLUG}
        authorId={session.user.id}
        categories={categories}
        backHref="/kellycars/blog"
        initial={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          categoryId: post.categoryId,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.coverImage
            ? { id: post.coverImage.id, url: post.coverImage.url, alt: post.coverImage.alt }
            : null,
          voiceOverUrl: post.voiceOverUrl,
          metaTitle: post.metaTitle,
          metaDesc: post.metaDesc,
          tagNames: post.tags.map((t) => t.name),
          faqs: post.faqs.map((f) => ({ question: f.question, slug: f.slug, answer: f.answer })),
        }}
      />
    </div>
  );
}
