"use client";

import { Google } from "iconoir-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { loginSchema, LoginSchemaType } from "../schema/loginSchema";
import { login } from "../actions/login";

export default function LoginForm() {
  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: LoginSchemaType) {
    if (form.formState.isSubmitting) return;

    const res = await login(data);
    if (res.error) {
      form.setError("root", { message: res.message });
      return
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="La tua email"
                    className="shadow-primary dark:shadow-none font-semibold"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
                <FormDescription className="mt-2 text-xs text-muted-foreground">
                  Ti invieremo un codice via email per accedere.
                </FormDescription>
              </FormItem>
            )}
          />
        </div>

        <Button variant="gradient">Continua</Button>
      </form>

      <div className="relative flex items-center justify-center my-8">
        <div className="border-t border-border flex-grow"></div>
        <span className="px-4 text-sm text-muted-foreground">oppure</span>
        <div className="border-t border-border flex-grow"></div>
      </div>

      <div className="space-y-3">
        <Button
          className="bg-black hover:bg-black/90
        dark:bg-white dark:hover:bg-white/90 dark:text-black py-3 px-4"
        >
          <Google className="w-5 h-5" />
          <span>Accedi con Google</span>
        </Button>

        <Button className="bg-[#6034b2] hover:bg-[#6441a5] py-3 px-4">
          {/* <Twitch className="w-5 h-5" /> */}
          <span>Accedi con Twitch</span>
        </Button>
      </div>
    </Form>
  );
}
