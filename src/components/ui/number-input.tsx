"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Minus, Plus } from "iconoir-react"

interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: number
  min?: number
  max?: number
  step?: number
  onChange: (value: number) => void
  containerClassName?: string
  error?: string
}

export default function NumberInput({
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  className,
  containerClassName,
  error,
  disabled,
  ...props
}: NumberInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number.parseInt(e.target.value, 10)
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue)
    }
  }

  const increment = () => {
    if (value + step <= max && !disabled) {
      onChange(value + step)
    }
  }

  const decrement = () => {
    if (value - step >= min && !disabled) {
      onChange(value - step)
    }
  }

  return (
    <div className={cn("flex items-center", containerClassName)}>
      <button
        type="button"
        onClick={decrement}
        className={cn(
          "flex items-center justify-center w-8 h-8 rounded-l-xl border border-r-0 border-border bg-muted",
          disabled && "opacity-50 cursor-not-allowed",
        )}
        disabled={disabled || value <= min}
      >
        <Minus className="size-4" />
      </button>
      <input
        type="number"
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={cn(
          "w-16 h-8 text-center border-y border-border focus:outline-none focus:border-primary transition-colors",
          error && "border-destructive",
          disabled && "opacity-50 cursor-not-allowed bg-muted",
          className,
        )}
        {...props}
      />
      <button
        type="button"
        onClick={increment}
        className={cn(
          "flex items-center justify-center w-8 h-8 rounded-r-xl border border-l-0 border-border bg-muted",
          disabled && "opacity-50 cursor-not-allowed",
        )}
        disabled={disabled || value >= max}
      >
        <Plus className="size-4" />
      </button>
    </div>
  )
}
