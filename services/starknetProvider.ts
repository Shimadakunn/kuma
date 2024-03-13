import {chain} from "@/config/chainConfig";
import {token} from "@/config/tokenConfig";

import { IWalletProvider } from "./walletProvider";
import { ethers } from "ethers";

import { toast } from "sonner";

import { Account, Contract, Call, constants, ec, json, stark, RpcProvider, hash, CallData } from 'starknet';
import ERC20 from "@/public/abi/starknet-erc20.json";

const starkprovider = new RpcProvider({ nodeUrl: chain["Starknet Goerli"].rpcTarget });

const ethersWeb3Provider = (signer: string, contract: string): IWalletProvider => {
  const getAddress = async (): Promise<string> => {
    try {
      return contract;
    } catch (error: any) {
      toast.error(error);
      return error.toString();
    }
  };

  const getBalance = async (tok: string): Promise<string> => {
    try {
        const accountAX = new Account(starkprovider, contract, signer);
        const erc20 = new Contract(ERC20, token["starknet-goerli"].address!, starkprovider);
        erc20.connect(accountAX);
        const decimals = await erc20.decimals();
        const res = ethers.formatUnits(
            await erc20.balanceOf(contract),decimals
        );
        const balance = (+res).toFixed(4);
        token["starknet-goerli"].balance = balance;
        return balance;
    } catch (error: any) {
      toast.error(error);
      return error.toString();
    }
  }

  const getPrivateKey = async (): Promise<string> => {
    try {
      return signer;
    } catch (error: any) {
      toast.error(error);
      return error.toString();
    }
  }

  const signMessage = async (message: string): Promise<string> => {
    try {
      return signer;
    } catch (error: any) {
      return error.toString();
    }
  }

  const sendTransaction = async (amount: number, destination: string): Promise<string> => {
    try {
      const accountAX = new Account(starkprovider, contract, signer);
      const erc20 = new Contract(ERC20, token["starknet-goerli"].address!, starkprovider);
      erc20.connect(accountAX);
      const amountBigInt = ethers.parseEther(amount.toString());
      const transferCallData: Call = erc20.populate('transfer', {
        recipient: destination,
        amount: amountBigInt,
      });
      const { transaction_hash: transferTxHash } = await erc20.transfer(transferCallData.calldata);
      
      await starkprovider.waitForTransaction(transferTxHash);
      return signer;
    } catch (error: any) {
      return error.toString();
    }
  }

    return {
        getAddress,
        getBalance,
        getPrivateKey,
        signMessage,
        sendTransaction,
      };
    };
    
    export default ethersWeb3Provider;