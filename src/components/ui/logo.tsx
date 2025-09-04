import { cn } from "@/lib/utils";
import Image from "next/image";

type Props = {
  className?: string;
  withImage?: boolean;
  withText?: boolean;
};

export default function Logo({
  className,
  withImage = true,
  withText = true,
}: Props) {
  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      {withImage && (
        <Image
          alt="kik league"
          src="https://tpeehtrlgmfimvwrswif.supabase.co/storage/v1/object/public/kik-league/app-images/kikleague-logo.png"
          width={150}
          height={150}
          priority
        />
      )}
      {withText && (
        <div className="font-heading text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          K fantasy
        </div>
      )}
    </div>
  );
}
