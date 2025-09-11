"use client";

import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Item = {
  value: string;
  label: string;
};

type Props = {
  items: Item[];
  value: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  emptyText?: string;
};

// FIXME: filtering not working

export function Combobox({
  items,
  value,
  onSelect,
  placeholder = "Cerca",
  emptyText = "Nessun risultato trovato",
}: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="min-w-[200px] w-fit justify-between"
        >
          {value
            ? items.find((item) => item.value === value)?.label
            : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-[200px] rounded-3xl p-0 overflow-hidden">
        <Command>
          <CommandInput placeholder={placeholder} className="h-9" />
          <CommandList className="custom-scrollbar">
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={onSelect}
                >
                  {item.label}
                  {item.value === value && (
                    <Check className="ml-auto text-white" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
