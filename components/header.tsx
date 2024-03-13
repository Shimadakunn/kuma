"use client";

import { useWeb3Auth } from "@/services/Web3AuthProviderWithWindow";
import { usePathname } from "next/navigation";

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
        <div className="text-secondary">
          {connectedChain.displayName}
          hello
        </div>
      </div>
      
    </header>
  );
};

export default Header;
