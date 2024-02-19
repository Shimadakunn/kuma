"use client";
import { Button } from "@/components/ui/button";
import { useWeb3Auth } from "../../services/web3auth";
import { use, useEffect, useState } from "react";


export default function Home() {
  const { provider, user, logout, getPrivateKey, getAddresses } = useWeb3Auth();
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
    <>
      <div>
        <p className="font-light">EVM Address <span className="font-bold">{addresses[0]}</span></p>
        <p className="font-light">SOL Adress <span className="font-bold">{addresses[1]}</span></p>
        <p className="font-light">Email: <span className="font-bold">{user.email}</span></p>
        {/* <div className="font-extralight tracking-tight">{privateKey}</div> */}
        <Button onClick={logout} className="border-2 border-foreground bg-primary text-foreground">Logout</Button>
        <Button onClick={pk} className="border-2 border-foreground bg-primary text-foreground">Private key</Button>
        <div>{privateKey[0]}</div>
        <div>{privateKey[1]}</div>
      </div>
    </>
  )
}
