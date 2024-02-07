"use client";
import { token } from "@/config/tokenConfig";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";

interface ChildComponentProps {
  otherToken: string | undefined;
  selectedToken: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const SimpleTokenSelector: React.FC<ChildComponentProps> = ({otherToken,selectedToken}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between text-2xl font-[Monument] bg-foreground/90 border-0 text-black"
        >
          <span className="w-full truncate">
            {value ? token[value].coin : "Select token"}
        </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[7vw] p-0 text-2xl font-[Monument]">
        <Command>
          {/* <CommandInput placeholder="Search token..." /> */}
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup>
            {Object.keys(token).map((key) => (
              otherToken !== key && (
                <CommandItem
                  key={key}
                  value={key}
                  onSelect={(currentValue) => {
                    setValue(currentValue);
                    selectedToken(currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === key ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {token[key].coin}
                </CommandItem>
              )
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SimpleTokenSelector;
