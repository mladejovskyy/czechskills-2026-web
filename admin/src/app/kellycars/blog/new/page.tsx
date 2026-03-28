import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getCategoriesByTenant } from "@/actions/categories";
import { BlogPostForm } from "@/components/blog/BlogPostForm";

const TENANT_SLUG = "kellycars";

export default async function NewBlogPostPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const tenant = session.user.tenants.find((t) => t.slug === TENANT_SLUG);
  if (!tenant) redirect("/");

  const categories = await getCategoriesByTenant(tenant.id);

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">Nový článek</h1>
      <BlogPostForm
        tenantId={tenant.id}
        tenantSlug={TENANT_SLUG}
        authorId={session.user.id}
        categories={categories}
        backHref="/kellycars/blog"
      />
    </div>
  );
}
