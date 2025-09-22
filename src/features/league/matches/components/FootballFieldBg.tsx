import Image from "next/image";

export default function FootballFieldBg({ children }: React.PropsWithChildren) {
  return (
    <div
      className="relative min-h-[800px] sm:min-h-[400px] xl:min-h-[500px] rounded-3xl mt-5
    "
    >
      <Image
        src="https://tpeehtrlgmfimvwrswif.supabase.co/storage/v1/object/public/kik-league/app-images/football-field-horizontal.jpeg"
        alt="Football field"
        fill
        className="hidden sm:block rounded-3xl"
        sizes="(min-width: 640px) 100vw"
      />
      <Image
        src="https://tpeehtrlgmfimvwrswif.supabase.co/storage/v1/object/public/kik-league/app-images/football-field-vertical.jpeg"
        alt="Football field"
        fill
        objectFit="cover"
        className="sm:hidden rounded-3xl w-sm"
        sizes="(max-width: 639px) 100vw"
      />
      {children}
    </div>
  );
}
