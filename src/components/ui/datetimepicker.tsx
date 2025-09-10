"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "./input";
import { Clock } from "iconoir-react";

type Props = {
  date: Date;
  onDateChange: (date: Date | undefined) => void;
  showTime?: boolean;
};

export function DatetimePicker({
  date,
  onDateChange,
  showTime = false,
}: Props) {
  const [open, setOpen] = React.useState(false);

  function handleSelect(date: Date | undefined) {
    onDateChange(date);
    setOpen(false);
  }

  function handleTimeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const timeString = e.target.value;
    if (!timeString) return;

    const [hours, minutes, seconds] = timeString.split(":").map(Number);

    const newDate = new Date(date);
    newDate.setHours(hours, minutes, seconds || 0);

    onDateChange(newDate);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id="date"
          className="justify-between font-normal"
        >
          {date ? date.toLocaleDateString("it-IT") : "Seleziona data"}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto overflow-hidden p-0 rounded-2xl"
        align="start"
      >
        <Calendar
          mode="single"
          selected={date}
          captionLayout="dropdown"
          onSelect={handleSelect}
          defaultMonth={date}
        />
        {showTime && (
          <div className="flex justify-center gap-2 border-t p-3">
            <div className="pointer-events-none flex items-center justify-center peer-disabled:opacity-50">
              <Clock className="size-7" aria-hidden="true" />
            </div>
            <Input
              type="time"
              step="1"
              defaultValue={date.toLocaleTimeString("it-IT")}
              onChange={handleTimeChange}
              className="peer appearance-none ps-9 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none px-3 py-2 rounded-xl"
            />
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
