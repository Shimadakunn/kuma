"use client";
import { useWeb3Auth } from "@/services/web3auth";
import { chain } from "@/config/chainConfig";
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
  const { connectedChain } = useWeb3Auth();
  const path = usePathname();

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
        <div className="text-secondary">{connectedChain.displayName}</div>
      </div>
    </header>
  );
};

export default Header;
