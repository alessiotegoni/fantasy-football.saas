type Props = {
  className?: string;
  role: { name: string };
};

export default function PlayerFallbackImage({ role, className }: Props) {
  const attr = IMAGES[role.name] ?? DEFAULT_PLAYER_IMAGE;

  return <img {...attr} className={className} />;
}

type ImageAttributes = { src: string; alt: string };

const IMAGES: Record<string, ImageAttributes> = {
  Presidente: {
    src: "https://tpeehtrlgmfimvwrswif.supabase.co/storage/v1/object/public/kik-league/players-avatars/president-placeholder.png",
    alt: "president placeholder",
  },
  Portiere: {
    src: "https://tpeehtrlgmfimvwrswif.supabase.co/storage/v1/object/public/kik-league/players-avatars/goalkeeper-placeholder-2.png",
    alt: "goalkeeper placeholder",
  },
};

const DEFAULT_PLAYER_IMAGE: ImageAttributes = {
  src: "https://tpeehtrlgmfimvwrswif.supabase.co/storage/v1/object/public/kik-league/players-avatars/player-placeholder-2.png",
  alt: "player placeholder",
};
