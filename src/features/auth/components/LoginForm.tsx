"use client";

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
import { loginSchema, LoginSchemaType, oauthProviders } from "../schema/login";
import { login } from "../actions/login";
import { useRouter, useSearchParams } from "next/navigation";
import { useEmailLogin } from "@/hooks/useLoginEmail";
import SubmitButton from "@/components/SubmitButton";
import useActionToast from "@/hooks/useActionToast";
import SocialLogin from "./SocialLogin";
import { useTransition } from "react";
import { Href } from "@/utils/helpers";

export default function LoginForm() {
  const toast = useActionToast();

  const { email, saveEmail } = useEmailLogin();

  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      type: "email",
      email,
    },
  });

  function changeLoginType(type: LoginSchemaType["type"] = "email") {
    form.setValue("type", type);
  }

  function emailLogin(data: LoginSchemaType) {
    startTransition(async () => {
      const res = await login(data, { redirectUrl: searchParams.get("next") });
      if (res.error) toast(res);

      if (data.type === "email") saveEmail(data.email);

      if (!res.error) {
        router.push(
          res.data.url as Href
        );
      }
    });
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(emailLogin)} className="space-y-6">
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
          <SubmitButton
            isLoading={isPending}
            loadingText="Invio codice"
            variant="gradient"
            disabled={!form.watch("email")}
            onClick={changeLoginType.bind(null, "email")}
          >
            Continua
          </SubmitButton>
        </form>
      </Form>

      <div className="relative flex items-center justify-center my-8">
        <div className="border-t border-border flex-grow"></div>
        <span className="px-4 text-sm text-muted-foreground">oppure</span>
        <div className="border-t border-border flex-grow"></div>
      </div>

      <div className="space-y-3">
        {oauthProviders.map((provider) => (
          <SocialLogin
            key={provider}
            provider={provider}
            onClick={changeLoginType.bind(null, provider)}
          />
        ))}
      </div>
    </>
  );
}
