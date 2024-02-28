import { IProvider } from "@web3auth/base";

import evmProvider from "./evmProvider";

import solanaProvider from "./solanaProvider";
import { SolanaPrivateKeyProvider } from "@web3auth/solana-provider";

import tezosProvider from "./tezosProvider";
import { hex2buf } from "@taquito/utils";
import * as tezosCrypto from "@tezos-core-tools/crypto-utils";
import { CommonPrivateKeyProvider } from "@web3auth/base-provider";

export interface IWalletProvider {
  getAddress: () => Promise<string>;
  getBalance: () => Promise<string>;
  getChainId: () => Promise<string>;
  signMessage: (message: string) => Promise<string>;
  sendTransaction: (amount: number, destination: string) => Promise<string>;
  getPrivateKey: () => Promise<string>;
  getTokenBalance: (tok: string) => Promise<string>;
  getTokenBalanceWithAddress: (address: string) => Promise<string>;
  supplyAave: (cont: string, tok :string, amount: string) => Promise<string>;
  withdrawAave: (cont: string, tok :string) => Promise<string>;
  depositETHAave: (cont: string, tok :string, amount: string) => Promise<string>;
  withdrawETHAave: (cont: string, tok: string) => Promise<string>;
}

export const getEVMWalletProvider = (provider: IProvider | null): IWalletProvider => {
  return evmProvider(provider);
};

export const getSolanaWalletProvider = async (provider: IProvider | null): Promise<IWalletProvider> => {
  const privateKey = await provider?.request({
    method: "eth_private_key",
  });
  const { getED25519Key } = await import("@toruslabs/openlogin-ed25519");
    const ed25519key = getED25519Key(privateKey).sk.toString("hex");

    const solanaPrivateKeyProvider = new SolanaPrivateKeyProvider({
      config: {
        chainConfig: {
          chainId: "0x3",
          rpcTarget: "https://api.devnet.solana.com",
          displayName: "Solana Mainnet",
          blockExplorer: "https://explorer.solana.com/",
          ticker: "SOL",
          tickerName: "Solana",
        },
      },  
    });
    await solanaPrivateKeyProvider.setupProvider(ed25519key);
    console.log(solanaPrivateKeyProvider.provider);
  return solanaProvider(solanaPrivateKeyProvider.provider as any);
};

export const getTezosWalletProvider = async (provider: IProvider | null): Promise<IWalletProvider> => {
  const privateKey = await provider?.request({
    method: "eth_private_key",
  });
  const keyPair = tezosCrypto.utils.seedToKeyPair(hex2buf(privateKey));
  const tezosPrivateKeyProvider = new CommonPrivateKeyProvider({
    config: {
      chainConfig: {
        chainId: "Tezos",
        rpcTarget: "https://rpc.tzbeta.net/",
        displayName: "Tezos",
        blockExplorer: "https://tzstats.com",
        ticker: "XTZ",
        tickerName: "Tezos",
      }
    }
  });
  await tezosPrivateKeyProvider.setupProvider(keyPair!.sk);
  console.log("tezos: "+keyPair!.sk);
  return tezosProvider(keyPair!.sk);
};
