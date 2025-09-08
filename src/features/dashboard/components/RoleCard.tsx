import { Role } from "@/contexts/DashboardRolesProvider";
import { Href } from "@/utils/helpers";
import Link from "next/link";

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
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <Icon className="size-7 mb-2" />
        <div>
        <h3 className="text-2xl font-semibold leading-none tracking-tight">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </div>
    </Link>
  );
}
