"use client";
import { Button } from "@/components/ui/button";
import { useWeb3Auth } from "../../services/web3auth";
import { useState } from "react";


export default function Home() {
  const { address, logout, getPrivateKey } = useWeb3Auth();
  const [privateKey, setPrivateKey] = useState("");
  async function pk() {
    const privatekey = await getPrivateKey();
    setPrivateKey(privatekey);
  }
  return(
    <>
      <div>
        <h1 className="font-[Monument] text-5xl tracking-[-0.2rem]">CONNECT AND PLAY</h1>
        <p className="font-extralight tracking-tight">Logged in as {address}</p>
        <div className="font-extralight tracking-tight">{privateKey}</div>
        <Button onClick={logout} className="border-2 border-foreground bg-primary text-foreground">Logout</Button>
        <Button onClick={pk} className="border-2 border-foreground bg-primary text-foreground">Private key</Button>
      </div>
    </>
  )
}
