"use client";
import { useWeb3Auth } from "../../services/web3auth";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { address, logout } = useWeb3Auth();
  return(
    <>
      <div>
        <h1 className="font-[Monument] text-5xl tracking-[-0.2rem]">CONNECT AND PLAY</h1>
        <p className="font-extralight tracking-tight">Logged in as {address}</p>
        <Button onClick={logout} className="border-2 border-foreground bg-primary text-foreground">Logout</Button>
      </div>
    </>
  )
}
