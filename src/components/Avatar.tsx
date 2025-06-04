import { cn } from "@/lib/utils";
import {
  Avatar as RadixAvatar,
  AvatarFallback,
  AvatarImage,
} from "./ui/avatar";

type Props = {
  imageUrl: string | null | undefined;
  name: string;
  renderFallback: () => React.ReactNode;
  size?: number;
  className?: string;
};

export default function Avatar({
  imageUrl,
  name,
  renderFallback,
  size,
  className,
}: Props) {
  return (
    <RadixAvatar className={`size-${size}`}>
      <AvatarImage
        src={imageUrl ?? ""}
        alt={name}
        className={cn("object-contain", className)}
      />
      <AvatarFallback>{renderFallback()}</AvatarFallback>
    </RadixAvatar>
  );
}
