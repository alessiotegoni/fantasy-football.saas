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
      className="flex flex-col justify-center items-center p-8 sm:py-12 bg-muted/30 rounded-2xl text-center
    text-sm md:text-base min-h-[300px]"
    >
      <div className="size-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="size-8 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-heading mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
      {renderButton && (
        <Button asChild className="w-fit mt-7">
          {renderButton()}
        </Button>
      )}
    </div>
  );
}
