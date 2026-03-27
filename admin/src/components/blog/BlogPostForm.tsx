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
import { createBlogPost, updateBlogPost } from "@/actions/blog-posts";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

type Category = { id: string; name: string };
type Tag = { id: string; name: string };
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
  videoUrl: string | null;
  voiceOverUrl: string | null;
  metaTitle: string | null;
  metaDesc: string | null;
  tagIds: string[];
  faqs: FaqRef[];
};

type BlogPostFormProps = {
  tenantId: string;
  tenantSlug: string;
  authorId: string;
  categories: Category[];
  tags: Tag[];
  backHref: string;
  initial?: InitialData;
};

export function BlogPostForm({
  tenantId,
  tenantSlug,
  authorId,
  categories,
  tags,
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
  const [videoUrl, setVideoUrl] = useState(initial?.videoUrl ?? "");
  const [voiceOverUrl, setVoiceOverUrl] = useState(initial?.voiceOverUrl ?? "");
  const [metaTitle, setMetaTitle] = useState(initial?.metaTitle ?? "");
  const [metaDesc, setMetaDesc] = useState(initial?.metaDesc ?? "");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    initial?.tagIds ?? []
  );
  const [faqs, setFaqs] = useState<FaqRef[]>(initial?.faqs ?? []);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  function toggleTag(tagId: string) {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
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

    const payload = {
      categoryId,
      title,
      slug: slug || slugify(title),
      excerpt: excerpt || undefined,
      content,
      coverImageId: coverImage?.id,
      videoUrl: videoUrl || undefined,
      voiceOverUrl: voiceOverUrl || undefined,
      metaTitle: metaTitle || undefined,
      metaDesc: metaDesc || undefined,
      tagIds: selectedTagIds.length > 0 ? selectedTagIds : undefined,
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
      {tags.length > 0 && (
        <section className="flex flex-col gap-2">
          <Label>Štítky</Label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const selected = selectedTagIds.includes(tag.id);
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                    selected
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {tag.name}
                </button>
              );
            })}
          </div>
        </section>
      )}

      <Separator />

      {/* Media URLs */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="videoUrl">Video URL</Label>
          <Input
            id="videoUrl"
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
        </div>
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
