"use client";

import { usePathname,useRouter } from 'next/navigation';

const Header = () => {
    const path = usePathname();
    return ( 
        <header className="w-full h-[10vh] flex items-center justify-between border-b border-foreground p-8">
            <div className='font-[Monument] text-4xl tracking-tight'>
                {path === "/" ? "DASHBOARD" : path === "/swap" ? "SWAP" : path === "/stake" ? "STAKE" : path === "/lend" ? "LEND" : path === "/profile" ? "PROFILE" : ""}
            </div>
            <div className='font-[Monument] text-2xl tracking-tight'>120 <span className="font-light text-primary">ETH</span></div>
        </header>
    );
}

export default Header;