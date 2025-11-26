"use client";

import * as React from "react";
import { cn } from "./utils";

interface SliderProps {
  className?: string;
  min?: number;
  max?: number;
  step?: number;
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
  disabled?: boolean;
}

function Slider({
  className,
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue,
  onValueChange,
  disabled = false,
}: SliderProps) {
  const [internalValue, setInternalValue] = React.useState<number[]>(
    value || defaultValue || [min]
  );

  const currentValue = value || internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = [Number(e.target.value)];
    if (!value) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  const percentage = ((currentValue[0] - min) / (max - min)) * 100;

  return (
    <div className={cn("relative flex w-full items-center", className)}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={currentValue[0]}
        onChange={handleChange}
        disabled={disabled}
        className="w-full h-4 bg-gray-200 rounded-full appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${percentage}%, hsl(var(--muted)) ${percentage}%, hsl(var(--muted)) 100%)`,
        }}
      />
      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 1rem;
          height: 1rem;
          border-radius: 9999px;
          background: hsl(var(--background));
          border: 2px solid hsl(var(--primary));
          cursor: pointer;
          box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
          transition: all 0.2s;
        }
        input[type="range"]::-webkit-slider-thumb:hover {
          box-shadow: 0 0 0 4px hsl(var(--ring) / 0.5);
        }
        input[type="range"]::-moz-range-thumb {
          width: 1rem;
          height: 1rem;
          border-radius: 9999px;
          background: hsl(var(--background));
          border: 2px solid hsl(var(--primary));
          cursor: pointer;
          box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
          transition: all 0.2s;
        }
        input[type="range"]::-moz-range-thumb:hover {
          box-shadow: 0 0 0 4px hsl(var(--ring) / 0.5);
        }
      `}</style>
    </div>
  );
}

export { Slider };
