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
    <Link href={href} className="h-full">
      <div className="h-full rounded-3xl flex flex-col text-center items-center border bg-card text-card-foreground shadow-sm p-6">
        <Icon className="shrink-0 size-9 mb-3" />
        <div className="flex flex-col h-full gap-2">
          <h3 className="text-2xl font-semibold leading-none tracking-tight grow">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </div>
    </Link>
  );
}
