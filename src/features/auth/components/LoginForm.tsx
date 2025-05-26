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
import {
  loginSchema,
  LoginSchemaType,
  oauthProviders,
  OauthProviderType,
} from "../schema/login";
import { login } from "../actions/login";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useEmailLogin } from "@/hooks/useLoginEmail";
import SubmitButton from "@/components/SubmitButton";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export default function LoginForm() {
  const { getEmail, saveEmail } = useEmailLogin();

  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      type: "email",
      email: getEmail() ?? "",
    },
  });

  function changeLoginType(
    type: LoginSchemaType["type"] = "email",
    shouldTrigger: boolean = false
  ) {
    form.setValue("type", type);
    if (shouldTrigger) form.trigger();
  }

  async function emailLogin(data: LoginSchemaType) {
    const res = await login(data, { redirectUrl: searchParams.get("next") });

    if (res.error) {
      toast.error(res.message);
      return;
    }

    if (data.type === "email") saveEmail(data.email);

    router.push(res.url);
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
            loadingText="Invio codice"
            variant="gradient"
            onClick={changeLoginType.bind(null, "email", false)}
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
          <form
            action={socialLogin.bind(null, router, searchParams.get("next"))}
            key={provider}
          >
            <input type="hidden" name="provider" value={provider} />
            <SubmitButton
              loadingText={`Accedo con ${provider}`}
              className={cn(
                "py-3 px-4",
                oauthProvidersStyles[provider].className
              )}
              onClick={changeLoginType.bind(null, provider, false)}
            >
              <img
                src={oauthProvidersStyles[provider].imageUrl}
                width={20}
                height={20}
                alt={provider}
              />
              <p>
                Accedi con <span className="capitalize">{provider}</span>
              </p>
            </SubmitButton>
          </form>
        ))}
      </div>
    </>
  );
}

async function socialLogin(
  router: AppRouterInstance,
  redirectUrl: string | null,
  formData: FormData
) {
  const type = formData.get("provider") as OauthProviderType;

  const res = await login({ type }, { redirectUrl });

  if (res.error) {
    toast.error(res.message);
    return;
  }
  if (res.url) router.push(res.url);
}

const oauthProvidersStyles: Record<
  OauthProviderType,
  { className?: string; imageUrl: string }
> = {
  google: {
    className: `bg-black hover:bg-black/90
        dark:bg-white dark:hover:bg-white/90 dark:text-black py-3 px-4`,
    imageUrl: "",
  },
  twitch: {
    className: `bg-[#6034b2] hover:bg-[#6441a5] py-3 px-4`,
    imageUrl: "",
  },
};
