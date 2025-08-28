"use client";

import NumberInput from "@/components/ui/number-input";

type CustomBidAmountInputProps = {
  value: number;
  onChange: (value: number) => void;
  max: number | undefined;
  min?: number;
  disabled?: boolean;
  containerClassName?: string;
};

export default function CustomBidAmountInput({
  value,
  onChange,
  max,
  min = 1,
  disabled,
  containerClassName,
}: CustomBidAmountInputProps) {
  return (
    <NumberInput
      containerClassName={containerClassName}
      disabled={disabled}
      value={value}
      onChange={onChange}
      min={min}
      max={max}
    />
  );
}
