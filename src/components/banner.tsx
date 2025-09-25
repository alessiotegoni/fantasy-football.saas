"use client";

import { useState, type ReactNode } from "react";
import { Xmark } from "iconoir-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface BannerProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  children?: ReactNode;
  onClose?: () => void;
  closeButton?: boolean;
  className?: string;
}

export function Banner({
  icon,
  title,
  description,
  children,
  onClose,
  closeButton = false,
  className,
}: BannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  function handleClose() {
    setIsVisible(false);
    onClose?.();
  }

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "relative flex flex-col md:flex-row justify-between items-center p-6 md:p-4 bg-muted/30 rounded-3xl",
        className
      )}
    >
      {closeButton && (
        <Button
          variant="destructive"
          className="group size-8 shrink-0 p-0 rounded-2xl self-end md:self-center md:mr-3"
          onClick={handleClose}
          aria-label="Close banner"
        >
          <Xmark className="size-5" />
        </Button>
      )}
      <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 mb-6 md:mb-0">
        {icon && (
          <div className="size-16 bg-muted rounded-full flex items-center justify-center shrink-0">
            {icon}
          </div>
        )}
        <div className="text-center md:text-start">
          <h3 className="text-lg md:text-xl font-heading">{title}</h3>
          {description && (
            <p className="text-sm md:text-base text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}
