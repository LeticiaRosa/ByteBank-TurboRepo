import * as React from "react";
import { CalendarIcon } from "lucide-react";

import { Button } from "./button.js";
import { Label } from "./label.js";
import { Popover, PopoverContent, PopoverTrigger } from "./popover.js";
import { Calendar } from "./calendar.js";

interface DatePickerProps {
  text: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  max?: string;
  className?: string;
}

function Calendar22({
  text,
  value,
  onChange,
  placeholder = "Selecionar data",
  max,
  className,
}: DatePickerProps): React.ReactElement {
  const [open, setOpen] = React.useState(false);

  // Convert string value to Date object avoiding timezone issues
  const parseDate = (dateString: string): Date | undefined => {
    try {
      const [year, month, day] = dateString.split("-").map(Number);
      if (year && month && day) {
        return new Date(year, month - 1, day); // month is 0-indexed
      }
    } catch {
      // fallback
    }
    return undefined;
  };

  const selectedDate = value ? parseDate(value) : undefined;
  console.log(value);
  console.log(selectedDate);

  const maxDate = max ? parseDate(max) : undefined;

  const handleDateSelect = (date: Date | undefined) => {
    if (!onChange) return;

    if (date) {
      try {
        // Convert Date to string in YYYY-MM-DD format (only date, no time)
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const dateString = `${year}-${month}-${day}`;
        onChange(dateString);
      } catch {
        onChange("");
      }
    } else {
      onChange("");
    }
    setOpen(false);
  };

  const formatDate = (dateString: string) => {
    const date = parseDate(dateString);
    if (date) {
      return date.toLocaleDateString("pt-BR");
    }
    return dateString; // fallback to original string if parsing fails
  };

  return (
    <div className={`space-y-2 ${className || ""}`}>
      <Label className="text-sm font-medium text-foreground">{text}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between font-normal"
            type="button"
          >
            {value ? formatDate(value) : placeholder}
            <CalendarIcon className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={(date) => {
              if (!maxDate) return false;

              // Compare dates using only the date part (no time)
              const dateOnly = new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate()
              );
              const maxDateOnly = new Date(
                maxDate.getFullYear(),
                maxDate.getMonth(),
                maxDate.getDate()
              );

              // Disable dates that are after maxDate (future dates)
              return dateOnly > maxDateOnly;
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export { Calendar22 as DatePicker };
