"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useWeb3Auth } from "../../services/web3auth";
import { use, useEffect, useState } from "react";

import { Copy } from 'lucide-react';

export default function Home() {
  const { provider, user, logout, getPrivateKeys, getAddresses } = useWeb3Auth();
  const [privateKey, setPrivateKey] = useState<string[]>([]);
  const [addresses, setAddresses] = useState<string[]>([]);
  async function pk() {
    const privatekeys = await getPrivateKey();
    setPrivateKey(privatekeys);
  }

  useEffect(() => {
    if(provider){
      const getAdd = async () => {
        const addresses = await getAddresses();
        setAddresses(addresses);
        console.log(user)
      }
      getAdd();
    }
  }, [provider]);
  return(
    <main className="flex items-center justify-center h-full w-full">
        <div className="shadow w-[50vw] p-2 rounded-xl border border-primary/20 space-y-2 tracking-tight">
          <div className='p-1'>
            Profile
          </div>
           <div className="bg-primary/30 rounded-xl p-2 flex space-x-4">
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
                <div className="rounded-lg bg-gray-600 py-1 px-4 flex items-center justify-center">
                  <Image src={`https://cryptofonts.com/img/icons/eth.svg`} width={20} height={20} alt="eth" className="mr-2"/>
                  <div className="truncate w-32">
                    {addresses[0]}
                  </div> 
                  <Copy className="ml-2" size={16}/>
                </div>
                <div className="rounded-lg bg-gray-600 py-1 px-4 flex items-center justify-center">
                <Image src={`https://cryptofonts.com/img/icons/sol.svg`} width={20} height={20} alt="sol" className="mr-2"/>
                  <div className="truncate w-32">
                    {addresses[1]} 
                  </div>
                  <Copy className="ml-2" size={16}/>
                </div>
                <div className="rounded-lg bg-gray-600 py-1 px-4 flex items-center justify-center">
                  <Image src={`https://cryptofonts.com/img/icons/xtz.svg`} width={20} height={20} alt="xtz" className="mr-2"/>
                  <div className="truncate w-32">
                    {addresses[2]} 
                  </div>
                  <Copy className="ml-2" size={16}/>
                </div>
              </div>
            </div>
           </div>
           <div className="bg-primary/30 rounded-xl p-2 flex space-x-4">
            <Button onClick={logout} variant="destructive">Logout</Button>
           </div>
        </div>
      </main>

        // <p className="font-light">EVM Address <span className="font-bold">{addresses[0]}</span></p>
        // <p className="font-light">SOL Adress <span className="font-bold">{addresses[1]}</span></p>
        // <p className="font-light">Email: <span className="font-bold">{user.email}</span></p>
        // {/* <div className="font-extralight tracking-tight">{privateKey}</div> */}
        // <Button onClick={logout} className="border-2 border-foreground bg-primary text-foreground">Logout</Button>
        // <Button onClick={pk} className="border-2 border-foreground bg-primary text-foreground">Private key</Button>
        // <div>{privateKey[0]}</div>
        // <div>{privateKey[1]}</div>
  )
}
