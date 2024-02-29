"use client";
import { CustomChainConfig, IProvider, WALLET_ADAPTERS } from "@web3auth/base";
import { Web3Auth } from "@web3auth/modal";
import { OPENLOGIN_NETWORK, OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

import { chain } from "../config/chainConfig";
import { contract } from "../config/contractConfig";
import { token } from "../config/tokenConfig";
import { getEVMWalletProvider, getSolanaWalletProvider, getTezosWalletProvider, IWalletProvider } from "./walletProvider";

import Loading from "../components/loading-page";
import Login from "../components/login-page";

import { ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export interface IWeb3AuthContext {
  ethersProvider: IProvider | null;
  web3Auth: Web3Auth | null;
  connected: boolean;
  provider: IWalletProvider | null;
  isLoading: boolean;
  user: any;
  address: string;
  balance: string;
  chainId: string;
  connectedChain: CustomChainConfig;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getUserInfo: () => Promise<any>;
  getAddress: () => Promise<string>;
  getAddresses: () => Promise<string[]>;
  getBalance: () => Promise<string>;
  signMessage: (message: string) => Promise<string>;
  sendTransaction: (amount: number, destination: string, tok: string,setLoading: (loading: boolean) => void) => Promise<string>;
  getPrivateKey: () => Promise<string[]>;
  getChainId: () => Promise<string>;
  switchChain: (network: string) => Promise<void>;
  getTokenBalance: (tok: string) => Promise<string>;
  getTokenBalanceWithAddress: (address: string) => Promise<string>;
  supplyAave: (contractAddress: string, tok: string, amount: string,setLoading: (loading: boolean) => void) => Promise<string>;
  withdrawAave: (contractAddress: string, tok: string,setLoading: (loading: boolean) => void) => Promise<string>;
}

export const Web3AuthContext = createContext<IWeb3AuthContext>({
  ethersProvider: null,
  web3Auth: null,
  provider: null,
  isLoading: false,
  connected: false,
  user: null,
  address: null,
  balance: null,
  chainId: null,
  connectedChain: chain["Sepolia Testnet"],
  login: async () => {},
  logout: async () => {},
  getUserInfo: async () => null,
  getAddress: async () => "",
  getAddresses : async () => [""],
  getBalance: async () => "",
  signMessage: async () => "",
  sendTransaction: async () => "",
  getPrivateKey: async () => [""],
  getChainId: async () => "",
  switchChain: async () => {},
  getTokenBalance: async () => "",
  getTokenBalanceWithAddress: async () => "",
  supplyAave: async () => "",
  withdrawAave: async () => "",
});

export function useWeb3Auth(): IWeb3AuthContext {
  return useContext(Web3AuthContext);
}

interface IWeb3AuthProps {
  children?: ReactNode;
}

export const Web3AuthProvider = ({ children }: IWeb3AuthProps) => {
  const [ethersProvider, setEthersProvider] = useState<IProvider | null>(null);
  const [web3Auth, setWeb3Auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<IWalletProvider | null>(null);
  const [solprovider, setSolProvider] = useState<IWalletProvider | null>(null);
  const [tezosprovider, setTezosProvider] = useState<IWalletProvider | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chainId, setChainId] = useState<any>(null);
  const [connectedChain, setConnectedChain] = useState<CustomChainConfig>(chain["Sepolia Testnet"]);
  const [connected, setConnected] = useState<boolean>(false);

  const setWalletProvider = useCallback(async (web3authProvider: IProvider | null) => {
    setEthersProvider(web3authProvider);
    const walletProvider = getEVMWalletProvider(web3authProvider);
    const solWalletProvider = await getSolanaWalletProvider(web3authProvider);
    const tezosWalletProvider = await getTezosWalletProvider(web3authProvider);
    setSolProvider(solWalletProvider);
    setTezosProvider(tezosWalletProvider);
    setProvider(walletProvider);
    setAddress(await walletProvider.getAddress());
    setBalance(await walletProvider.getBalance());
    setChainId(await walletProvider.getChainId());
  }, []);

  useEffect(() => {
    async function init() {
      try {
        const clientId = "BCqPWVEYpxRQaQKlTqcoZf3ChePO95Xn2IlfIuxsRJO1zofLmC7637tP0Tth8SWkzxXfkTHCgxSgg1TeihZmlGc";
        const web3AuthInstance = new Web3Auth({
          clientId,
          chainConfig: chain["Polygon Mumbai Testnet"],
          web3AuthNetwork: OPENLOGIN_NETWORK.SAPPHIRE_DEVNET,
          uiConfig: {
            appName: "Kuma",
            defaultLanguage: "en",
            mode: "dark",
            theme: {
              primary: "#a56cfe",
              gray: "#000000",
            },
            logoDark: "https://emerald-rear-parakeet-3.mypinata.cloud/ipfs/QmaiRcC9vgzQCibCW45ExTXbGuYA9Sf3Hi6dP6pbAwsb6N",
            logoLight: "https://emerald-rear-parakeet-3.mypinata.cloud/ipfs/QmSZ669ihCSY7fom6YinAmzFEfgnpD4QPay8FN2dHFLHdS",
            loginMethodsOrder: ["twitter"],
          },
        });
        const openloginAdapter = new OpenloginAdapter({
          // loginSettings: {
          //   mfaLevel: "optional",
          // },
          adapterSettings: {
            uxMode: "redirect", // "redirect" | "popup"
            // mfaSettings: {
            //   deviceShareFactor: {
            //     enable: true,
            //     priority: 1,
            //     mandatory: true,
            //   },
            //   backUpShareFactor: {
            //     enable: true,
            //     priority: 2,
            //     mandatory: false,
            //   },
            //   socialBackupFactor: {
            //     enable: true,
            //     priority: 3,
            //     mandatory: false,
            //   },
            //   passwordFactor: {
            //     enable: true,
            //     priority: 4,
            //     mandatory: false,
            //   },
            // },
          },
        });
        web3AuthInstance.configureAdapter(openloginAdapter);
        await web3AuthInstance.initModal({
          modalConfig: {
            [WALLET_ADAPTERS.OPENLOGIN]: {
              label: "openlogin",
              loginMethods: {
                twitter: {
                  name: "X",
                  mainOption: true,
                },
              },
            },
          },
        });
        if (web3AuthInstance.status === "connected") {
          setWalletProvider(web3AuthInstance.provider);
          setUser(await web3AuthInstance.getUserInfo());
          setConnected(true);
          setTimeout(() => {
            setIsLoading(false);
            toast.success('Logged in successfully!');
          }, 750);
        }
        setWeb3Auth(web3AuthInstance);
      } catch (error) {
        toast.error("error");
        console.log(error);
      } finally {
          setIsLoading(false);
      }
    }
    init();
  }, [setWalletProvider]);

  const login = async () => {
    if (!web3Auth) {
      toast.error("web3auth not initialized yet");
      return;
    }
    await web3Auth.connect();

    if (web3Auth.status === "connected") {
      setWalletProvider(web3Auth.provider);
      setUser(await web3Auth.getUserInfo());
      setConnected(true);
    }
  };

  const logout = async () => {
    toast.error("Logged out");
    if (!web3Auth) {
      toast.error("web3auth not initialized yet");
      return;
    }
    await web3Auth.logout();
    setProvider(null);
    setConnected(false);
  };

  const getUserInfo = async () => {
    if (!web3Auth) {
      toast.error("web3auth not initialized yet");
      return;
    }
    const userInfo = await web3Auth.getUserInfo();
    setUser(userInfo);
    return userInfo;
  };

  const getAddress = async () => {
    if (!provider) {
      toast.error("provider not initialized yet");
      return "";
    }
    let updatedAddress = await provider.getAddress();
    if(chainId === "3" || chainId === "2") {
      updatedAddress = await solprovider!.getAddress();
    }
    setAddress(updatedAddress);
    toast(updatedAddress);
    return address;
  };

  const getAddresses = async () : Promise<string[]> => {
    if (!provider) {
      toast.error("provider not initialized yet");
      return [""];
    }
    let updatedAddress : string[] = [await provider.getAddress()];
    updatedAddress.push(await solprovider!.getAddress());
    return updatedAddress;
  };

  const getBalance = async () => {
    if (!web3Auth) {
      toast.error("web3auth not initialized yet");
      return "";
    }
    let updatedBalance = await provider!.getBalance();
    if(chainId === "3" || chainId === "2") {updatedBalance = await solprovider!.getBalance();}
    if(chainId === "Tezos") {updatedBalance = await tezosprovider!.getBalance();}
    setBalance(updatedBalance);
    toast(updatedBalance);
    return balance;
  };

  const signMessage = async (message: string) => {
    if (!web3Auth) {
      toast.error("web3auth not initialized yet");
      return "";
    }
    let signature = await provider!.signMessage(message);
    if(chainId === "3" || chainId === "2") {signature = await solprovider!.signMessage(message);}
    if(chainId === "Tezos") {signature = await tezosprovider!.signMessage(message);}
    toast(signature);
    return signature;
  };

  const sendTransaction = async (amount: number, destination: string, tok: string,setLoading: (loading: boolean) => void) => {
    if (!web3Auth) {
      toast.error("web3auth not initialized yet");
      return "";
    }

      setLoading(true);
      let promise = () => provider!.sendTransaction(amount, destination, tok);
      if(chainId === "3" || chainId === "2"){ promise = () => solprovider!.sendTransaction(amount, destination);}
      if(chainId === "Tezos") { promise = () => tezosprovider!.sendTransaction(amount, destination);}
      toast.promise(promise, {
        loading: 'Sending transaction...',
        success: (data) => {
          setLoading(false);
          if(chainId === "Tezos"){return (<>Transaction successfully sent <ExternalLink size={15} className="cursor-pointer" onClick={()=>window.open(`${connectedChain.blockExplorer}${data}`)}/></>);}
          return (<>Transaction successfully sent <ExternalLink size={15} className="cursor-pointer" onClick={()=>window.open(`${connectedChain.blockExplorer}tx/${data}`)}/></>);
        },
        error: (error) => {
          setLoading(false);
          return (<>An error occured</>);
        },
      });
  };

  const getPrivateKey = async () => {
    if (!web3Auth) {
      toast.error("web3auth not initialized yet");
      return "";
    }
    let privateKeys : string[] = [await provider!.getPrivateKey()];
    privateKeys.push(await solprovider!.getPrivateKey());
    privateKeys.push(await tezosprovider!.getPrivateKey());
    return privateKeys;
  };

  const getChainId = async () => {
    if (!web3Auth) {
      toast.error("web3auth not initialized yet");
      return "";
    }
    if(chainId === "3" || chainId === "2") {return solprovider!.getChainId();}
    if(chainId === "Tezos") {return tezosprovider!.getChainId();}
    await provider!.getChainId();
  };
  
  const switchChain = async (tok: string) => {
    if (!provider || !solprovider) {
      toast.error("provider not initialized yet");
      return;
    }
    console.log(token[tok].network!)
    if(token[tok].network! === "Solana" || token[tok].network! === "Solana Devnet") {
      setAddress(await solprovider.getAddress());
      setBalance(await solprovider.getBalance());
      setChainId(await solprovider.getChainId());
    }
    else if(token[tok].network! === "Tezos Ghostnet") {
      console.log("Switching to Tezos");
      setAddress(await tezosprovider!.getAddress());
      setBalance(await tezosprovider!.getBalance());
      setChainId(await tezosprovider!.getChainId());
    }
    else{
      await web3Auth!.addChain(chain[token[tok].network!]);
      await web3Auth!.switchChain(chain[token[tok].network!]);
      setAddress(await provider.getAddress());
      setBalance(await provider.getTokenBalance(tok));
      setChainId(await provider.getChainId());
    }
    setConnectedChain(chain[token[tok].network!]);
    toast.success("Switched chain to " + token[tok].network);
  };

  const getTokenBalance = async (tok: string) => {
    if (!provider) {
      toast.error("provider not initialized yet");
      return "";
    }
    let balance = await provider.getTokenBalance(tok);
    if(token[tok].network! === "Solana" || token[tok].network! === "Solana Devnet") {
      balance = await solprovider!.getBalance();
    }
    else if(token[tok].network! === "Tezos Ghostnet") {
      balance = await tezosprovider!.getBalance();
    }
    return balance;
  };

  const getTokenBalanceWithAddress = async (address: string) => {
    if (!provider) {
      toast.error("provider not initialized yet");
      return "";
    }
    const balance = await provider.getTokenBalanceWithAddress(address);
    return balance;
  };

  const supplyAave = async (cont: string, tok: string, amount: string,setLoading: (loading: boolean) => void): Promise<string> => {
    if(!provider) {
      toast.error("provider not initialized yet");
      return "";
    }
    setLoading(true);
    await switchChain(tok);
    let promise = () => provider.supplyAave(cont, tok, amount);
    if( contract[cont].wrappedAddress) {
      promise = () => provider.depositETHAave(cont, tok, amount);
    }
    toast.promise(promise, {
      loading: 'Sending transaction...',
      success: (data) => {
        setLoading(false);
        console.log(data);
        return (<>Successfully Staked <ExternalLink size={15} className="cursor-pointer" onClick={()=>window.open(`${chain[token[tok].network].blockExplorer}/tx/${data.hash}`)}/></>); // Display the transaction hash in the success message
      },
      error: (error) => {
        setLoading(false);
        console.log(error);
        return (<>An error occured</>);
      },
    });

    return "supplied";
  };

  const withdrawAave = async (cont: string, tok: string,setLoading: (loading: boolean) => void): Promise<string> => {
    if(!provider) {
      toast.error("provider not initialized yet");
      return "";
    }
    setLoading(true);
    await switchChain(tok);
    let promise = () => provider.withdrawAave(cont, tok);
    if( contract[cont].wrappedAddress) {
      promise = () => provider.withdrawETHAave(cont, tok);
    }
    toast.promise(promise, {
      loading: 'Sending transaction...',
      success: (data) => {
        setLoading(false);
        console.log(data);
        return (<>Successfully Staked <ExternalLink size={15} className="cursor-pointer" onClick={()=>window.open(`${chain[token[tok].network].blockExplorer}/tx/${data.hash}`)}/></>); // Display the transaction hash in the success message
      },
      error: (error) => {
        setLoading(false);
        console.log(error);
        return (<>An error occured</>);
      },
    });
    return "withdrawn";
  };

  const contextProvider = {
    ethersProvider,
    web3Auth,
    provider,
    user,
    isLoading,
    address,
    balance,
    chainId,
    connectedChain,
    connected,
    login,
    logout,
    getUserInfo,
    getAddress,
    getAddresses,
    getBalance,
    signMessage,
    sendTransaction,
    getPrivateKey,
    getChainId,
    switchChain,
    getTokenBalance,
    getTokenBalanceWithAddress,
    supplyAave,
    withdrawAave,
  };
  return <Web3AuthContext.Provider value={contextProvider}>
    {isLoading ? <Loading/>:
      connected ? children : <Login/>
    }
  </Web3AuthContext.Provider>;
};
