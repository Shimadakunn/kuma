"use client";
import { token } from "@/config/tokenConfig";
import Image from 'next/image';
import { useEffect } from "react";

export default function Home() {
  return(
    <main className="flex items-center justify-center h-full w-full">
        <div className="shadow w-[75vw] p-2 rounded-xl border border-primary/20 space-y-2 tracking-tight">
          <div className='flex items-center justify-between px-4'>
            <div className='w-28'>Token</div>
            <div className='w-20 text-center'>APY</div>
            <div className='w-20 text-center'>TVL</div>
            <div className='w-20 text-right'>Earn</div>
          </div>
          {Object.keys(token).map((key) => (
            <StakePool key={key} tok={key} apy={10} tvl={1}/>
             ))}
        </div>
    </main>
  )
}
type Pool = {
  tok: string;
  apy: number;
  tvl: number;
};
const StakePool: React.FC<Pool> = ({tok,apy,tvl}) => {
  return (
    <div className="h-[7vh] border-0 text-lg font-medium bg-primary/15 rounded-xl flex items-center justify-between px-4">
      <div className="w-28 flex items-center justify-start">
        <Image src={`https://cryptofonts.com/img/icons/${token[tok].coin.toLowerCase()}.svg`} width={40} height={40} alt={tok} className="mr-2"/>
        {token[tok].coin}
      </div>
      <div className='w-20 text-center'>
        {apy}%
      </div>
      <div className='w-20 text-center'>
        {tvl}M$
      </div>
      <div className='w-20 text-right'>
        Supply
      </div>
    </div>
  );
}
