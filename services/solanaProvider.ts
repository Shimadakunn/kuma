import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction
} from "@solana/web3.js";
import { CustomChainConfig } from "@web3auth/base";
import { SolanaWallet } from "@web3auth/solana-provider";

import { IWalletProvider } from "./walletProvider";

import { toast } from "sonner";

const ethersWeb3Provider = (provider: any): IWalletProvider => {

    const getAddress = async (): Promise<string> => {
        try {
          const solanaWallet = new SolanaWallet(provider as any);
          const acc = await solanaWallet.requestAccounts();
        return acc[0];
        } catch (error: any) {
          toast.error(error);
          return error.toString();
        }
      };
    
      const getChainId = async (): Promise<string> => {
        try {
          return "2";
        } catch (error: any) {
          toast.error(error);
          return error.toString();
        }
      };
    
      const getBalance = async (): Promise<string> => {
        try {
            const solanaWallet = new SolanaWallet(provider as any);
            const connectionConfig = await solanaWallet.request<string[], CustomChainConfig>({
              method: "solana_provider_config",
              params: [],
            });
            const conn = new Connection(connectionConfig.rpcTarget);
      
            const accounts = await solanaWallet.requestAccounts();
            const balance = await conn.getBalance(new PublicKey(accounts[0]));
            return balance.toString();
        } catch (error: any) {
          toast.error(error);
          return error.toString();
        }
      };
    
      const signMessage = async (message: string): Promise<string> => {
        try {
            const solanaWallet = new SolanaWallet(provider as any);
            const msg = Buffer.from(message, "utf8");
            const res = await solanaWallet.signMessage(msg);
            return res.toString();
        } catch (error: any) {
          toast.error(error);
          return error.toString();
        }
      };
    
      const sendTransaction = async (amount: number, destination: string): Promise<string> => {
        try {
            const solanaWallet = new SolanaWallet(provider as any);
  
            const accounts = await solanaWallet.requestAccounts();
      
            const connectionConfig = await solanaWallet.request<string[], CustomChainConfig>({
              method: "solana_provider_config",
              params: [],
            });
            const connection = new Connection(connectionConfig.rpcTarget);
      
            const block = await connection.getLatestBlockhash("finalized");
      
            const TransactionInstruction = SystemProgram.transfer({
              fromPubkey: new PublicKey(accounts[0]),
              toPubkey: new PublicKey(destination),
              lamports: amount * LAMPORTS_PER_SOL,
            });
      
            const transaction = new Transaction({
              blockhash: block.blockhash,
              lastValidBlockHeight: block.lastValidBlockHeight,
              feePayer: new PublicKey(accounts[0]),
            }).add(TransactionInstruction);
      
            const { signature } = await solanaWallet.signAndSendTransaction(
              transaction
            );
      
            return signature;
        } catch (error: any) {
          return error as string;
        }
      };
    
      const getPrivateKey = async (): Promise<string> => {
        try {
          const solanaWallet = new SolanaWallet(provider as any);
            const privateKey = await solanaWallet.request({
                method: "solanaPrivateKey",
              });
          
              return privateKey as string;
        } catch (error: any) {
          toast.error(error);
          return error as string;
        }
      };
    
      const readContract = async (contractAddress: string, contractABI: any) => {
        try {
          return "todo";
        } catch (error: any) {
          toast.error(error);
          return error as string;
        }
      };
    
      const writeContract = async (contractAddress: string, contractABI: any, updatedValue: string) => {
        try {
            return "todo";
        } catch (error: any) {
          toast.error(error);
          return error as string;
        }
      };
    
      return {
        getAddress,
        getBalance,
        getChainId,
        signMessage,
        sendTransaction,
        getPrivateKey,
      };
    };
    
    export default ethersWeb3Provider;