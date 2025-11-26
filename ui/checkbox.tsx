"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "./utils";

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

function Checkbox({
  className,
  checked,
  onCheckedChange,
  disabled,
  ...props
}: CheckboxProps) {
  const [isChecked, setIsChecked] = React.useState(checked || false);

  React.useEffect(() => {
    if (checked !== undefined) {
      setIsChecked(checked);
    }
  }, [checked]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked;
    setIsChecked(newChecked);
    onCheckedChange?.(newChecked);
  };

  return (
    <div className="relative inline-flex">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleChange}
        disabled={disabled}
        className="sr-only peer"
        {...props}
      />
      <div
        className={cn(
          "peer border bg-input-background peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:border-primary peer-focus-visible:border-ring peer-focus-visible:ring-ring/50 peer-aria-invalid:ring-destructive/20 peer-aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-all outline-none peer-focus-visible:ring-[3px] peer-disabled:cursor-not-allowed peer-disabled:opacity-50 flex items-center justify-center cursor-pointer",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
      >
        {isChecked && <Check className="size-3.5 text-current" />}
      </div>
    </div>
  );
}

export { Checkbox };
