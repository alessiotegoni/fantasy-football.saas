import { Href } from "@/utils/helpers";
import Link from "next/link";
import { Role } from "../user/utils/roles";

export type RoleInfo = {
  role: Role;
  href: Href;
  icon: React.ElementType;
  title: string;
  description: string;
};

export function RoleCard({
  href,
  icon: Icon,
  title,
  description,
}: Omit<RoleInfo, "role">) {
  return (
    <Link href={href}>
      <div className="h-28 lg:h-full rounded-3xl flex gap-4 lg:gap-0 text-left lg:text-center lg:flex-col justify-center items-center border bg-card text-card-foreground shadow-sm p-6">
        <Icon className="shrink-0 size-7 xs:size-9 lg:size-7 mb-3" />
        <div>
        <h3 className="text-lg xs:text-2xl font-semibold leading-none tracking-tight">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </div>
    </Link>
  );
}
