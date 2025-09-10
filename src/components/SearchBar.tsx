"use client";

import { memo, useEffect, useState } from "react";
import { Search } from "iconoir-react";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

type Props = {
  placeholder?: string;
  onSearch: (value: string) => void;
  onResetSearch?: () => void;
  delay?: number;
  className?: string;
  value?: string;
};

function SearchBar({
  placeholder = "Cerca...",
  onSearch,
  delay = 300,
  className,
  value: externalValue,
}: Props) {
  const [value, setValue] = useState(externalValue ?? "");

  useEffect(() => {
    if (externalValue !== undefined) setValue(externalValue);
  }, [externalValue]);

  useEffect(() => {
    if (!value) return

    const timer = setTimeout(() => {
      onSearch(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <div className={cn("relative w-full mb-6", className)}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="pl-10"
      />
    </div>
  );
}

export default memo(SearchBar);
