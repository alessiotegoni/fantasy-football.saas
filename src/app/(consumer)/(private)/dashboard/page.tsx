"use client";

import { useDashboardRoles } from "@/contexts/DashboardRolesProvider";
import Link from "next/link";
import { Shield, Palette, PenSquare } from "lucide-react";
import { getMetadataFromUser } from "@/features/users/utils/user";
import { redirect } from "next/navigation";

export default function DashboardPage() {
  const { user, roles } = useDashboardRoles();

  if (roles.length === 1) redirect(`/dashboard/${roles[0]}`);

  const { name } = getMetadataFromUser(user);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">
        {name} Benvenuto nella tua area privata 👋
      </h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {roles.includes("admin") && (
          <Link href="/dashboard/admin">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
                <Shield /> Admin
              </h3>
              <p className="text-sm text-muted-foreground">
                Manage the application settings and users.
              </p>
            </div>
          </Link>
        )}
        {roles.includes("content-creator") && (
          <Link href="/dashboard/content-creator">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
                <Palette /> Content Creator
              </h3>
              <p className="text-sm text-muted-foreground">
                Create and manage the content of the application.
              </p>
            </div>
          </Link>
        )}
        {roles.includes("redaction") && (
          <Link href="/dashboard/redaction">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
                <PenSquare /> Redaction
              </h3>
              <p className="text-sm text-muted-foreground">
                Write and publish articles and news.
              </p>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
