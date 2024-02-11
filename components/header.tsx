"use client";
import { useWeb3Auth } from "../services/web3auth";
import { chain } from "../config/chainConfig";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Header = () => {
  const { balance, chainId, switchChain, connectedChain } = useWeb3Auth();
  const path = usePathname();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  return (
    <header className="w-full h-[10vh] flex items-center justify-between border-b border-foreground p-8">
      <div className="font-[Monument] text-4xl tracking-tight">
        {path === "/"
          ? "DASHBOARD"
          : path === "/swap"
          ? "SWAP"
          : path === "/stake"
          ? "STAKE"
          : path === "/profile"
          ? "PROFILE"
          : path === "/send"
          ? "SEND / RECEIVE"
          : path === "/onramp"
          ? "ONRAMP"
          : ""}
      </div>
      <div className="font-[Monument] text-2xl tracking-tight flex space-x-2 items-center justify-center">
        <div className="font-light text-secondary">{chainId}</div>
        {/* <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between"
            >
              <span className="w-full truncate">
                {value
                  ? value
                  : connectedChain.chainNamespace}
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search chain..." />
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {Object.keys(chain).map((option) => (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={(currentValue) => {
                      setValue(currentValue);
                      setOpen(false);
                      switchChain(option);
                      updateConnectedChain(option);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option.toLowerCase() ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover> */}
        <div className="truncate max-w-[7vw]">{balance}</div>
        <div className="font-light text-secondary">{connectedChain.ticker}</div>
      </div>
    </header>
  );
};

export default Header;
