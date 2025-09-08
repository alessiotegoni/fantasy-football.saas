import { Role } from "@/contexts/DashboardRolesProvider";
import Link from "next/link";

export type RoleInfo = {
  role: Role;
  href: __next_route_internal_types__.RouteImpl<string>;
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
        <h3 className="text-2xl font-semibold leading-none tracking-tight">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
    </Link>
  );
}
