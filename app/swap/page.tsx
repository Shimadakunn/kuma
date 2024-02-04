"use client";
import { useWeb3Auth } from "../../services/web3auth";
import {fetchTokenQuote} from "@/lib/fetchTokenQuote";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { use, useEffect, useState } from "react";

import { ArrowRightLeft, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import TokenSelector from "@/lib/token-selector";

export default function Home() {
  const { balance, sendTransaction, connectedChain } = useWeb3Auth();
  const [amountSend, setAmountSend] = useState<number>();
  const [tokenSend, setTokenSend] = useState<string>();
  const [tokenSendQuote, setTokenSendQuote] = useState<number>();
  const [tokenSendQuoteLoading, setTokenSendQuoteLoading] = useState<boolean>(false);
  const [amountReceive, setAmountReceive] = useState<string>();
  const [tokenReceive, setTokenReceive] = useState<string>();
  const [tokenReceiveQuote, setTokenReceiveQuote] = useState<number>();
  
  useEffect(() => {
    const fetchSendTokenQuote = async () => {
      if(amountSend){
        fetchTokenQuote(tokenSend!, amountSend) 
        .then((fetchedRate) => {
          toast("fetchedRate:"+fetchedRate);
          setTokenSendQuote(fetchedRate);
        })
        .catch((error) => {
          console.error('Error fetching token quote:', error);
          toast.error('Failed to fetch token quote');
        });
      }
    }
    fetchSendTokenQuote();
  },[amountSend,tokenSend])

  const swap = async () => {
  }

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
            {tokenSendQuote ? 
             Number.parseFloat(tokenSendQuote.toString()).toFixed(2) + " $":""
            }
          </div>
          {tokenSend}
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
          <Input
            className="h-[15vh] border-0 text-4xl font-medium bg-primary/15"
            placeholder="0"
            type="number"
            value={amountReceive}
          />
          <div className="absolute top-1/2 right-4 -translate-y-1/2 text-2xl font-[Monument]">
          <TokenSelector chainChange={false} selectedToken={setTokenReceive}/>
          </div>
          {tokenReceive}
          <div className="absolute top-2 left-2 font-semibold text-gray-500 text-sm">
            You receive
          </div>
        </div>
        <Button
          className="bg-foreground rounded-xl font-extrabold hover:bg-foreground/90 text-lg w-full h-[7vh] tracking-widest"
          // onClick={() => sendTransaction(amount!.toString(), toAddress!)}
          // disabled={ !amount || !toAddress || parseFloat(balance!) < amount}
        >
          SWAP <ArrowRightLeft className="ml-1" size={20} />
        </Button>
      </div>
    </main>
  );
}
