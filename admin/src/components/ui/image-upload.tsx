"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { uploadImage, deleteImage } from "@/actions/upload";
import { ImagePlusIcon, XIcon, Loader2Icon } from "lucide-react";

type UploadedMedia = {
  id: string;
  url: string;
  alt: string;
};

type ImageUploadProps = {
  tenantId: string;
  tenantSlug: string;
  folder: string;
  label?: string;
  value: UploadedMedia | null;
  onChange: (media: UploadedMedia | null) => void;
};

export function ImageUpload({
  tenantId,
  tenantSlug,
  folder,
  label = "Obrázek",
  value,
  onChange,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [alt, setAlt] = useState(value?.alt ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Vyberte obrázek");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("tenantSlug", tenantSlug);
      formData.set("folder", folder);
      formData.set("alt", alt || file.name);
      formData.set("tenantId", tenantId);

      const media = await uploadImage(formData);
      onChange({ id: media.id, url: media.url, alt: media.alt });
      toast.success("Obrázek nahrán");
    } catch {
      toast.error("Nepodařilo se nahrát obrázek");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleRemove() {
    if (!value) return;
    try {
      await deleteImage(value.id);
      onChange(null);
      setAlt("");
      toast.success("Obrázek odstraněn");
    } catch {
      toast.error("Nepodařilo se odstranit obrázek");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      {value ? (
        <div className="relative w-full max-w-sm overflow-hidden rounded-lg border">
          <Image
            src={value.url}
            alt={value.alt}
            width={400}
            height={225}
            className="h-auto w-full object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon-sm"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <XIcon className="size-4" />
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Alt text"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              className="max-w-xs"
            />
            <Button
              type="button"
              variant="outline"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
            >
              {uploading ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : (
                <ImagePlusIcon className="size-4" />
              )}
              {uploading ? "Nahrávám..." : "Nahrát"}
            </Button>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}
    </div>
  );
}
