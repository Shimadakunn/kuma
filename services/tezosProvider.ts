import { CommonJRPCProvider } from "@web3auth/base-provider";

import { TezosToolkit } from '@taquito/taquito';
import { InMemorySigner } from "@taquito/signer";

import { IWalletProvider } from "./walletProvider";

import { toast } from "sonner";

const Tezos = new TezosToolkit('https://ghostnet.tezos.marigold.dev/');

const ethersWeb3Provider = (keyPair: any): IWalletProvider => {
  const getAddress = async (): Promise<string> => {
    try {
      const acc = await keyPair!.pkh;
    return acc;
    } catch (error: any) {
      toast.error(error);
      return error.toString();
    }
  };

  const getChainId = async (): Promise<string> => {
    try {
      return "Tezos";
    } catch (error: any) {
      toast.error(error);
      return error.toString();
    }
  };

  const getBalance = async (): Promise<string> => {
    try {
      const balance = await Tezos.tz.getBalance(keyPair!.pkh);
      return balance.dividedBy(1000000).toFixed(3).toString();
    } catch (error: any) {
      toast.error(error);
      return error.toString();
    }
  }

  const getPrivateKey = async (): Promise<string> => {
    try {
      return keyPair.sk;
    } catch (error: any) {
      toast.error(error);
      return error.toString();
    }
  }

  const signMessage = async (message: string): Promise<string> => {
    try {
        const signer = new InMemorySigner(keyPair.sk);
      const signature = await signer.sign(message);
      return signature.toString() ;
    } catch (error: any) {
      return error.toString();
    }
  }

  const sendTransaction = async (amount: number, destination: string): Promise<string> => {
    try {
      Tezos.setSignerProvider(await InMemorySigner.fromSecretKey(keyPair?.sk as string));
      const op = await Tezos.wallet
        .transfer({
          to: destination,
          amount: amount,
        })
        .send();

      const txRes = await op.confirmation();
      return txRes!.block.hash.toString();
  } catch (error: any) {
    return error.toString();
  }
  }

    return {
        getAddress,
        getBalance,
        getChainId,
        getPrivateKey,
        signMessage,
        sendTransaction,
      };
    };
    
    export default ethersWeb3Provider;