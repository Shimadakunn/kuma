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
  getBalance: (tok: string) => Promise<string>;
  signMessage: (message: string) => Promise<string>;
  sendTransaction: (amount: number, destination: string, tok?: string) => Promise<string>;
  getPrivateKey: () => Promise<string>;
  supplyAave?: (cont: string, tok :string, amount: string) => Promise<string>;
  withdrawAave?: (cont: string, tok :string, amount: string) => Promise<string>;
  depositETHAave?: (cont: string, tok :string, amount: string) => Promise<string>;
  withdrawETHAave?: (cont: string, tok: string, amount: string) => Promise<string>;
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
    await solanaPrivateKeyProvider.setupProvider(ed25519key)
  return solanaProvider(solanaPrivateKeyProvider.provider as any);
};

export const getTezosWalletProvider = async (provider: IProvider | null): Promise<IWalletProvider> => {
  const privateKey = await provider?.request({
    method: "eth_private_key",
  });
  const keyPair = tezosCrypto.utils.seedToKeyPair(hex2buf(privateKey));
  return tezosProvider(keyPair as any);
};
