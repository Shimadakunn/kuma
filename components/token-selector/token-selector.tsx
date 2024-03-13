"use client";
import { chain } from "@/config/chainConfig";
import { token } from "@/config/tokenConfig";
import { useWeb3Auth } from "@/services/Web3AuthProviderWithWindow";
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
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";

interface ChildComponentProps {
    selectedToken: React.Dispatch<React.SetStateAction<string | undefined>>;
  }

const TokenSelector: React.FC<ChildComponentProps> = ({selectedToken}) => {
  const {
    connectedChain,
    switchChain,
  } = useWeb3Auth();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("ethereum-arbitrum-sepolia");
  const [valueInitianilized, setValueInitialized] = useState(false);

  useEffect(() => {
    if (connectedChain !== null && !valueInitianilized) {
      const key = Object.keys(token).find((key) => {
        return chain[token[key].network] === connectedChain;
      });
      setValue(key!);
      selectedToken(key!);
      setValueInitialized(true);
    }
  }, [connectedChain]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between text-lg font-[Monument] bg-foreground/90 border-0 text-black"
        >
          <div className="w-full flex items-center justify-center">
            <Image src={`https://cryptofonts.com/img/icons/${token[value].coin.toLowerCase()}.svg`} width={30} height={30} alt={value} className="mr-2"/>
            {token[value].coin}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 text-2xl font-[Monument]">
        <Command>
          <CommandInput placeholder="Search token..."/>
          <CommandEmpty>No framework found.</CommandEmpty>
          <ScrollArea className="h-[200px] rounded-md border p-2">
          <CommandGroup>
            {Object.keys(token).map((key) => (
              <CommandItem
                key={key}
                value={key}
                onSelect={(currentValue) => {
                  setValue(currentValue);
                  switchChain(currentValue);
                  selectedToken(currentValue);
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
                  <Image src={`https://cryptofonts.com/img/icons/${token[key].coin.toLowerCase()}.svg`} width={30} height={30} alt={key} className="mr-2"/>
                  {token[key].coin}
              </CommandItem>
            ))}
          </CommandGroup>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default TokenSelector;
