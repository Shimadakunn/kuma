import { IProvider } from "@web3auth/base";

import evmProvider from "./evmProvider";

import { SolanaPrivateKeyProvider } from "@web3auth/solana-provider";
import solanaProvider from "./solanaProvider";

import { hex2buf } from "@taquito/utils";
import * as tezosCrypto from "@tezos-core-tools/crypto-utils";
import tezosProvider from "./tezosProvider";

import { Account, constants, ec, json, stark, Provider, hash, CallData } from 'starknet';

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
    const ed25519key = getED25519Key(privateKey as string).sk.toString("hex");
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
  const keyPair = tezosCrypto.utils.seedToKeyPair(hex2buf(privateKey as string));
  return tezosProvider(keyPair as any);
};

export const getStarknetWalletProvider = async(provider: IProvider | null): Promise<IWalletProvider> => {
  // connect provider
  const starkprovider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
  let privateKey = await provider?.request({ method: "eth_private_key" });
  privateKey = "0x"+privateKey as string;
  const privateKeyAX = stark.randomAddress();
  //new Argent X account v0.2.3
  const argentXproxyClassHash = '0x25ec026985a3bf9d0cc1fe17326b245dfdc3ff89b8fde106542a3ea56c5a918';
  const argentXaccountClassHash =
    '0x033434ad846cdd5f23eb73ff09fe6fddd568284a0fb7d1be20ee482f044dabe2';
  console.log('privateKeyAX=', privateKey as string);
  console.log('AX_ACCOUNT_PRIVATE_KEY=', privateKey as string);
  const starkKeyPubAX = ec.starkCurve.getStarkKey(privateKey as string);
  console.log('AX_ACCOUNT_PUBLIC_KEY=', starkKeyPubAX);

  // Calculate future address of the ArgentX account
  const AXproxyConstructorCallData = CallData.compile({
    implementation: argentXaccountClassHash,
    selector: hash.getSelectorFromName('initialize'),
    calldata: CallData.compile({ signer: starkKeyPubAX, guardian: '0' }),
  });
  const AXcontractAddress = hash.calculateContractAddressFromHash(
    starkKeyPubAX,
    argentXproxyClassHash,
    AXproxyConstructorCallData,
    0
  );
  console.log('Precalculated account address=', AXcontractAddress);

  const accountAX = new Account(starkprovider, AXcontractAddress, privateKey as string);

  const deployAccountPayload = {
    classHash: argentXproxyClassHash,
    constructorCalldata: AXproxyConstructorCallData,
    contractAddress: AXcontractAddress,
    addressSalt: starkKeyPubAX,
  };

  // const { transaction_hash: AXdAth, contract_address: AXcontractFinalAddress } =
  //   await accountAX.deployAccount(deployAccountPayload);
  // console.log('✅ ArgentX wallet deployed at:', AXcontractFinalAddress);

  const key = tezosCrypto.utils.seedToKeyPair(hex2buf(privateKey));
  return tezosProvider(key as any);
};