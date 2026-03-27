import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getFaqCategory } from "@/actions/faq";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreateItemDialog } from "./_create-item-dialog";
import { FaqItemActions } from "./_faq-item-actions";

const TENANT_SLUG = "kellycars";

export default async function FaqCategoryPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = await params;
  const session = await auth();
  if (!session) redirect("/login");

  const tenant = session.user.tenants.find((t) => t.slug === TENANT_SLUG);
  if (!tenant) redirect("/");

  const category = await getFaqCategory(categoryId);
  if (!category || category.tenantId !== tenant.id) notFound();

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-3">
        <Link
          href="/kellycars/faq"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          FAQ
        </Link>
        <span className="text-muted-foreground">/</span>
        <h1 className="text-2xl font-semibold">{category.name}</h1>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {category.items.length}{" "}
          {category.items.length === 1
            ? "otázka"
            : category.items.length >= 2 && category.items.length <= 4
              ? "otázky"
              : "otázek"}
        </p>
        <CreateItemDialog tenantId={tenant.id} categoryId={categoryId} />
      </div>

      {category.items.length === 0 ? (
        <p className="text-muted-foreground">Zatím žádné otázky.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Otázka</TableHead>
              <TableHead>Stav</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {category.items.map((item, i) => (
              <TableRow key={item.id}>
                <TableCell className="text-muted-foreground">
                  {i + 1}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">{item.question}</span>
                    <span className="line-clamp-1 text-sm text-muted-foreground">
                      {item.answer}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={item.published ? "default" : "secondary"}>
                    {item.published ? "Publikováno" : "Skryto"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <FaqItemActions item={item} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
