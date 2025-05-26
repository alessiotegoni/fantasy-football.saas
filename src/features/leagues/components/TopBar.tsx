import { SidebarTrigger } from "@/components/ui/sidebar";

export function Topbar({ name }: { name: string }) {
  return (
    <header
      className="bg-gradient-to-r from-primary to-secondary w-full
    text-primary-foreground py-4 px-4 flex items-center justify-between z-20 fixed top-0 left-0
    lg:hidden"
    >
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <h1 className="font-heading text-lg">{name}</h1>
      </div>
      {/* <Suspense>
        <UserDropdown variant="topbar" userPromise={getUser()} />
      </Suspense> */}
    </header>
  );
}
