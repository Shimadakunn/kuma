"use client";
import { ProviderContext } from "@/components/provider";
import { Button } from "@/components/ui/button";
import { useContext, useEffect } from "react";

export default function Home() {
  const {logout, userInfo, getUserInfo, accounts,getAccounts, balance, getBalance} = useContext(ProviderContext);
  useEffect(() => {
    getAccounts();
    getUserInfo();
  }, []);
  return(
    <>
      <div>
        <h1 className="font-[Monument] text-5xl tracking-[-0.2rem]">CONNECT AND PLAY</h1>
        <p className="font-extralight tracking-tight">Logged in as {accounts}</p>
        <Button onClick={logout} className="border-2 border-foreground bg-primary text-foreground">Logout</Button>
        <div className="your-element w-28 h-8 bg-primary mt-32 border-foreground border" >
          <p className="pl-4 font-extralight tracking-tight">Balance: {balance}</p>
        </div>
        <div className="your-element w-28 h-8 bg-secondary mt-32 border-foreground border text-black" >
          <p className="pl-4 font-extralight tracking-tight">Balance: {balance}</p>
        </div>
      </div>
    </>
  )
}
