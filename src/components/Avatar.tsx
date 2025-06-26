import {
  Avatar as RadixAvatar,
  AvatarFallback,
  AvatarImage,
} from "./ui/avatar";

type Props = {
  imageUrl: string | null | undefined;
  name: string;
  renderFallback: () => React.ReactNode;
  className?: string;
};

export default function Avatar({
  imageUrl,
  name,
  renderFallback,
  className = "",
}: Props) {
  return (
    <RadixAvatar className={className}>
      <AvatarImage
        src={imageUrl ?? ""}
        alt={name}
        className="object-contain"
      />
      <AvatarFallback>{renderFallback()}</AvatarFallback>
    </RadixAvatar>
  );
}
