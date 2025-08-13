import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "placeholder:text-muted-foreground aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content text-base shadow-xs transition-[color,box-shadow] outline-nonedisabled:cursor-not-allowed disabled:opacity-50  w-full bg-background border border-border rounded-xl py-4 px-4 focus:outline-none focus:border-primary min-h-28 resize-none selection:bg-primary selection:text-primary-foreground",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
