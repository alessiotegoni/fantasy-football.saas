import Avatar from "@/components/Avatar";
import { cn } from "@/lib/utils";

export default function TeamInfo({
  team,
  size,
  textMuted,
}: {
  team: { imageUrl: string | null; name: string; managerName: string };
  size: "sm" | "lg";
  textMuted: string;
}) {
  const avatarSize = size === "lg" ? "size-12" : "size-10";
  const nameSize = size === "lg" ? "text-base" : "text-sm";
  const managerSize = size === "lg" ? "text-sm" : "text-xs";

  return (
    <div className="flex items-center gap-3">
      <Avatar
        imageUrl={team.imageUrl}
        name={team.name}
        className={avatarSize}
        renderFallback={() => team.name.charAt(0)}
      />
      <div>
        <h3 className={cn("font-semibold", nameSize)}>{team.name}</h3>
        <p className={cn(managerSize, textMuted)}>{team.managerName}</p>
      </div>
    </div>
  );
}
