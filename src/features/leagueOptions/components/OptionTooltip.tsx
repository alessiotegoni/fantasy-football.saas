import { Button } from "@/components/ui/button";
import { FormDescription, FormLabel } from "@/components/ui/form";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { InfoCircle } from "iconoir-react";

type Props = {
  children?: React.ReactNode;
  tip: string;
  label: string;
  classNames?: {
    label?: string;
    tooltip?: string;
    description?: string;
  };
};

export default function OptionTooltip({
  label,
  tip,
  children,
  classNames,
}: Props) {
  return (
    <>
      <div className="relative w-fit">
        <FormLabel className={cn("mb-3", classNames?.label)}>{label}</FormLabel>
        <Tooltip>
          <TooltipTrigger
            asChild
            className={cn(
              "hidden w-fit hover:bg-transparent absolute -right-10 -top-4 md:block cursor-help",
              classNames?.tooltip
            )}
          >
            <Button variant="ghost" type="button">
              <InfoCircle className="size-4 text-muted-foreground" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tip}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      {children}
      <FormDescription className={cn("md:hidden", classNames?.description)}>
        {tip}
      </FormDescription>
    </>
  );
}
