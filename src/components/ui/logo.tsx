import { cn } from "@/lib/utils";
import Image from "next/image";

type Props = {
  className?: string;
  size?: "small" | "medium" | "large";
  withImage?: boolean;
};

export default function Logo({ className = "", withImage = true }: Props) {
  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      {withImage && (
        <Image
          alt="kik league"
          src="/kikleague-logo.png"
          width={150}
          height={150}
        />
      )}
      <div className="font-heading text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        KikLeague
      </div>
    </div>
  );
}
