"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  publishBlogPost,
  unpublishBlogPost,
  deleteBlogPost,
} from "@/actions/blog-posts";
import { MoreHorizontalIcon } from "lucide-react";

type BlogPostRow = {
  id: string;
  status: string;
};

export function BlogPostActions({ post }: { post: BlogPostRow }) {
  const router = useRouter();

  async function handleTogglePublish() {
    try {
      if (post.status === "PUBLISHED") {
        await unpublishBlogPost(post.id);
        toast.success("Článek stažen z publikace");
      } else {
        await publishBlogPost(post.id);
        toast.success("Článek publikován");
      }
      router.refresh();
    } catch {
      toast.error("Nepodařilo se změnit stav");
    }
  }

  async function handleDelete() {
    try {
      await deleteBlogPost(post.id);
      toast.success("Článek smazán");
      router.refresh();
    } catch {
      toast.error("Nepodařilo se smazat článek");
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="icon-sm" />}
      >
        <MoreHorizontalIcon className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => router.push(`/kellycars/blog/${post.id}`)}
        >
          Upravit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleTogglePublish}>
          {post.status === "PUBLISHED" ? "Stáhnout" : "Publikovat"}
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onClick={handleDelete}>
          Smazat
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
