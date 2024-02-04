import { chain } from "@/config/chainConfig";
import { token } from "@/config/tokenConfig";
import axios from "axios";
import { toast } from "sonner";

export const CreateShift = async (sendToken:string, receiveToken:string,address:string) => {
  const sendTokenTicker = token[sendToken].coin;
  const sendTokenChain = Object.keys(chain).find((key) => {
    return chain[key].chainId === token[sendToken].chainId;
  });

    const receiveTokenTicker = token[receiveToken!].coin;
    const receiveTokenChain = Object.keys(chain).find((key) => {
      return chain[key].chainId === token[receiveToken!].chainId;
    });

    const data = JSON.stringify({
        refundAddress: "0x1f29312f134C79984bA4b21840f2C3DcF57b9c85",
        settleAddress: "0x1f29312f134C79984bA4b21840f2C3DcF57b9c85",
        depositCoin: sendTokenTicker,
        depositNetwork: sendTokenChain,
        settleCoin: receiveTokenTicker,
        settleNetwork: receiveTokenChain,
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
      toast(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
      return error;
    }
};

export const SendToShift = async (sendToken:string, sendAmount:number, receiveToken:string, address:string, setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
    // const { sendTransaction } = useWeb3Auth();
    setLoading(true);
    toast(address)
    const shiftInfo = await CreateShift(sendToken, receiveToken,address);
    toast("min: "+shiftInfo.depositMin + "deposit address: "+shiftInfo.depositAddress);
    setLoading(false);
    // sendTransaction(receiveToken, receiveAmount);
}