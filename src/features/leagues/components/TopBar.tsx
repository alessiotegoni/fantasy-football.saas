import { SidebarTrigger } from "@/components/ui/sidebar";

export function Topbar({ leagueName }: { leagueName: string }) {
  return (
    <header
      className="bg-gradient-to-r from-primary to-secondary w-full
    text-primary-foreground py-4 px-4 flex items-center justify-between z-20 fixed top-0 left-0
    lg:hidden"
    >
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <h1 className="font-heading text-lg">{leagueName}</h1>
      </div>
      <div className="flex items-center space-x-4">
        <button className="focus:outline-none" aria-label="Notifications">
          {/* <Bell className="w-6 h-6" /> */}
        </button>
        <button className="focus:outline-none" aria-label="Messages">
          {/* <MessageCircle className="w-6 h-6" /> */}
        </button>
      </div>
    </header>
  );
}
