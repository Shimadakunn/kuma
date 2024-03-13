"use client";

import { token } from "@/config/tokenConfig";
import axios from "axios";
import { toast } from "sonner";

export const fetchTokenQuote = async (sendToken:string, sendAmount:number, receiveToken:string) => {
  const data = JSON.stringify({
    depositCoin: token[sendToken].coin,
    depositNetwork: token[sendToken].network.split(" ")[0].toLowerCase(),
    settleCoin: token[receiveToken].coin,
    settleNetwork: token[receiveToken].network.split(" ")[0].toLowerCase(),
    depositAmount: sendAmount.toString(),
    settleAmount: null,
    affiliateId: "w3SGv4itW",
  });

  const config = {
    method: 'post',
    url: 'https://sideshift.ai/api/v2/quotes',
    headers: { 
      'Content-Type': 'application/json',
      'x-sideshift-secret': 'f479732dd3e8304c325feda12a8493d6',
    },
    data: data,
    maxBodyLength: Infinity,
  };

  try {
    const response = await axios(config);
    return response.data.settleAmount;
  } catch (error: any) {
    console.error(error.response.data.error.message);
    toast.error(error.response.data.error.message);
    return error;
  }
};

const NetworkAddress = async (tok: string, addresses:string[]): Promise<string> => {
  if (token[tok].network === "Solana Devnet") {
    return addresses[1];
  } else if (token[tok].network === "Tezos Ghostnet") {
    return addresses[2];
  } else {
    return addresses[0];
  }
};

export const CreateShift = async (sendToken:string, receiveToken:string, addresses: string[]) => {
  const sendingAddress = await NetworkAddress(sendToken,addresses);
  const receivingAddress = await NetworkAddress(receiveToken,addresses);

  const data = JSON.stringify({
      refundAddress: sendingAddress ,
      settleAddress: receivingAddress,
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
    return response.data;
  } catch (error) {
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