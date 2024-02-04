import axios from "axios";
import { token } from "@/config/tokenConfig";
import {chain } from "@/config/chainConfig";
import { toast } from "sonner";

export const fetchTokenQuote = async (sendToken:string, sendAmount:number, receiveToken?:string) => {
  const sendTokenTicker = token[sendToken].coin;
  
  const sendTokenChain = Object.keys(chain).find((key) => {
    return chain[key].chainId === token[sendToken].chainId;
  });
  let receiveTokenTicker = "usdc";
  let receiveTokenChain = "polygon";

  if(receiveToken){
    receiveTokenTicker = token[receiveToken!].coin;
    receiveTokenChain = Object.keys(chain).find((key) => {
      return chain[key].chainId === token[receiveToken!].chainId;
    });
  }

    const data = JSON.stringify({
      depositCoin: sendTokenTicker,
      depositNetwork: sendTokenChain,
      settleCoin: receiveTokenTicker,
      settleNetwork: receiveTokenChain,
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
    } catch (error) {
      console.error(error);
      return error;
    }
};