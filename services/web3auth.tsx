"use client";
import { CustomChainConfig, IProvider, WALLET_ADAPTERS } from "@web3auth/base";
import { Web3Auth } from "@web3auth/modal";
import { OPENLOGIN_NETWORK, OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

import { chain } from "../config/chainConfig";
import { getEVMWalletProvider, getSolanaWalletProvider, IWalletProvider } from "./walletProvider";


import Loading from "../components/loading-page";
import Login from "../components/login-page";

import { ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export interface IWeb3AuthContext {
  web3Auth: Web3Auth | null;
  connected: boolean;
  provider: IWalletProvider | null;
  isLoading: boolean;
  user: any;
  address: string;
  balance: string;
  chainId: string;
  playgroundConsole: string;
  connectedChain: CustomChainConfig;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getUserInfo: () => Promise<any>;
  getAddress: () => Promise<string>;
  getBalance: () => Promise<string>;
  signMessage: (message: string) => Promise<string>;
  sendTransaction: (amount: number, destination: string) => Promise<string>;
  getPrivateKey: () => Promise<string>;
  getChainId: () => Promise<string>;
  readContract: (contractAddress: string, contractABI: any) => Promise<string>;
  writeContract: (contractAddress: string, contractABI: any, updatedValue: string) => Promise<string>;
  switchChain: (network: string) => Promise<void>;
}

export const Web3AuthContext = createContext<IWeb3AuthContext>({
  web3Auth: null,
  provider: null,
  isLoading: false,
  connected: false,
  user: null,
  address: null,
  balance: null,
  chainId: null,
  playgroundConsole: "",
  connectedChain: chain["Sepolia Testnet"],
  login: async () => {},
  logout: async () => {},
  getUserInfo: async () => null,
  getAddress: async () => "",
  getBalance: async () => "",
  signMessage: async () => "",
  sendTransaction: async () => "",
  getPrivateKey: async () => "",
  getChainId: async () => "",
  readContract: async () => "",
  writeContract: async () => "",
  switchChain: async () => {},
});

export function useWeb3Auth(): IWeb3AuthContext {
  return useContext(Web3AuthContext);
}

interface IWeb3AuthProps {
  children?: ReactNode;
}

export const Web3AuthProvider = ({ children }: IWeb3AuthProps) => {
  const [web3Auth, setWeb3Auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<IWalletProvider | null>(null);
  const [solprovider, setSolProvider] = useState<IWalletProvider | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [playgroundConsole, setPlaygroundConsole] = useState<string>("");
  const [chainId, setChainId] = useState<any>(null);
  const [connectedChain, setConnectedChain] = useState<CustomChainConfig>(chain["Sepolia Testnet"]);
  const [connected, setConnected] = useState<boolean>(false);

  const setWalletProvider = useCallback(async (web3authProvider: IProvider | null) => {
    const walletProvider = getEVMWalletProvider(web3authProvider);
    const solWalletProvider = await getSolanaWalletProvider(web3authProvider);
    setSolProvider(solWalletProvider);
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
          chainConfig: chain["Sepolia Testnet"],
          web3AuthNetwork: OPENLOGIN_NETWORK.SAPPHIRE_DEVNET,
          uiConfig: {
            defaultLanguage: "en",
            mode: "dark",
            theme: {
              primary: "#a56cfe",
            },
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
    if(chainId === "0x3") {
      const updatedAddress = await solprovider!.getAddress();
      setAddress(updatedAddress);
      toast(updatedAddress);
      return address;
    }
    const updatedAddress = await provider.getAddress();
    setAddress(updatedAddress);
    toast(updatedAddress);
    return address;
  };

  const getBalance = async () => {
    if (!web3Auth) {
      toast.error("web3auth not initialized yet");
      return "";
    }
    if(chainId === "0x3") {
      const updatedBalance = await solprovider!.getBalance();
      setBalance(updatedBalance);
      toast(updatedBalance);
      return balance;
    }

    const updatedBalance = await provider!.getBalance();
    setBalance(updatedBalance);
    toast(updatedBalance);
    return balance;
  };

  const signMessage = async (message: string) => {
    if (!web3Auth) {
      toast.error("web3auth not initialized yet");
      return "";
    }
    if(chainId === "0x3") {
      const signature = await solprovider!.signMessage(message);
      toast(signature);
      return signature;
    }
    const signature = await provider!.signMessage(message);
    toast(signature);
    return signature;
  };

  const sendTransaction = async (amount: number, destination: string) => {
    if (!web3Auth) {
      toast.error("web3auth not initialized yet");
      return "";
    }
    const promise = () => provider!.sendTransaction(amount, destination);
    toast.promise(promise, {
      loading: 'Sending transaction...',
      success: (data) => {
        //TODO: Receipe can callback and can't handle it
        const hashPattern = /0x[a-fA-F0-9]{64}/;
        return (<>Transaction successfully sent <ExternalLink size={15} className="cursor-pointer" onClick={()=>window.open(`${connectedChain.blockExplorer}/tx/${data.match(hashPattern)}`)}/></>); // Display the transaction hash in the success message
      },
      error: (error) => {
        return `Error`;
      },
    });
  };

  const getPrivateKey = async () => {
    if (!web3Auth) {
      toast.error("web3auth not initialized yet");
      return "";
    }
    if(chainId === "0x3") {
      const privateKey = await solprovider!.getPrivateKey();
      toast("Private Key: "+ privateKey);
      return privateKey;
    }
    const privateKey = await provider!.getPrivateKey();
    toast("Private Key: "+ privateKey);
    return privateKey;
  };

  const getChainId = async () => {
    if (!web3Auth) {
      toast.error("web3auth not initialized yet");
      return "";
    }
    if(chainId === "0x3") {
      return solprovider!.getChainId();
    }
    await provider!.getChainId();
  };

  const readContract = async (contractAddress: string, contractABI: any): Promise<string> => {
    if (!provider) {
      toast.error("provider not initialized yet");
      return;
    }
    const message = await provider.readContract(contractAddress, contractABI);
    toast(message);
  };

  const writeContract = async (contractAddress: string, contractABI: any, updatedValue: string): Promise<string> => {
    if (!provider) {
      toast.error("provider not initialized yet");
      return;
    }
    const receipt = await provider.writeContract(contractAddress, contractABI, updatedValue);
    toast(receipt);

    if (receipt) {
      setTimeout(async () => {
        await readContract(contractAddress, contractABI);
      }, 2000);
    }
  };

  const switchChain = async (network: string) => {
    if (!provider || !solprovider) {
      toast.error("provider not initialized yet");
      return;
    }
    console.log(chain[network])
    
    if(network === "Solana") {
      setAddress(await solprovider.getAddress());
      setBalance(await solprovider.getBalance());
      setChainId(await solprovider.getChainId());
    }
    else{
      await web3Auth!.addChain(chain[network]);
      await web3Auth!.switchChain(chain[network]);
      setAddress(await provider.getAddress());
      setBalance(await provider.getBalance());
      setChainId(await provider.getChainId());
    }
    setConnectedChain(chain[network]);

    toast.success("Switched chain to " + network);
  };

  const contextProvider = {
    web3Auth,
    provider,
    user,
    isLoading,
    address,
    balance,
    chainId,
    playgroundConsole,
    connectedChain,
    connected,
    login,
    logout,
    getUserInfo,
    getAddress,
    getBalance,
    signMessage,
    sendTransaction,
    getPrivateKey,
    getChainId,
    readContract,
    writeContract,
    switchChain
  };
  return <Web3AuthContext.Provider value={contextProvider}>
    {isLoading ? <Loading/>:
      connected ? children : <Login/>
    }
  </Web3AuthContext.Provider>;
};
