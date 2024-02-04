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

const TokenSelector = () => {
    const { balance, sendTransaction, chainId, connectedChain, switchChain,updateConnectedChain } = useWeb3Auth();
  const [amountSend, setAmountSend] = useState<number>();
  const [amountReceive, setAmountReceive] = useState<string>();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("ethereum");

  const changeChain = (chainId: string) => {
    const chainInfo = Object.keys(chain).find((key) => {
      if (chain[key].chainId === chainId) {
        return key
      };
    });
    switchChain(chainInfo!);
    updateConnectedChain(chainInfo!);
  };

  const click = () => {
    const key = Object.keys(token).find((key) => {
        return token[key].chainId === "0x"+chainId;
      });
    console.log("key: "+key);
    setValue(key!);
    };

  useEffect(() => {
    if(chainId !== null){
        console.log("chainId: "+chainId);
        const key = Object.keys(token).find((key) => {
            return token[key].chainId === "0x"+chainId;
        });
        setValue(key!);
    };
  },[chainId]);

    return ( 
        <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="p-3 justify-between text-2xl font-[Monument] bg-foreground/90 border-0 text-black"
                >
                  <span className="w-full truncate">
                    {token[value].coin}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[10vw] p-0 text-2xl font-[Monument]">
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
                          changeChain(token[currentValue].chainId);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === key
                              ? "opacity-100"
                              : "opacity-0"
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
}

export default TokenSelector;