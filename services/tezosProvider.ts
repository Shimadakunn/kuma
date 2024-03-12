import { CommonJRPCProvider } from "@web3auth/base-provider";

import { TezosToolkit } from '@taquito/taquito';
import { InMemorySigner } from "@taquito/signer";

import {chain} from "@/config/chainConfig";
import {token} from "@/config/tokenConfig";

import { IWalletProvider } from "./walletProvider";

import { toast } from "sonner";

const Tezos = new TezosToolkit(chain["Tezos Ghostnet"].rpcTarget as string);

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

  const getBalance = async (tok: string): Promise<string> => {
    try {
      const balance = await Tezos.tz.getBalance(keyPair!.pkh);
      token["tezos-ghostnet"].balance = balance.dividedBy(1000000).toFixed(3).toString();
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

  const interactTezosContract = async (): Promise<string> => {
    try {
      console.log("Interacting with contract");
      Tezos.setSignerProvider(await InMemorySigner.fromSecretKey(keyPair?.sk as string));
      const contract = await Tezos.wallet.at("KT1KAUbe1gsdw5BeVQfgjh9xZFrHrKVs8ApD");
      const op = await contract.methodsObject.increment(2).send();
      console.log("Operation hash:", op.opHash);
      return op.opHash;
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
        interactTezosContract
      };
    };
    
    export default ethersWeb3Provider;