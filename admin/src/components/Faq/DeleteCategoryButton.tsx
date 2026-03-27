"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { deleteFaqCategory } from "@/actions/faq";
import { Trash2Icon } from "lucide-react";

export function DeleteCategoryButton({
  categoryId,
  categoryName,
  itemCount,
}: {
  categoryId: string;
  categoryName: string;
  itemCount: number;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try {
      await deleteFaqCategory(categoryId);
      toast.success("Kategorie smazána");
      setOpen(false);
      router.refresh();
    } catch {
      toast.error("Nepodařilo se smazat kategorii");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
      >
        <Trash2Icon className="size-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Smazat kategorii</DialogTitle>
            <DialogDescription>
              Opravdu chcete smazat kategorii <strong>{categoryName}</strong>?
              {itemCount > 0 && (
                <>
                  {" "}
                  Bude smazáno i{" "}
                  {itemCount === 1
                    ? "1 otázka"
                    : itemCount >= 2 && itemCount <= 4
                      ? `${itemCount} otázky`
                      : `${itemCount} otázek`}
                  .
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Zrušit
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Mažu..." : "Smazat"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
