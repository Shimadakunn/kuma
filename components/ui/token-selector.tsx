"use client";
import { useWeb3Auth } from "../../services/web3auth";
import { token } from "@/config/tokenConfig";
import { chain } from "@/config/chainConfig";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { use, useEffect, useState } from "react";

import { ArrowRightLeft, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ChildComponentProps {
    chainChange?: boolean;
    selectedToken: React.Dispatch<React.SetStateAction<string | undefined>>;
  }

const TokenSelector: React.FC<ChildComponentProps> = ({ chainChange, selectedToken }) => {
  const {
    balance,
    sendTransaction,
    chainId,
    connectedChain,
    switchChain,
    updateConnectedChain,
  } = useWeb3Auth();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("ethereum");
  const [valueInitianilized, setValueInitialized] = useState(false);

  const changeChain = (chainId: string) => {
    const chainInfo = Object.keys(chain).find((key) => {
        return chain[key].chainId === chainId;
      });
    switchChain(chainInfo!);
    updateConnectedChain(chainInfo!);
  };


  useEffect(() => {
    if (chainId !== null && (chainChange || chainChange === undefined)) {
      const key = Object.keys(token).find((key) => {
        return token[key].chainId === "0x" + chainId;
      });
      setValue(key!);
      selectedToken(key!);
      setValueInitialized(true);
      console.log("value:"+value);
    }
    else if(chainId !== null && !valueInitianilized && !chainChange){
        setValue("ethereum");
        selectedToken("ethereum");
        setValueInitialized(true);
    }
  }, [chainId]);

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
            {token[value].coin}
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
              <CommandItem
                key={key}
                value={key}
                onSelect={(currentValue) => {
                  setValue(currentValue);
                  if(chainChange || chainChange === undefined){
                      changeChain(token[currentValue].chainId);
                  }
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
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default TokenSelector;
