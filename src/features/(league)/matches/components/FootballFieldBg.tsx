import Image from "next/image";

export default function FootballFieldBg({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="relative min-h-[600px] sm:min-h-[400px] xl:min-h-[500px] rounded-3xl overflow-hidden
    row-start-1 2xl:row-auto col-span-2 2xl:col-auto">
      <Image
        src="https://tpeehtrlgmfimvwrswif.supabase.co/storage/v1/object/public/kik-league/app-images/football-field-horizontal.jpeg"
        alt="Football field"
        fill
        className="hidden sm:block"
      />
      <Image
        src="https://tpeehtrlgmfimvwrswif.supabase.co/storage/v1/object/public/kik-league/app-images/football-field-vertical.jpeg"
        alt="Football field"
        fill
        objectFit="cover"
        className="sm:hidden"
      />
      {children}
    </div>
  );
}
