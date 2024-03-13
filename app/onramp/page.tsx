"use client";
import FiatSelector from "@/components/token-selector/fiat-selector";
import SimpleTokenSelector from "@/components/token-selector/simple-token-selector";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

import { ArrowRightLeft } from "lucide-react";


export default function Home() {

  const [amountSend, setAmountSend] = useState<number>();
  const [fiatSend, setFiatSend] = useState<string>();
  const [tokenSendQuote, setTokenSendQuote] = useState<number>();
  const [tokenSendQuoteLoading, setTokenSendQuoteLoading] = useState<boolean>(false);

  const [amountReceive, setAmountReceive] = useState<number>();  
  const [tokenReceive, setTokenReceive] = useState<string>();
  const [tokenReceiveQuote, setTokenReceiveQuote] = useState<number>();
  const [tokenReceiveQuoteLoading, setTokenReceiveQuoteLoading] = useState<boolean>(false);

  const [swapLoading, setSwapLoading] = useState<boolean>(false);

  return (
    <main className="flex items-center justify-center h-full w-full">
      <div className="shadow w-[30vw] p-2 rounded-xl border border-primary/20 space-y-2 tracking-tight">
        <div className="p-1">Buy Crypto</div>
        <div className="relative">
          <div className="absolute top-2 left-2 font-semibold text-gray-500 text-sm">
            You spend
          </div>
          <Input
            className="h-[15vh] border-0 text-4xl font-medium bg-primary/15"
            placeholder="0"
            type="number"
            value={amountSend}
            onChange={(e) => setAmountSend(parseFloat(e.target.value))}
          />
          <div className="absolute top-1/2 right-4 -translate-y-1/2 text-2xl">
            <FiatSelector selectedFiat={setFiatSend}/>
          </div>
        </div>
        <div className="relative">
          <div className="absolute top-2 left-2 font-semibold text-gray-500 text-sm">
            You receive
          </div>
          <Input
            className="h-[15vh] border-0 text-4xl font-medium bg-primary/15"
            placeholder="0"
            type="number"
            value={amountReceive ? Number.parseFloat((amountReceive!).toString()).toFixed(2) : amountReceive}
            onChange={(e) => setAmountReceive(parseFloat(e.target.value))}
          />
          <div className="absolute bottom-2 left-4 font-semibold text-gray-500 text-sm">
            {tokenReceiveQuote && amountReceive ? 
              tokenReceiveQuoteLoading ? 
              <Skeleton className="w-14 h-4 bg-gray-600" /> : 
              Number.parseFloat(tokenReceiveQuote.toString()).toFixed(2) + " $"
             :""
            }
          </div>
          <div className="absolute top-1/2 right-4 -translate-y-1/2 text-2xl font-[Monument]">
            <SimpleTokenSelector selectedToken={setTokenReceive}/>
          </div>
        </div>
        <Button
          className="bg-foreground rounded-xl font-extrabold hover:bg-foreground/90 text-lg w-full h-[7vh] tracking-widest"
          // onClick={() => SendToShift(fiatSend!, amountSend!, tokenReceive!, address!, setSwapLoading)}
          disabled={ !fiatSend || !amountSend || !tokenReceive || !amountReceive || swapLoading}
        >
          BUY <ArrowRightLeft className="ml-1" size={20} />
        </Button>
      </div>
    </main>
  );
}
