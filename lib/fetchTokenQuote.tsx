import axios from "axios";
import { token } from "@/config/tokenConfig";
import {chain } from "@/config/chainConfig";
import { toast } from "sonner";

export const fetchTokenQuote = async (tokenValue:string, amount:number) => {
  const tokenTicker = token[tokenValue].coin;
  
  const tokenChain = Object.keys(chain).find((key) => {
    return chain[key].chainId === token[tokenValue].chainId;
  });
  toast("tokenChain:"+tokenChain+" tokenTicker:"+tokenTicker+" amount:"+amount.toString());
    const data = JSON.stringify({
      depositCoin: tokenTicker,
      depositNetwork: tokenChain,
      settleCoin: "usdc",
      settleNetwork: "ethereum",
      depositAmount: amount.toString(),
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
      return response.data.rate;
    } catch (error) {
      console.error(error);
      return error;
    }
};