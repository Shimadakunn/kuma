"use client";
import { token } from "@/config/tokenConfig";
// import { useWeb3Auth } from "@/services/Web3AuthProviderWithWindow";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

import dynamic from "next/dynamic";

const ClientSideComponent = dynamic(() => import("./interact"), {
    ssr: false,
  });

export default function Home() {
//   const { interactTezosContract } = useWeb3Auth();

  return (
    <main className="flex items-center justify-center h-full w-full">
      <div className="shadow w-[75vw] p-2 rounded-xl border border-primary/20 space-y-2 tracking-tight">
        <div className="flex items-center justify-between px-4">
          <div className="w-28">Token</div>
          <div className="w-20 text-center">APY</div>
          <div className="w-20 text-center">TVL</div>
          {/* <Button onClick={interactTezosContract}>Refresh</Button> */}
            <ClientSideComponent />
        </div>
        <ScrollArea className="h-[75vh]">
          {Object.keys(token).map((key) => (
            <StakePool key={key} tok={key}/>
          ))}
        </ScrollArea>
      </div>
    </main>
  );
}
type Pool = {
  tok: string;
};
const StakePool: React.FC<Pool> = ({ tok }) => {
  return (
    <div className="h-[7vh] border-0 text-lg font-medium bg-primary/15 rounded-xl flex items-center justify-between px-4 my-1">
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
      <div className="w-20 text-right">
        {token[tok].balance ? token[tok].balance!.slice(0, 6) : <Skeleton className="w-14 h-4 bg-gray-600" />}
      </div>
    </div>
  );
};
