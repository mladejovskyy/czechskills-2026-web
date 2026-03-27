import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Menu } from "@/components/Menu/Menu";

const menuSections = [
  {
    items: [{ label: "Přehled", href: "" }],
  },
  {
    title: "Obsah",
    items: [
      { label: "Blog", href: "/blog" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Autopůjčovna",
    items: [{ label: "Vozy", href: "/vozy" }],
  },
];

export default async function KellyCarsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const hasTenant = session.user.tenants.some((t) => t.slug === "kellycars");
  if (!hasTenant) {
    redirect("/");
  }

  return (
    <div className="flex h-full min-h-screen">
      <Menu
        tenantSlug="kellycars"
        tenantName="KellyCars"
        sections={menuSections}
      />
      <main className="flex-1">{children}</main>
    </div>
  );
}
