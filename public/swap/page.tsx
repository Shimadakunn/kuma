"use client";
import SimpleTokenSelector from "@/components/token-selector/simple-token-selector";
import TokenSelector from "@/components/token-selector/token-selector";
// import { fetchTokenQuote } from "@/lib/sideShift/fetchTokenQuote";
import { CreateShift, fetchTokenQuote } from "@/lib/sideShiftUtils";
import { useWeb3Auth } from "@/services/Web3AuthProviderWithWindow";
import axios from 'axios';

import { chain } from "@/config/chainConfig";
import { token } from "@/config/tokenConfig";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

import { ArrowRightLeft } from "lucide-react";
import { toast } from "sonner";

export default function Home() {
  const {
    connectedChain,
    addresses,
    sendTransaction,
  } = useWeb3Auth();

  const [tokenSend, setTokenSend] = useState<string | undefined>(Object.keys(token).find((key) => {
    return chain[token[key].network] === connectedChain;
  }));
  const [tokenReceive, setTokenReceive] = useState<string>();
  const [amountSend, setAmountSend] = useState<number>();
  const [amountReceive, setAmountReceive] = useState<number>();
  const [quoteLoading, setQuoteLoading] = useState<boolean>(false);
  const [swapLoading, setSwapLoading] = useState<boolean>(false);


  useEffect(() => {
    const fetchQuote = async () => {
      try {
        if(amountSend && tokenSend && tokenReceive && !quoteLoading){
          setQuoteLoading(true);
          const settleAmount = await fetchTokenQuote(tokenSend!, amountSend!, tokenReceive!);
          if (axios.isAxiosError(settleAmount)) {
            setQuoteLoading(false);
            return;
          }
          setAmountReceive(settleAmount);
          setQuoteLoading(false);
        }
      } catch (error) {
        return error;
      }
    };
    fetchQuote();
  }, [amountSend, tokenSend, tokenReceive]);

  return (
    <main className="flex items-center justify-center h-full w-full">
      <div className="shadow w-[30vw] p-2 rounded-xl border border-primary/20 space-y-2 tracking-tight">
        <div className="p-1">Swap Token</div>
        <div className="relative">
          <div className="absolute top-2 left-2 font-semibold text-gray-500 text-sm">
            You send
          </div>
          <Input
            className="h-[15vh] border-0 text-4xl font-medium bg-primary/15"
            placeholder="0"
            type="number"
            value={amountSend}
            onChange={(e) => setAmountSend(parseFloat(e.target.value))}
          />
          <div className="absolute top-1/2 right-4 -translate-y-1/2 text-2xl">
            <TokenSelector selectedToken={setTokenSend}/>
          </div>
          <div className="absolute bottom-2 right-4 font-semibold text-gray-500 text-sm">
            {tokenSend ? "Solde: "+token[tokenSend!].balance : <></>}
            <span
              className="ml-1 text-secondary/80 cursor-pointer"
              onClick={() => setAmountSend(parseFloat(token[tokenSend!].balance!))}
            >
              Max
            </span>
          </div>
        </div>
        <div className="relative">
          <div className="absolute top-2 left-2 font-semibold text-gray-500 text-sm">
            You receive
          </div>
          <div className='h-[15vh] border-0 text-4xl font-medium bg-primary/15 flex items-center justify-start'>
            {quoteLoading ?  <Skeleton className="ml-2 w-36 h-8 bg-gray-600" /> : amountReceive ? <span className="ml-2">{amountReceive}</span> : <span className="ml-2 text-muted-foreground">0</span>}
          </div>
          <div className="absolute bottom-2 right-4 font-semibold text-gray-500 text-sm">
           {tokenReceive ? "Solde: "+ token[tokenReceive!].balance : <></>}
          </div>
          <div className="absolute top-1/2 right-4 -translate-y-1/2 text-2xl font-[Monument]">
            <SimpleTokenSelector otherToken={tokenSend} selectedToken={setTokenReceive}/>
          </div>
        </div>
        <Button
          className="bg-foreground rounded-xl font-extrabold hover:bg-foreground/90 text-lg w-full h-[7vh] tracking-widest"
          onClick={async () => {
            setSwapLoading(true);
            const shiftInfo = await CreateShift(tokenSend!, tokenReceive!,addresses);
            if (axios.isAxiosError(shiftInfo)) {
              setSwapLoading(false);
              return;
            }
            toast("min: "+shiftInfo.depositMin + "deposit address: "+shiftInfo.depositAddress);
            setSwapLoading(false);
          }}
          disabled={ !tokenSend || !amountSend || !tokenReceive || !amountReceive || swapLoading || quoteLoading }
          // || amountSend > parseFloat(token[tokenSend!].balance!)
        >
          SWAP <ArrowRightLeft className="ml-1" size={20} />
        </Button>
      </div>
    </main>
  );
}
