"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useWeb3Auth } from "@/services/web3auth";

import { Copy } from 'lucide-react';

import { toast } from 'sonner';

export default function Home() {
  const { provider, user, logout, addresses, privateKeys } = useWeb3Auth();

  return(
    <main className="flex items-center justify-center h-full w-full">
        <div className="shadow w-[50vw] p-2 rounded-xl border border-primary/20 space-y-2 tracking-tight">
          <div className='p-1'>
            Profile
          </div>
          
           <div className="bg-primary/30 rounded-xl p-2 flex space-x-4 space-y-2">
            <Image src={`${user.profileImage}`} alt="profile" width={75} height={75} className="rounded-xl"/>
            <div className="w-full flex flex-col justify-between">
              <div className="flex justify-between">
                <div className="text-2xl">
                  {user.name}
                </div>
                <div className="rounded-lg bg-secondary/60 py-1 px-4 font-normal text-sm flex items-center justify-center text-black">
                  {user.verifierId}
                </div>
              </div>
              <div className="w-full justify-around flex font-normal text-sm">
              <Keys address={addresses[0]} privateKey={privateKeys[0]} ticker="eth"/>
              <Keys address={addresses[1]} privateKey={privateKeys[1]} ticker="sol"/>
              <Keys address={addresses[2]} privateKey={privateKeys[2]} ticker="xtz"/>
              <Keys address={addresses[3]} privateKey={privateKeys[3]} ticker="strk"/>
              </div>
            </div>
           </div>
           <div className="bg-primary/30 rounded-xl p-2 flex space-x-4">
            <Button onClick={logout} variant="destructive">Logout</Button>
           </div>
        </div>
      </main>
  )
}

const Keys : React.FC<{address: string, privateKey: string, ticker: string}> = ({address, privateKey,ticker}) => {
  return (
    <div className="rounded-lg bg-gray-600 p-2 flex items-center justify-center">
      <Image src={`https://cryptofonts.com/img/icons/${ticker}.svg`} width={30} height={30} alt="eth" className="mr-2"/>
      <div className="flex items-center justify-center flex-col space-y-2">
        <div className="flex items-center justify-center">
          <div className="truncate w-32">
            {address}
          </div> 
          <Copy className="ml-2 cursor-pointer" size={16} 
            onClick={()=>{
              navigator.clipboard.writeText(address);
              toast.success(ticker+' address copied to clipboard');
            }}/>
        </div>
        <div className="flex items-center justify-center">
          <div className="truncate w-32">
            {privateKey}
          </div> 
          <Copy className="ml-2 cursor-pointer" size={16} 
            onClick={()=>{
              navigator.clipboard.writeText(privateKey);
              toast.success(ticker+' private key copied to clipboard');
            }}/>
        </div>
      </div>
    </div>
  )
}
