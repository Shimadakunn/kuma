import axios from "axios";
import { token } from "@/config/tokenConfig";
import {chain } from "@/config/chainConfig";
import { toast } from "sonner";

export const fetchTokenQuote = async (sendToken:string, sendAmount:number, receiveToken:string) => {
  console.log(token[sendToken].coin,token[sendToken].network.split(" ")[0].toLowerCase(),token[receiveToken].coin,token[receiveToken].network.split(" ")[0].toLowerCase())

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
    } catch (error) {
      console.log("error catched",error)
      if(error.response){
        console.error(error.response.data.error.message);
        toast.error(error.response.data.error.message);
      }
      else{
        console.error(error);
        toast.error(error);
      }
      return error;
    }
};