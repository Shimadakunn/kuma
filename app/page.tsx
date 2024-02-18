"use client";
import { useWeb3Auth } from "../services/web3auth";
import { token } from "@/config/tokenConfig";
import {chain} from "@/config/chainConfig";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

export default function Home() {
  const { provider, switchChain, chainId, getTokenBalance } = useWeb3Auth();

  const [balances, setBalances] = useState<string[]>([]);

  const getBalances = async () => {
    const updatedBalances = [];
    for (const key of Object.keys(token)) {
      await switchChain(key);
      const balance = await getTokenBalance(key);
      console.log("key " + key + " balance " + balance);
      updatedBalances.push(balance);
    }
    setBalances(updatedBalances);
  };

  useEffect(() => {
    if (provider) {
      getBalances();
    }
  }, [provider]);

  useEffect(() => {
    console.log(balances);
  }, [balances]);
  return (
    <main className="flex items-center justify-center h-full w-full">
      <div className="shadow w-[75vw] p-2 rounded-xl border border-primary/20 space-y-2 tracking-tight">
        <div className="flex items-center justify-between px-4">
          <div className="w-28">Token</div>
          <div className="w-20 text-center">APY</div>
          <div className="w-20 text-center">TVL</div>
          <Button onClick={getBalances}>Refresh</Button>
        </div>
        {Object.keys(token).map((key, i) => (
          <StakePool key={key} tok={key} balance={balances[i]} />
        ))}
      </div>
    </main>
  );
}
type Pool = {
  tok: string;
  balance: string;
};
const StakePool: React.FC<Pool> = ({ tok, balance }) => {
  return (
    <div className="h-[7vh] border-0 text-lg font-medium bg-primary/15 rounded-xl flex items-center justify-between px-4">
      <div className="w-28 flex items-center justify-start">
        <Image
          src={`https://cryptofonts.com/img/icons/${token[
            tok
          ].coin.toLowerCase()}.svg`}
          width={40}
          height={40}
          alt={tok}
          className="mr-2"
        />
        {token[tok].coin}
      </div>
      <div className="w-20 text-center">
        {balance ? balance : <Skeleton className="w-14 h-4 bg-gray-600" />}
      </div>
    </div>
  );
};
