"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm, useFormContext } from "react-hook-form";
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
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function LoginForm() {
  const router = useRouter();

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      type: "email",
      email: "",
    },
  });

  async function onSubmit(data: LoginSchemaType) {
    // if (form.formState.isSubmitting) return;

    console.log("login entry client");

    const res = await login(data);

    console.log(res);

    if (res.error) {
      form.setError("root", { message: res.message });
      return;
    }

    const url = data.type === "email" ? "/auth/verify-otp" : res.url;
    if (url) router.push(url);
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

        <LoginWithEmailButton />

        <div className="relative flex items-center justify-center my-8">
          <div className="border-t border-border flex-grow"></div>
          <span className="px-4 text-sm text-muted-foreground">oppure</span>
          <div className="border-t border-border flex-grow"></div>
        </div>

        <OauthProvidersButtons />
      </form>
    </Form>
  );
}

const oauthProvidersStyles: Record<
  (typeof oauthProviders)[number],
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

function LoginWithEmailButton() {
  const { handleChangeLoginType } = useChangeLoginType();

  return (
    <Button
      type="submit"
      variant="gradient"
      onClick={handleChangeLoginType.bind(null, "email", false)}
    >
      Continua
    </Button>
  );
}

function OauthProvidersButtons() {

  const { handleChangeLoginType } = useChangeLoginType();

  return (
    <div className="space-y-3">
      {oauthProviders.map((provider) => (
        <Button
          key={provider}
          className={cn("py-3 px-4", oauthProvidersStyles[provider].className)}
          onClick={handleChangeLoginType.bind(null, provider, true)}
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
        </Button>
      ))}
    </div>
  );
}


function useChangeLoginType() {
  const form = useFormContext<LoginSchemaType>();

  function handleChangeLoginType(
    type: LoginSchemaType["type"],
    shouldTrigger: boolean
  ) {
    form.setValue("type", type);
    if (shouldTrigger) form.trigger();
  }

  return { handleChangeLoginType };
}
