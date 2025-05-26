"use client";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Upload,
  Trophy,
  Lock,
  Globe,
  Copy,
  Refresh,
  Xmark,
} from "iconoir-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/SubmitButton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, useEffect, useState } from "react";
import {
  createLeagueSchema,
  type CreateLeagueSchema,
  isValidImage,
  JOIN_CODE_LENGTH,
  MAX_IMAGE_SIZE,
} from "../schema/league";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createLeague } from "../actions/league";
import { PasswordInput } from "./PasswordInput";

export default function CreateLeagueForm() {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const form = useForm<CreateLeagueSchema>({
    resolver: zodResolver(createLeagueSchema),
    defaultValues: {
      name: "",
      description: null,
      password: "",
      image: null,
      visibility: "private",
    },
  });

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

  async function onSubmit(data: CreateLeagueSchema) {
    const res = await createLeague(data);

    if (res.error) toast.error(res.message);
  }

  const leagueType = form.watch("visibility");

  useEffect(() => {
    if (leagueType === "public") {
      form.setValue("joinCode", "");
      return;
    }

    const code = generateJoinCode();
    form.setValue("joinCode", code);
  }, [leagueType]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome della Lega</FormLabel>
              <FormControl>
                <Input placeholder="Es. Champions League" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo della Lega</FormLabel>
              <div className="flex items-center space-x-4">
                <div className="relative w-16 h-16 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                  {previewImage ? (
                    <Image
                      src={previewImage || "/placeholder.svg"}
                      alt="Logo preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <Trophy className="w-8 h-8 text-muted-foreground" />
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
                          setPreviewImage(null);
                        }}
                        className="rounded-lg h-[38px]"
                        // asChild
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

        <FormField
          control={form.control}
          name="visibility"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo di Lega</FormLabel>
              <div className="grid grid-cols-2 gap-4">
                <label
                  className={`flex flex-col items-center p-4 border rounded-xl cursor-pointer transition-colors ${
                    field.value === "private"
                      ? "border-primary bg-primary/5"
                      : "border-border bg-muted/30"
                  }`}
                >
                  <input
                    type="radio"
                    value="private"
                    checked={field.value === "private"}
                    onChange={() => field.onChange("private")}
                    className="sr-only"
                  />
                  <Lock
                    className={`w-6 h-6 mb-2 ${
                      field.value === "private"
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      field.value === "private" ? "text-primary" : ""
                    }`}
                  >
                    Privata
                  </span>
                  <span className="text-xs text-center text-muted-foreground mt-1">
                    Solo su invito
                  </span>
                </label>

                <label
                  className={`flex flex-col items-center p-4 border rounded-xl cursor-pointer transition-colors ${
                    field.value === "public"
                      ? "border-primary bg-primary/5"
                      : "border-border bg-muted/30"
                  }`}
                >
                  <input
                    type="radio"
                    value="public"
                    checked={field.value === "public"}
                    onChange={() => field.onChange("public")}
                    className="sr-only"
                  />
                  <Globe
                    className={`w-6 h-6 mb-2 ${
                      field.value === "public"
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      field.value === "public" ? "text-primary" : ""
                    }`}
                  >
                    Pubblica
                  </span>
                  <span className="text-xs text-center text-muted-foreground mt-1">
                    Aperta a tutti
                  </span>
                </label>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {leagueType === "private" && <PasswordInput />}

        <FormField
          control={form.control}
          name="description"
          render={({ field: { value, onChange, ...restField } }) => (
            <FormItem>
              <FormLabel>Descrizione</FormLabel>
              <FormControl>
                <Textarea
                  className="w-full bg-background border border-border rounded-xl py-4 px-4 focus:outline-none focus:border-primary transition-colors min-h-[100px] resize-none"
                  placeholder="Descrivi la tua lega..."
                  value={value || ""}
                  onChange={(e) => onChange(e.target.value || null)}
                  {...restField}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <SubmitButton loadingText="Creando lega" variant="gradient">
          Crea lega
        </SubmitButton>
      </form>
    </Form>
  );
}

function handleSetImage(
  setImage: (file: File) => void,
  e: ChangeEvent<HTMLInputElement>
) {
  const file = e.target.files?.item(0);
  if (file) setImage(file);
}

function generateJoinCode() {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < JOIN_CODE_LENGTH; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

async function handleCopyCode(code: string) {
  try {
    await navigator.clipboard.writeText(code);
    toast.success("Codice copiato");
  } catch (err) {
    console.error(err);
    toast.error("Errore, codice non copiato");
  }
}
