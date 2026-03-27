"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type MenuItem = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

type MenuSection = {
  title?: string;
  items: MenuItem[];
};

type MenuProps = {
  tenantSlug: string;
  tenantName: string;
  sections: MenuSection[];
};

export function Menu({ tenantSlug, tenantName, sections }: MenuProps) {
  const pathname = usePathname();
  const basePath = `/${tenantSlug}`;

  return (
    <aside className="flex h-full w-64 flex-col border-r bg-muted/30">
      <div className="border-b px-4 py-5">
        <Link href={basePath} className="text-lg font-semibold">
          {tenantName}
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {sections.map((section, i) => (
          <div key={i} className={cn(i > 0 && "mt-6")}>
            {section.title && (
              <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {section.title}
              </p>
            )}
            <ul className="space-y-1">
              {section.items.map((item) => {
                const fullHref = `${basePath}${item.href}`;
                const isActive = pathname === fullHref || pathname.startsWith(fullHref + "/");

                return (
                  <li key={item.href}>
                    <Link
                      href={fullHref}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                        isActive
                          ? "bg-primary/10 font-medium text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
