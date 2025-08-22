import { Slider as RadixSlider } from "@/components/ui/slider";
import { NumberInputProps } from "./ui/number-input";
import { cn } from "@/lib/utils";

type Props = {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  className?: string;
  renderNumberInput?: (props: NumberInputProps) => React.ReactNode;
};

export default function Slider({
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
  className,
  renderNumberInput,
}: Props) {
  return (
    <div className="space-y-3">
      <RadixSlider
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(value) => onChange(value[0])}
        className={cn("w-full", className)}
      />
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{min}</span>
        {renderNumberInput?.({
          value,
          onChange,
          min,
          max,
          containerClassName: "my-3",
        }) ?? (
          <span className="font-medium text-white">
            {value} {unit}
          </span>
        )}
        <span>{max}</span>
      </div>
    </div>
  );
}
