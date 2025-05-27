"use client";

import { Check } from "iconoir-react";
import React from "react";
import { cn } from "@/lib/utils";

export interface CheckboxCardProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

export const CheckboxCard = React.forwardRef<
  HTMLInputElement,
  CheckboxCardProps
>(
  (
    { className, label, description, icon, checked, onChange, ...props },
    ref
  ) => {
    return (
      <label
        className={cn(
          "flex items-center p-3 border rounded-xl cursor-pointer transition-colors",
          checked ? "border-primary bg-primary/5" : "border-border bg-muted/30",
          className
        )}
      >
        <input
          type="checkbox"
          className="sr-only"
          ref={ref}
          checked={checked}
          onChange={onChange}
          {...props}
        />
        {icon && <div className="mr-3">{icon}</div>}
        <div className="flex-1">
          <p className={cn("font-medium", checked ? "text-primary" : "")}>
            {label}
          </p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <div
          className={cn(
            "w-5 h-5 rounded-md border flex items-center justify-center",
            checked ? "bg-primary border-primary" : "border-muted-foreground"
          )}
        >
          {checked && <Check className="w-3 h-3 text-primary-foreground" />}
        </div>
      </label>
    );
  }
);
CheckboxCard.displayName = "CheckboxCard";
