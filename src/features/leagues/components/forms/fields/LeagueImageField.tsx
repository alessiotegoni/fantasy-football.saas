"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TooltipProvider } from "@/components/ui/tooltip";
import FormFieldTooltip from "@/components/FormFieldTooltip";
import { useFormContext } from "react-hook-form";
import { useState } from "react";
import {
  isValidImage,
  MAX_IMAGE_SIZE,
} from "@/features/leagues/schema/leagueBase";
import Image from "next/image";
import { Trophy, Upload, Xmark } from "iconoir-react";
import { Button } from "@/components/ui/button";

export default function LeagueImageField({
  leagueImageUrl,
}: {
  leagueImageUrl?: string | null;
}) {
  const [previewImage, setPreviewImage] = useState<string | null>(
    () => leagueImageUrl ?? null
  );

  const form = useFormContext<{ image: File | null }>();

  function handleSetPreviewImg(file: File) {
    if (!isValidImage(file)) {
      setPreviewImage(null);
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreviewImage(result);
    };
    reader.readAsDataURL(file);
  }

  return (
    <TooltipProvider>
      <FormFieldTooltip
        label="Logo della Lega"
        tip="Il logo della lega e' visualizzabile da tutti gli utenti"
      >
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center space-x-4">
                <div className="relative size-16 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                  {previewImage ? (
                    <Image
                      src={previewImage || "/placeholder.svg"}
                      alt="Logo preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <Trophy className="size-8 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex gap-1">
                    <label
                      htmlFor="image_upload"
                      className="flex items-center justify-center w-full py-2 px-4 border border-border rounded-lg cursor-pointer bg-muted/30 hover:bg-muted transition-colors mb-1"
                    >
                      <Upload className="size-4 mr-2" />
                      <span className="text-sm">Carica logo</span>
                      <FormControl>
                        <Input
                          id="image_upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleSetImage.bind(null, (file: File) => {
                            handleSetPreviewImg(file);
                            field.onChange(file);
                          })}
                        />
                      </FormControl>
                    </label>
                    {field.value instanceof File && (
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        onClick={() => {
                          field.onChange(null);
                          setPreviewImage(leagueImageUrl ?? null);
                        }}
                        className="rounded-lg h-[38px]"
                      >
                        <Xmark className="size-6" />
                      </Button>
                    )}
                  </div>
                  <div className="sm:flex gap-2">
                    <FormDescription>
                      Formato: JPG, PNG. Max {MAX_IMAGE_SIZE / (1024 * 1024)}MB
                    </FormDescription>
                    <FormMessage />
                  </div>
                </div>
              </div>
            </FormItem>
          )}
        />
      </FormFieldTooltip>
    </TooltipProvider>
  );
}

function handleSetImage(
  setImage: (file: File) => void,
  e: React.ChangeEvent<HTMLInputElement>
) {
  const file = e.target.files?.item(0);
  if (file) setImage(file);
}
