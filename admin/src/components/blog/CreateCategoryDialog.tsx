"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryWithPostCount,
} from "@/actions/categories";
import { PencilIcon, Trash2Icon, XIcon, CheckIcon } from "lucide-react";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  _count: { blogPosts: number };
};

export function CreateCategoryDialog({ tenantId }: { tenantId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryRow[]>([]);

  // New category form
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [loading, setLoading] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");

  async function loadCategories() {
    const data = await getCategoryWithPostCount(tenantId);
    setCategories(data);
  }

  useEffect(() => {
    if (open) loadCategories();
  }, [open]);

  function handleNameChange(value: string) {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await createCategory({
        tenantId,
        name,
        slug: slug || slugify(name),
      });
      toast.success("Kategorie vytvořena");
      setName("");
      setSlug("");
      setSlugTouched(false);
      await loadCategories();
      router.refresh();
    } catch {
      toast.error("Nepodařilo se vytvořit kategorii");
    } finally {
      setLoading(false);
    }
  }

  function startEdit(cat: CategoryRow) {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditSlug(cat.slug);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName("");
    setEditSlug("");
  }

  async function handleUpdate(id: string) {
    try {
      await updateCategory(id, { name: editName, slug: editSlug });
      toast.success("Kategorie aktualizována");
      cancelEdit();
      await loadCategories();
      router.refresh();
    } catch {
      toast.error("Nepodařilo se aktualizovat kategorii");
    }
  }

  async function handleDelete(cat: CategoryRow) {
    if (cat._count.blogPosts > 0) {
      toast.error(
        `Kategorii nelze smazat – obsahuje ${cat._count.blogPosts} ${
          cat._count.blogPosts === 1
            ? "článek"
            : cat._count.blogPosts >= 2 && cat._count.blogPosts <= 4
              ? "články"
              : "článků"
        }`
      );
      return;
    }
    try {
      await deleteCategory(cat.id);
      toast.success("Kategorie smazána");
      await loadCategories();
      router.refresh();
    } catch {
      toast.error("Nepodařilo se smazat kategorii");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" />}>
        Kategorie
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Kategorie článků</DialogTitle>
          <DialogDescription>
            Spravujte kategorie pro blog.
          </DialogDescription>
        </DialogHeader>

        {/* Existing categories */}
        {categories.length > 0 && (
          <div className="flex flex-col gap-1">
            {categories.map((cat) => (
              <div key={cat.id}>
                {editingId === cat.id ? (
                  <div className="flex items-center gap-2 rounded-lg border p-2">
                    <div className="flex flex-1 flex-col gap-1.5">
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Název"
                      />
                      <Input
                        value={editSlug}
                        onChange={(e) => setEditSlug(e.target.value)}
                        placeholder="Slug"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleUpdate(cat.id)}
                    >
                      <CheckIcon className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={cancelEdit}
                    >
                      <XIcon className="size-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-muted/50">
                    <div>
                      <span className="text-sm font-medium">{cat.name}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({cat._count.blogPosts})
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => startEdit(cat)}
                      >
                        <PencilIcon className="size-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(cat)}
                      >
                        <Trash2Icon className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Create new */}
        <form onSubmit={handleCreate}>
          <div className="flex flex-col gap-3 border-t pt-4">
            <p className="text-sm font-medium">Nová kategorie</p>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="blog-cat-name">Název</Label>
              <Input
                id="blog-cat-name"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="blog-cat-slug">Slug</Label>
              <Input
                id="blog-cat-slug"
                required
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugTouched(true);
                }}
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Vytvářím..." : "Přidat"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
