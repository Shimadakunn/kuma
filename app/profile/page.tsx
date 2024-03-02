"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useWeb3Auth } from "../../services/web3auth";

import { Copy } from 'lucide-react';

import { toast } from 'sonner';

export default function Home() {
  const { provider, user, logout, getPrivateKeys, getAddresses } = useWeb3Auth();
  const [privateKey, setPrivateKey] = useState<string[]>([]);
  const [addresses, setAddresses] = useState<string[]>([]);
  async function pk() {
    
  }

  useEffect(() => {
    if(provider){
      const getInfo = async () => {
        const addresses = await getAddresses();
        setAddresses(addresses);
        const privatekeys = await getPrivateKeys();
        setPrivateKey(privatekeys);
      }
      getInfo();
    }
  }, [provider]);
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
                <div className="rounded-lg bg-gray-600 p-2 flex items-center justify-center">
                  <Image src={`https://cryptofonts.com/img/icons/eth.svg`} width={30} height={30} alt="eth" className="mr-2"/>
                  <div className="flex items-center justify-center flex-col space-y-2">
                    <div className="flex items-center justify-center">
                      <div className="truncate w-32">
                        {addresses[0]}
                      </div> 
                      <Copy className="ml-2 cursor-pointer" size={16} 
                        onClick={()=>{
                          navigator.clipboard.writeText(addresses[0]);
                          toast.success('EVM address copied to clipboard');
                        }}/>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="truncate w-32">
                        {privateKey[0]}
                      </div> 
                      <Copy className="ml-2 cursor-pointer" size={16} 
                        onClick={()=>{
                          navigator.clipboard.writeText(privateKey[0]);
                          toast.success('EVM private key copied to clipboard');
                        }}/>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg bg-gray-600 p-2 flex items-center justify-center">
                <Image src={`https://cryptofonts.com/img/icons/sol.svg`} width={30} height={30} alt="eth" className="mr-2"/>
                  <div className="flex items-center justify-center flex-col space-y-2">
                    <div className="flex items-center justify-center">
                      <div className="truncate w-32">
                        {addresses[1]}
                      </div> 
                      <Copy className="ml-2 cursor-pointer" size={16} 
                        onClick={()=>{
                          navigator.clipboard.writeText(addresses[1]);
                          toast.success('Solana address copied to clipboard');
                        }}/>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="truncate w-32">
                        {privateKey[1]}
                      </div> 
                      <Copy className="ml-2 cursor-pointer" size={16} 
                        onClick={()=>{
                          navigator.clipboard.writeText(privateKey[1]);
                          toast.success('Solana private key copied to clipboard');
                        }}/>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg bg-gray-600 p-2 flex items-center justify-center">
                <Image src={`https://cryptofonts.com/img/icons/xtz.svg`} width={30} height={30} alt="eth" className="mr-2"/>
                  <div className="flex items-center justify-center flex-col space-y-2">
                    <div className="flex items-center justify-center">
                      <div className="truncate w-32">
                        {addresses[2]}
                      </div> 
                      <Copy className="ml-2 cursor-pointer" size={16} 
                        onClick={()=>{
                          navigator.clipboard.writeText(addresses[2]);
                          toast.success('Tezos address copied to clipboard');
                        }}/>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="truncate w-32">
                        {privateKey[2]}
                      </div> 
                      <Copy className="ml-2 cursor-pointer" size={16} 
                        onClick={()=>{
                          navigator.clipboard.writeText(privateKey[2]);
                          toast.success('Tezos private key copied to clipboard');
                        }}/>
                    </div>
                  </div>
                </div>
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
