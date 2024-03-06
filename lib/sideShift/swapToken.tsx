"use client";

import { chain } from "@/config/chainConfig";
import { token } from "@/config/tokenConfig";
import axios from "axios";
import { useWeb3Auth } from "@/services/web3auth";
import { toast } from "sonner";
import { send } from "process";

const NetworkAddress = async (tok: string) : Promise<string> =>{
  const { getAddresses } = useWeb3Auth();
  const addresses = await getAddresses();
  if (token[tok].network === "Solana Devnet") {
    return addresses[1];
  } else if (token[tok].network === "Tezos Ghostnet") {
    return addresses[2];
  } else {
    return addresses[0];
  }
}

export const CreateShift = async (sendToken:string, receiveToken:string) => {
    // const sendingAddress = await NetworkAddress(sendToken);
    // const receivingAddress = await NetworkAddress(receiveToken);

    console.log(" depositCoin: "+token[sendToken].coin+" depositNetwork: "+token[sendToken].network.split(" ")[0].toLowerCase()+" settleCoin: "+token[receiveToken].coin+" settleNetwork: "+token[receiveToken].network.split(" ")[0].toLowerCase());

    const data = JSON.stringify({
        refundAddress: "0x1f29312f134C79984bA4b21840f2C3DcF57b9c85" ,
        settleAddress: "0x1f29312f134C79984bA4b21840f2C3DcF57b9c85",
        depositCoin: token[sendToken].coin,
        depositNetwork: token[sendToken].network.split(" ")[0].toLowerCase(),
        settleCoin: token[receiveToken].coin,
        settleNetwork: token[receiveToken].network.split(" ")[0].toLowerCase(),
        affiliateId: "w3SGv4itW",
    });

    const config = {
      method: 'post',
      url: 'https://sideshift.ai/api/v2/shifts/variable',
      headers: { 
        'Content-Type': 'application/json',
        'x-sideshift-secret': 'f479732dd3e8304c325feda12a8493d6',
      },
      data: data,
      maxBodyLength: Infinity,
    };

    try {
      const response = await axios(config);
      console.log("Swap data",response.data)
      return response.data;
    } catch (error) {
      console.log("error catched",error)
      if (error instanceof Error) {
        console.error(error.message);
        toast.error(error.message);
      } else if (typeof error === 'object' && error !== null && 'response' in error) {
        const axiosError = error as { response: { data: { error: { message: string } } } };
        console.error(axiosError.response.data.error.message);
        toast.error(axiosError.response.data.error.message);
      } else {
        console.error(error);
        toast.error(String(error));
      }
      return error;
    }
};

export const SendToShift = async (sendToken:string, sendAmount:number, receiveToken:string) => {
    // const { sendTransaction } = useWeb3Auth();
    // setLoading(true);
    console.log(sendToken, sendAmount, receiveToken)
    const shiftInfo = await CreateShift(sendToken, receiveToken);
    toast("min: "+shiftInfo.depositMin + "deposit address: "+shiftInfo.depositAddress);
    // setLoading(false);
    // sendTransaction(receiveToken, receiveAmount);
}