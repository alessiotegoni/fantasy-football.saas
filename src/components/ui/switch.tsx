"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-input/80  h-8 w-16 shrink-0 rounded-full border border-transparent transition-all outline-none disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer relative",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          `bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-6 rounded-full ring-0 transition-all
          absolute left-1 top-1/2 -translate-y-1/2 data-[state=checked]:left-[calc(100%-4px-24px)]`
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
