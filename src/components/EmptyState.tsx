import { Search } from "iconoir-react";
import { Button } from "./ui/button";

type Props = {
  icon?: React.ElementType;
  title: string;
  description: string;
  renderButton?: () => React.ReactNode;
};

export default function EmptyState({
  icon: Icon = Search,
  title,
  description,
  renderButton,
}: Props) {
  return (
    <div
      className="absolute top-1/2 left-1/2 w-full max-w-[600px] md:max-w-none p-4 -translate-1/2 md:static md:translate-none
      flex flex-col justify-center items-center md:p-8 sm:py-12 md:bg-muted/30 rounded-3xl text-center
    text-sm md:text-base min-h-[300px]"
    >
      <div className="size-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="size-8 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-heading mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
      {renderButton && (
        <Button asChild className="w-fit mt-9 md:mt-7">
          {renderButton()}
        </Button>
      )}
    </div>
  );
}
