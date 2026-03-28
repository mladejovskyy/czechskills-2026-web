"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { ImageUpload } from "@/components/ui/image-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { XIcon } from "lucide-react";
import { createBlogPost, updateBlogPost } from "@/actions/blog-posts";
import { findOrCreateTag } from "@/actions/tags";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

type Category = { id: string; name: string };
type MediaRef = { id: string; url: string; alt: string };
type FaqRef = { question: string; answer: string };

type InitialData = {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  excerpt: string | null;
  content: string;
  coverImage: MediaRef | null;
  voiceOverUrl: string | null;
  metaTitle: string | null;
  metaDesc: string | null;
  tagNames: string[];
  faqs: FaqRef[];
};

type BlogPostFormProps = {
  tenantId: string;
  tenantSlug: string;
  authorId: string;
  categories: Category[];
  backHref: string;
  initial?: InitialData;
};

export function BlogPostForm({
  tenantId,
  tenantSlug,
  authorId,
  categories,
  backHref,
  initial,
}: BlogPostFormProps) {
  const router = useRouter();
  const isEdit = !!initial;
  const [loading, setLoading] = useState(false);
  const [slugTouched, setSlugTouched] = useState(isEdit);

  const [coverImage, setCoverImage] = useState<MediaRef | null>(
    initial?.coverImage ?? null
  );
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [voiceOverUrl, setVoiceOverUrl] = useState(initial?.voiceOverUrl ?? "");
  const [metaTitle, setMetaTitle] = useState(initial?.metaTitle ?? "");
  const [metaDesc, setMetaDesc] = useState(initial?.metaDesc ?? "");
  const [tagNames, setTagNames] = useState<string[]>(initial?.tagNames ?? []);
  const [tagInput, setTagInput] = useState("");
  const [faqs, setFaqs] = useState<FaqRef[]>(initial?.faqs ?? []);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  function addTags(input: string) {
    const newTags = input
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t && !tagNames.includes(t));
    if (newTags.length > 0) {
      setTagNames((prev) => [...prev, ...newTags]);
    }
    setTagInput("");
  }

  function removeTag(name: string) {
    setTagNames((prev) => prev.filter((t) => t !== name));
  }

  function addFaq() {
    setFaqs((prev) => [...prev, { question: "", answer: "" }]);
  }

  function updateFaq(index: number, field: "question" | "answer", value: string) {
    setFaqs((prev) =>
      prev.map((faq, i) => (i === index ? { ...faq, [field]: value } : faq))
    );
  }

  function removeFaq(index: number) {
    setFaqs((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!categoryId) {
      toast.error("Vyberte kategorii");
      return;
    }
    setLoading(true);

    const resolvedTagIds =
      tagNames.length > 0
        ? await Promise.all(
            tagNames.map(async (name) => {
              const tag = await findOrCreateTag(tenantId, name);
              return tag.id;
            })
          )
        : undefined;

    const payload = {
      categoryId,
      title,
      slug: slug || slugify(title),
      excerpt: excerpt || undefined,
      content,
      coverImageId: coverImage?.id,
      voiceOverUrl: voiceOverUrl || undefined,
      metaTitle: metaTitle || undefined,
      metaDesc: metaDesc || undefined,
      tagIds: resolvedTagIds,
      faqs:
        faqs.length > 0
          ? faqs
              .filter((f) => f.question && f.answer)
              .map((f, i) => ({ ...f, sortOrder: i }))
          : undefined,
    };

    try {
      if (isEdit) {
        await updateBlogPost(initial.id, payload);
        toast.success("Článek aktualizován");
      } else {
        await createBlogPost({ ...payload, tenantId, authorId });
        toast.success("Článek vytvořen");
      }
      router.push(backHref);
      router.refresh();
    } catch {
      toast.error(isEdit ? "Nepodařilo se aktualizovat článek" : "Nepodařilo se vytvořit článek");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-2xl">
      {/* Cover image */}
      <section className="flex flex-col gap-4">
        <ImageUpload
          tenantId={tenantId}
          tenantSlug={tenantSlug}
          folder="blog"
          label="Náhledový obrázek"
          value={coverImage}
          onChange={setCoverImage}
        />
      </section>

      <Separator />

      {/* Basic */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="title">Název</Label>
          <Input
            id="title"
            required
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            required
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugTouched(true);
            }}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Kategorie</Label>
          <Select value={categoryId} onValueChange={(v) => setCategoryId(v ?? "")}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Vyberte kategorii" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="excerpt">Shrnutí</Label>
          <Textarea
            id="excerpt"
            rows={2}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Obsah</Label>
          <RichTextEditor content={content} onChange={setContent} />
        </div>
      </section>

      <Separator />

      {/* Tags */}
      <section className="flex flex-col gap-2">
        <Label>Štítky</Label>
        {tagNames.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tagNames.map((name) => (
              <span
                key={name}
                className="inline-flex items-center gap-1 rounded-full border border-primary bg-primary/10 px-3 py-1 text-sm text-primary"
              >
                {name}
                <button
                  type="button"
                  onClick={() => removeTag(name)}
                  className="ml-0.5 rounded-full p-0.5 hover:bg-primary/20"
                >
                  <XIcon className="size-3" />
                </button>
              </span>
            ))}
          </div>
        )}
        <Input
          placeholder="Zadejte štítky oddělené čárkou..."
          value={tagInput}
          onChange={(e) => {
            const val = e.target.value;
            if (val.endsWith(",")) {
              addTags(val);
            } else {
              setTagInput(val);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && tagInput.trim()) {
              e.preventDefault();
              addTags(tagInput);
            }
          }}
          onBlur={() => {
            if (tagInput.trim()) addTags(tagInput);
          }}
        />
      </section>

      <Separator />

      {/* Media URLs */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="voiceOverUrl">Voice-over URL</Label>
          <Input
            id="voiceOverUrl"
            type="url"
            value={voiceOverUrl}
            onChange={(e) => setVoiceOverUrl(e.target.value)}
          />
        </div>
      </section>

      <Separator />

      {/* SEO */}
      <section className="flex flex-col gap-4">
        <p className="text-sm font-medium">SEO</p>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="metaTitle">Meta title</Label>
          <Input
            id="metaTitle"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="metaDesc">Meta description</Label>
          <Textarea
            id="metaDesc"
            rows={2}
            value={metaDesc}
            onChange={(e) => setMetaDesc(e.target.value)}
          />
        </div>
      </section>

      <Separator />

      {/* FAQs */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">FAQ</p>
          <Button type="button" variant="outline" size="sm" onClick={addFaq}>
            Přidat otázku
          </Button>
        </div>
        {faqs.map((faq, i) => (
          <div key={i} className="flex flex-col gap-2 rounded-lg border p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Otázka {i + 1}</span>
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={() => removeFaq(i)}
              >
                Odebrat
              </Button>
            </div>
            <Input
              placeholder="Otázka"
              value={faq.question}
              onChange={(e) => updateFaq(i, "question", e.target.value)}
            />
            <Textarea
              placeholder="Odpověď"
              rows={2}
              value={faq.answer}
              onChange={(e) => updateFaq(i, "answer", e.target.value)}
            />
          </div>
        ))}
      </section>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading
            ? "Ukládám..."
            : isEdit
              ? "Uložit změny"
              : "Vytvořit článek"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push(backHref)}>
          Zrušit
        </Button>
      </div>
    </form>
  );
}
