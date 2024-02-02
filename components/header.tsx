"use client";
import { ProviderContext } from "@/components/provider";
import { use, useContext, useEffect} from "react";
import { usePathname } from 'next/navigation';

const Header = () => {
    const {balance, getBalance} = useContext(ProviderContext);
    const path = usePathname();
    useEffect(() => {
        getBalance();
    }, []);
    return ( 
        <header className="w-full h-[10vh] flex items-center justify-between border-b border-foreground p-8">
            <div className='font-[Monument] text-4xl tracking-tight'>
                {path === "/" ? "DASHBOARD" : path === "/swap" ? "SWAP" : path === "/stake" ? "STAKE" : path === "/lend" ? "BORROW / LEND" : path === "/profile" ? "PROFILE" :path === "/send" ? "SEND / RECEIVE" :path === "/onramp" ? "ONRAMP" : ""}
            </div>
            <div className='font-[Monument] text-2xl tracking-tight'>{balance} <span className="font-light text-primary">ETH</span></div>
        </header>
    );
}

export default Header;