"use client";
import { useWeb3Auth } from "../../services/web3auth";
import TokenSelector from "@/components/token-selector/token-selector";
import { token } from "@/config/tokenConfig";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

import { Send } from 'lucide-react';

export default function Home() {
  const { balance, sendTransaction, getTokenBalance } = useWeb3Auth();

  const [tokenSend, setTokenSend] = useState<string>();
  const [amount, setAmount] = useState<number>();
  const [toAddress, setToAddress] = useState<string>();

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    console.log("loading "+loading)
  }, [loading]);

  return(
      <main className="flex items-center justify-center h-full w-full">
        <div className="shadow w-[30vw] p-2 rounded-xl border border-primary/20 space-y-2 tracking-tight">
            <div className='p-1'>
              Send Token
            </div>
            <div className='relative'>
              <Input className="h-[20vh] border-0 text-4xl font-medium bg-primary/15" placeholder="0" 
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
              />
              <div className='absolute top-1/2 right-4 -translate-y-1/2 text-2xl font-[Monument]'>
                <TokenSelector selectedToken={setTokenSend}/>
              </div>
              <div className='absolute bottom-2 right-4 font-semibold text-gray-500 text-sm'>
                Solde:{ balance } <span className="text-secondary/80 cursor-pointer" onClick={()=>setAmount(parseFloat(balance!))}>Max</span>
              </div>
              <div className='absolute top-2 left-2 font-semibold text-gray-500 text-sm'>
                You send
              </div>
            </div>
            <div className='relative'>
              <Input className="h-[10vh] border-0 text-xl font-medium bg-primary/15" placeholder="0x..."
                value={toAddress}
                type="text"
                onChange={(e) => setToAddress(e.target.value)}
              />
              <div className='absolute top-2 left-2 font-semibold text-gray-500 text-xs '>
                To
              </div>
            </div>
          <Button className="bg-foreground rounded-xl font-extrabold hover:bg-foreground/90 text-lg w-full h-[7vh] tracking-widest" 
            onClick={async () => {await sendTransaction(amount!, toAddress!, setLoading);}}
            disabled={ !amount || !toAddress || parseFloat(balance!) < amount || loading}
          >
            SEND<Send className="ml-1" size={20}/>
          </Button>
        </div>
      </main>
  )
}
