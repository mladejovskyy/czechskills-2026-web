import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const firstTenant = session.user.tenants[0];
  if (firstTenant) {
    redirect(`/${firstTenant.slug}`);
  }

  return (
    <div className="flex min-h-full flex-1 items-center justify-center">
      <p className="text-muted-foreground">No tenants assigned to your account.</p>
    </div>
  );
}
