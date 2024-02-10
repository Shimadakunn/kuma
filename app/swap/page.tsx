"use client";
import SimpleTokenSelector from "@/components/token-selector/simple-token-selector";
import TokenSelector from "@/components/token-selector/token-selector";
import { fetchTokenQuote } from "@/lib/sideShift/fetchTokenQuote";
import { SendToShift } from "@/lib/sideShift/swapToken";
import { useWeb3Auth } from "../../services/web3auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

import { ArrowRightLeft } from "lucide-react";
import { toast } from "sonner";


export default function Home() {
  const { balance, address } = useWeb3Auth();

  const [amountSend, setAmountSend] = useState<number>();
  const [tokenSend, setTokenSend] = useState<string>();
  const [tokenSendQuote, setTokenSendQuote] = useState<number>();
  const [tokenSendQuoteLoading, setTokenSendQuoteLoading] = useState<boolean>(false);

  const [amountReceive, setAmountReceive] = useState<number>();  
  const [tokenReceive, setTokenReceive] = useState<string>();
  const [tokenReceiveQuote, setTokenReceiveQuote] = useState<number>();
  const [tokenReceiveQuoteLoading, setTokenReceiveQuoteLoading] = useState<boolean>(false);

  const [swapLoading, setSwapLoading] = useState<boolean>(false);
  
  useEffect(() => {
    const fetchSendTokenQuote = async () => {
      if(amountSend){
        setTokenSendQuoteLoading(true);
        await fetchTokenQuote(tokenSend!, amountSend) 
        .then((fetchedRate) => {
          toast("fetchedRate:"+fetchedRate);
          setTokenSendQuote(fetchedRate);
        })
        .catch((error) => {
          console.error('Error fetching token quote:', error);
          toast.error('Failed to fetch token quote');
        });
        setTokenSendQuoteLoading(false);

        await fetchTokenQuote(tokenSend!, amountSend, tokenReceive!) 
        .then((fetchedRate) => {
          toast("fetchedRate:"+fetchedRate);
          setAmountReceive(parseFloat(fetchedRate));
        })
        .catch((error) => {
          console.error('Error fetching token quote:', error);
          toast.error('Failed to fetch token quote');
        });

        setTokenReceiveQuoteLoading(true);
        fetchTokenQuote(tokenReceive!, amountReceive!) 
        .then((fetchedRate) => {
          toast("fetchedRate:"+fetchedRate);
          setTokenReceiveQuote(fetchedRate);
        })
        .catch((error) => {
          console.error('Error fetching token quote:', error);
          toast.error('Failed to fetch token quote');
        });
        setTokenReceiveQuoteLoading(false);
      }
    }
    fetchSendTokenQuote();
  },[amountSend, tokenReceive,tokenSend]);

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
          <div className="absolute bottom-2 left-4 font-semibold text-gray-500 text-sm">
            {tokenSendQuote && amountSend ? 
              tokenSendQuoteLoading ? 
              <Skeleton className="w-14 h-4 bg-gray-600" /> : 
              Number.parseFloat(tokenSendQuote.toString()).toFixed(2) + " $"
             :""
            }
          </div>
          <div className="absolute bottom-2 right-4 font-semibold text-gray-500 text-sm">
            Solde: {balance}{" "}
            <span
              className="text-secondary/80 cursor-pointer"
              onClick={() => setAmountSend(parseFloat(balance!))}
            >
              Max
            </span>
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
            <SimpleTokenSelector otherToken={tokenSend} selectedToken={setTokenReceive}/>
          </div>
        </div>
        <Button
          className="bg-foreground rounded-xl font-extrabold hover:bg-foreground/90 text-lg w-full h-[7vh] tracking-widest"
          onClick={() => SendToShift(tokenSend!, amountSend!, tokenReceive!, address!, setSwapLoading)}
          disabled={ !tokenSend || !amountSend || !tokenReceive || !amountReceive || swapLoading}
        >
          SWAP <ArrowRightLeft className="ml-1" size={20} />
        </Button>
      </div>
    </main>
  );
}
