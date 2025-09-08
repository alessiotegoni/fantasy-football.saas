import Link from "next/link";
import { Button } from "./ui/button";

type Props = {
  href: __next_route_internal_types__.RouteImpl<string>;
  children: React.ReactNode;
} & React.ComponentProps<typeof Button>;

export default function LinkButton({ href, children, ...props }: Props) {
  return (
    <Button asChild {...props}>
      <Link href={href}>{children}</Link>
    </Button>
  );
}
