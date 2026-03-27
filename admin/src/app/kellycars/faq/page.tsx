import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getFaqCategoriesByTenant } from "@/actions/faq";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateCategoryDialog } from "@/components/Faq/CreateCategoryDialog";
import { DeleteCategoryButton } from "@/components/Faq/DeleteCategoryButton";

const TENANT_SLUG = "kellycars";

export default async function FaqPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const tenant = session.user.tenants.find((t) => t.slug === TENANT_SLUG);
  if (!tenant) redirect("/");

  const categories = await getFaqCategoriesByTenant(tenant.id);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">FAQ</h1>
        <CreateCategoryDialog tenantId={tenant.id} />
      </div>

      {categories.length === 0 ? (
        <p className="text-muted-foreground">Zatím žádné kategorie.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <Card key={cat.id} className="relative transition-colors hover:bg-muted/40">
              <div className="absolute right-3 top-3 z-10">
                <DeleteCategoryButton
                  categoryId={cat.id}
                  categoryName={cat.name}
                  itemCount={cat.items.length}
                />
              </div>
              <Link href={`/kellycars/faq/${cat.id}`}>
                <CardHeader>
                  <CardTitle>{cat.name}</CardTitle>
                  {cat.description && (
                    <CardDescription>{cat.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {cat.items.length}{" "}
                    {cat.items.length === 1
                      ? "otázka"
                      : cat.items.length >= 2 && cat.items.length <= 4
                        ? "otázky"
                        : "otázek"}
                  </p>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
