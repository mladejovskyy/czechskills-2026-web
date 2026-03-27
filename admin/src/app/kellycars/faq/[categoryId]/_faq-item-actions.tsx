"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { updateFaqItem, deleteFaqItem } from "@/actions/faq";
import { MoreHorizontalIcon } from "lucide-react";

type FaqItem = {
  id: string;
  question: string;
  slug: string;
  answer: string;
  published: boolean;
};

export function FaqItemActions({ item }: { item: FaqItem }) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [question, setQuestion] = useState(item.question);
  const [slug, setSlug] = useState(item.slug);
  const [answer, setAnswer] = useState(item.answer);
  const [loading, setLoading] = useState(false);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await updateFaqItem(item.id, { question, slug, answer });
      toast.success("Otázka aktualizována");
      setEditOpen(false);
      router.refresh();
    } catch {
      toast.error("Nepodařilo se aktualizovat");
    } finally {
      setLoading(false);
    }
  }

  async function handleTogglePublish() {
    try {
      await updateFaqItem(item.id, { published: !item.published });
      toast.success(item.published ? "Otázka skryta" : "Otázka publikována");
      router.refresh();
    } catch {
      toast.error("Nepodařilo se změnit stav");
    }
  }

  async function handleDelete() {
    try {
      await deleteFaqItem(item.id);
      toast.success("Otázka smazána");
      router.refresh();
    } catch {
      toast.error("Nepodařilo se smazat");
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="ghost" size="icon-sm" />}
        >
          <MoreHorizontalIcon className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            Upravit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleTogglePublish}>
            {item.published ? "Skrýt" : "Publikovat"}
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={handleDelete}
          >
            Smazat
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <form onSubmit={handleUpdate}>
            <DialogHeader>
              <DialogTitle>Upravit otázku</DialogTitle>
              <DialogDescription>
                Upravte otázku a odpověď.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="edit-question">Otázka</Label>
                <Input
                  id="edit-question"
                  required
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="edit-slug">Slug</Label>
                <Input
                  id="edit-slug"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="edit-answer">Odpověď</Label>
                <Textarea
                  id="edit-answer"
                  required
                  rows={4}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Ukládám..." : "Uložit"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
