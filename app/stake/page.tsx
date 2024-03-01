"use client";
import { token } from "@/config/tokenConfig";
import { contract } from "@/config/contractConfig";
import Image from "next/image";
import { useWeb3Auth } from "../../services/web3auth";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { use, useEffect, useState } from "react";

export default function Home() {
  return (
    <main className="flex items-center justify-center h-full w-full">
      <div className="shadow w-[75vw] p-2 rounded-xl border border-primary/20 space-y-2 tracking-tight">
        <div className="flex items-center justify-between px-4">
          <div className="w-28">Token</div>
          <div className="w-20 text-center">APY</div>
          <div className="w-20 text-center">TVL</div>
          <div className="w-20 text-right">Earn</div>
        </div>
        {Object.keys(contract).map((key) =>
          contract[key].tokenArray.map((tok) => (
            <StakePool key={tok} tok={tok} cont={key} apy={10} tvl={1} />
          ))
        )}
      </div>
    </main>
  );
}
type Pool = {
  tok: string;
  cont: string;
  apy: number;
  tvl: number;
};
const StakePool: React.FC<Pool> = ({ tok, cont, apy, tvl }) => {
  const { supplyAave, withdrawAave, getBalances } =
    useWeb3Auth();

  const [supplyLoading, setSupplyLoading] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  useEffect(() => {
    const updateBalance = async () => {
      await getBalances();
      console.log("update balance")
    };
    updateBalance();
  },[supplyLoading,withdrawLoading]);
  
  return (
    <div className="h-[7vh] border-0 text-lg font-medium bg-primary/15 rounded-xl flex items-center justify-between px-4">
      <div className="w-28 flex items-center justify-start">
        <Image src={`https://cryptofonts.com/img/icons/${token[tok].coin.toLowerCase()}.svg`} width={40} height={40} alt={tok} className="mr-2"/>
        {token[tok].coin}
      </div>
      <div className="w-20 text-center">
        {apy}% {}
      </div>
      <div className="w-20 text-center">
        {tvl}M$
      </div>
      <div className="w-20 text-center">
        {token[tok].balance ? token[tok].balance?.slice(0,6) : <Skeleton className="w-14 h-4 bg-gray-600" />}
      </div>
      <div className="w-20 text-center">
        {token[tok].aaveBalance ? token[tok].aaveBalance : <Skeleton className="w-14 h-4 bg-gray-600" />}
      </div>
      <Button
        className="w-20 text-right"
        variant={"secondary"}
        onClick={async () => {
          await supplyAave(cont, tok, "100",setSupplyLoading);
          await getBalances();
        }}
      >
        Supply
      </Button>
      <Button
        className="w-20 text-right"
        onClick={async () => {
          await withdrawAave(cont, tok,setWithdrawLoading);
          await getBalances();
        }}
      >
        Withdraw
      </Button>
    </div>
  );
};
