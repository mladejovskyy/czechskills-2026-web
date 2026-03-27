import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      username: string;
      tenants: { id: string; slug: string; name: string }[];
    };
  }
}
