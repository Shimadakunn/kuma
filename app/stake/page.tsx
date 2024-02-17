"use client";
import { token } from "@/config/tokenConfig";
import { contract } from "@/config/contractConfig";
import Image from 'next/image';
import { useWeb3Auth } from "../../services/web3auth";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Home() {
  const { supplyAave, withdrawAave } = useWeb3Auth();

  const dai_address ="0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357";
  const pool_address = "0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951";
  return(
    <main className="flex items-center justify-center h-full w-full">
        <div className="shadow w-[75vw] p-2 rounded-xl border border-primary/20 space-y-2 tracking-tight">
          <div className='flex items-center justify-between px-4'>
            <div className='w-28'>Token</div>
            <div className='w-20 text-center'>APY</div>
            <div className='w-20 text-center'>TVL</div>
            <div className='w-20 text-right'>Earn</div>
            <Button className="w-20 text-right" onClick={()=>supplyAave(pool_address,"dai-sepolia","100")}>
              Supply
            </Button>
            <Button className="w-20 text-right" onClick={()=>withdrawAave(pool_address,"dai-sepolia")}>
              Withdraw
            </Button>
          </div>
          {Object.keys(contract).map((key) => (
            contract[key].tokenArray.map((tok) =>
              <StakePool key={tok} tok={tok} cont={key} apy={10} tvl={1}/>
            )
          ))}
        </div>
    </main>
  )
}
type Pool = {
  tok: string;
  cont: string;
  apy: number;
  tvl: number;
};
const StakePool: React.FC<Pool> = ({tok,cont,apy,tvl}) => {
  const { supplyAave, withdrawAave, getTokenBalanceWithAddress } = useWeb3Auth();

  const [aaveBalance, setAaveBalance] = useState("");
  return (
    <div className="h-[7vh] border-0 text-lg font-medium bg-primary/15 rounded-xl flex items-center justify-between px-4">
      <div className="w-28 flex items-center justify-start">
        <Image src={`https://cryptofonts.com/img/icons/${token[tok].coin.toLowerCase()}.svg`} width={40} height={40} alt={tok} className="mr-2"/>
        {token[tok].coin}
      </div>
      <div className='w-20 text-center'>
        {apy}% {}
      </div>
      <Button className='w-20 text-center' onClick={async ()=> setAaveBalance( await getTokenBalanceWithAddress(token[tok].aave!))}>
        {tvl}M$ {aaveBalance}
      </Button>
      <Button className="w-20 text-right" onClick={()=>supplyAave(contract[cont].address,tok,"100")}>
        Supply 
      </Button>
      <Button className="w-20 text-right" onClick={()=>withdrawAave(contract[cont].address,tok)}>
        Withdraw
      </Button>
    </div>
  );
}
