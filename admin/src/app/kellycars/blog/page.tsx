import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getBlogPostsByTenant } from "@/actions/blog-posts";
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

const TENANT_SLUG = "kellycars";

const statusLabel: Record<string, string> = {
  DRAFT: "Koncept",
  PUBLISHED: "Publikováno",
  ARCHIVED: "Archivováno",
};

const statusVariant: Record<string, "secondary" | "default" | "outline"> = {
  DRAFT: "secondary",
  PUBLISHED: "default",
  ARCHIVED: "outline",
};

export default async function BlogListPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const tenant = session.user.tenants.find((t) => t.slug === TENANT_SLUG);
  if (!tenant) redirect("/");

  const posts = await getBlogPostsByTenant(tenant.id);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Blog</h1>
        <Link href="/kellycars/blog/new">
          <Button>Nový článek</Button>
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="text-muted-foreground">Zatím žádné články.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Název</TableHead>
              <TableHead>Kategorie</TableHead>
              <TableHead>Autor</TableHead>
              <TableHead>Stav</TableHead>
              <TableHead>Vytvořeno</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>
                  <Link
                    href={`/kellycars/blog/${post.id}`}
                    className="font-medium hover:underline"
                  >
                    {post.title}
                  </Link>
                </TableCell>
                <TableCell>{post.category.name}</TableCell>
                <TableCell>{post.author.name ?? post.author.username}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[post.status]}>
                    {statusLabel[post.status]}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {post.createdAt.toLocaleDateString("cs-CZ")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
