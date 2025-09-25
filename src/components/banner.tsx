"use client";

import { useState, type ReactNode } from "react";
import { XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface BannerProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  children?: ReactNode;
  onClose?: () => void;
  closeButton?: boolean;
}

export function Banner({
  icon,
  title,
  description,
  children,
  onClose,
  closeButton = true,
}: BannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  function handleClose() {
    setIsVisible(false);
    onClose?.();
  }
  
  return (
    <div className="dark bg-muted text-foreground px-4 py-3">
      <div className="flex gap-2 md:items-center">
        <div className="flex grow gap-3 md:items-center">
          {icon && (
            <div
              className="bg-primary/15 flex size-9 shrink-0 items-center justify-center rounded-full max-md:mt-0.5"
              aria-hidden="true"
            >
              {icon}
            </div>
          )}
          <div className="flex grow flex-col justify-between gap-3 md:flex-row md:items-center">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">{title}</p>
              {description && (
                <p className="text-muted-foreground text-sm">{description}</p>
              )}
            </div>
            {children && (
              <div className="flex items-center gap-2 max-md:flex-wrap">
                {children}
              </div>
            )}
          </div>
        </div>
        {closeButton && (
          <Button
            variant="ghost"
            className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
            onClick={handleClose}
            aria-label="Close banner"
            aria-hidden={!isVisible}
          >
            <XIcon
              size={16}
              className="opacity-60 transition-opacity group-hover:opacity-100"
              aria-hidden="true"
            />
          </Button>
        )}
      </div>
    </div>
  );
}
