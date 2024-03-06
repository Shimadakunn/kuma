import axios from "axios";
import { token } from "@/config/tokenConfig";
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