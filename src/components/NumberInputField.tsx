import { ChangeEvent } from "react";
import { Input } from "./ui/input";

type Props = {
  value: number | undefined;
  onChange: (value: number | string) => void;
} & Omit<React.ComponentProps<"input">, "type" | "value" | "onChange">;

export default function NumberInputField({ value, onChange, ...props }: Props) {

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const value = !e.target.value ? "" : Number(e.target.value);
    onChange(value);
  }

  return (
    <Input
      type="number"
      value={value ?? ""}
      onChange={handleChange}
      {...props}
    />
  );
}
