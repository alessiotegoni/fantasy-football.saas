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
import { Upload, Trophy, Lock, Globe, Copy, Refresh } from "iconoir-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/SubmitButton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {
  createLeagueSchema,
  type CreateLeagueSchema,
  JOIN_CODE_LENGTH,
} from "../schema/league";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createLeague } from "../actions/league";

export default function CreateLeagueForm() {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const form = useForm<CreateLeagueSchema>({
    resolver: zodResolver(createLeagueSchema),
    defaultValues: {
      name: "",
      image_url: null,
      visibility: "private",
      description: "",
      join_code: "",
    },
  });

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.item(0);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
      };
      reader.readAsDataURL(file);
    }
  }

  async function onSubmit(data: CreateLeagueSchema) {
    await createLeague(data);
  }

  const leagueType = form.watch("visibility");

  function handleSetJoinCode(code: string = generateJoinCode()) {
    form.setValue("join_code", code);
  }

  useEffect(() => {
    if (leagueType === "public") {
      handleSetJoinCode("");
      return;
    }

    handleSetJoinCode();
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
              <label
                htmlFor="image_upload"
                className="flex items-center justify-center w-full py-2 px-4 border border-border rounded-lg cursor-pointer bg-muted/30 hover:bg-muted transition-colors mb-1"
              >
                <Upload className="w-4 h-4 mr-2" />
                <span className="text-sm">Carica logo</span>
                <input
                  id="image_upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
              <FormDescription>Formato: JPG, PNG. Max 2MB</FormDescription>
            </div>
          </div>
        </FormItem>

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

        {leagueType === "private" && (
          <FormField
            control={form.control}
            name="join_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Codice di Invito</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleSetJoinCode.bind(null, generateJoinCode())}
                      title="Rigenera codice"
                    >
                      <Refresh />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleCopyCode.bind(null, field.value)}
                      title="Copia codice"
                    >
                      <Copy />
                    </Button>
                  </div>
                </div>
                <FormDescription>
                  Questo codice verrà generato automaticamente e sarà necessario
                  per invitare altri giocatori
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrizione</FormLabel>
              <FormControl>
                <Textarea
                  className="w-full bg-background border border-border rounded-xl py-4 px-4 focus:outline-none focus:border-primary transition-colors min-h-[100px] resize-none"
                  placeholder="Descrivi la tua lega..."
                  {...field}
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
