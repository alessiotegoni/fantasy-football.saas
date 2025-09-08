import Link from "next/link";
import { Button } from "./ui/button";
import { Href } from "@/utils/helpers";

type Props = {
  href: Href;
  children: React.ReactNode;
} & React.ComponentProps<typeof Button>;

export default function LinkButton({ href, children, ...props }: Props) {
  return (
    <Button asChild {...props}>
      <Link href={href}>{children}</Link>
    </Button>
  );
}
