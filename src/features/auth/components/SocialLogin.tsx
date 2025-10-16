import useActionToast from "@/hooks/useActionToast";
import { login } from "../actions/login";
import { useRouter, useSearchParams } from "next/navigation";
import { OauthProviderType } from "../schema/login";
import SubmitButton from "@/components/SubmitButton";
import { cn } from "@/lib/utils";
import { Href } from "@/utils/helpers";

export default function SocialLogin({
  onClick,
  provider,
}: {
  provider: OauthProviderType;
  onClick: () => void;
}) {
  const toast = useActionToast();

  const router = useRouter();
  const searchParams = useSearchParams();

  async function handleSubmit(formData: FormData) {
    const type = formData.get("provider") as OauthProviderType;

    const res = await login(
      { type },
      { redirectUrl: searchParams.get("next") }
    );
    if (res.error) toast(res);
    if (res.data?.url) router.push(res.data.url as Href);
  }

  return (
    <form action={handleSubmit} key={provider}>
      <input type="hidden" name="provider" value={provider} />
      <SubmitButton
        loadingText={`Accedo con ${provider}`}
        className={cn("py-3 px-4", oauthProvidersStyles[provider].className)}
        onClick={onClick}
      >
        <img
          src={oauthProvidersStyles[provider].imageUrl}
          width={25}
          height={25}
          alt={provider}
        />
        <p>
          Accedi con <span className="capitalize">{provider}</span>
        </p>
      </SubmitButton>
    </form>
  );
}

const oauthProvidersStyles: Record<
  OauthProviderType,
  { className?: string; imageUrl: string }
> = {
  google: {
    className: `bg-black hover:bg-black/90
        dark:bg-white dark:hover:bg-white/90 dark:text-black py-3 px-4`,
    imageUrl:
      "https://tpeehtrlgmfimvwrswif.supabase.co/storage/v1/object/public/kik-league/app-images/google-logo.png",
  },
  twitch: {
    className: `bg-[#6034b2] hover:bg-[#6441a5] py-3 px-4`,
    imageUrl:
      "https://tpeehtrlgmfimvwrswif.supabase.co/storage/v1/object/public/kik-league/app-images/twitch-logo.png",
  },
};
