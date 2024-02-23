"use client";
import { fiat } from "@/config/fiatConfig";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { use, useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";

interface ChildComponentProps {
    selectedFiat: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const SimpleTokenSelector: React.FC<ChildComponentProps> = ({selectedFiat}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("eur");

  useEffect(() => {
    selectedFiat(value);
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between text-lg font-[Monument] bg-foreground/90 border-0 text-black"
        >
            {value ? <div className="w-full flex items-center justify-center">
            <Image src={`https://cdn.onramper.com/icons/fiats/${fiat[value].coin.toLowerCase()}.svg`} width={30} height={30} alt={value} className="mr-2"/>
            {fiat[value].coin}
          </div> : <div className="text-sm">Select token</div>}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 text-2xl font-[Monument]">
        <Command>
        <CommandInput placeholder="Search token..."/>
          <CommandEmpty>No framework found.</CommandEmpty>
          <ScrollArea className="h-max-[200px] rounded-md border p-2">
          <CommandGroup>
            {Object.keys(fiat).map((key) => (
                <CommandItem
                  key={key}
                  value={key}
                  onSelect={(currentValue) => {
                    setValue(currentValue);
                    selectedFiat(currentValue);
                    setOpen(false);
                  }}
                  className="w-[250px] text-base"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === key ? "opacity-100" : "opacity-0"
                    )}
                  />
                    <Image src={`https://cdn.onramper.com/icons/fiats/${fiat[key].coin.toLowerCase()}.svg`} width={30} height={30} alt={key} className="mr-2"/>
                    {fiat[key].coin}
                </CommandItem>
            ))}
          </CommandGroup>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SimpleTokenSelector;
