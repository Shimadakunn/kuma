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
  connectedChain: CustomChainConfig;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getUserInfo: () => Promise<any>;
  getAddresses: () => Promise<string[]>;
  getBalances: () => Promise<string>;
  getPrivateKeys: () => Promise<string[]>;
  signMessage: (message: string) => Promise<string>;
  sendTransaction: (amount: number, destination: string, tok: string,setLoading: (loading: boolean) => void, dispatch?: Function) => Promise<string>;
  switchChain: (network: string) => Promise<void>;
  supplyAave: (contractAddress: string, tok: string, amount: string, dispatch?: Function) => Promise<string>;
  withdrawAave: (contractAddress: string, tok: string, amount: string, dispatch?: Function) => Promise<string>;
}

export const Web3AuthContext = createContext<IWeb3AuthContext>({
  ethersProvider: null,
  web3Auth: null,
  provider: null,
  isLoading: false,
  connected: false,
  user: null,
  connectedChain: chain["Polygon Mumbai Testnet"],
  login: async () => {},
  logout: async () => {},
  getUserInfo: async () => null,
  getAddresses : async () => [""],
  getBalances: async () => "",
  getPrivateKeys: async () => [""],
  signMessage: async () => "",
  sendTransaction: async () => "",
  switchChain: async () => {},
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
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [connectedChain, setConnectedChain] = useState<CustomChainConfig>(chain["Polygon Mumbai Testnet"]);
  const [connected, setConnected] = useState<boolean>(false);

  const setWalletProvider = useCallback(async (web3authProvider: IProvider | null) => {
    setEthersProvider(web3authProvider);
    const walletProvider = getEVMWalletProvider(web3authProvider);
    const solWalletProvider = await getSolanaWalletProvider(web3authProvider);
    const tezosWalletProvider = await getTezosWalletProvider(web3authProvider);
    setSolProvider(solWalletProvider);
    setTezosProvider(tezosWalletProvider);
    setProvider(walletProvider);
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
        }
        else{
          setIsLoading(false);
        }
        setWeb3Auth(web3AuthInstance);
      } catch (error) {
        toast.error("error");
        console.log(error);
      }
    }
    init();
  }, [setWalletProvider]);

  useEffect(() => {
    const fetchData = async () => {
      if (connected && provider && solprovider && tezosprovider) {
        await getBalances();
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, [connected,provider,solprovider,tezosprovider]);

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

  const getAddresses = async () : Promise<string[]> => {
    if (!provider) {
      toast.error("provider not initialized yet");
      return [""];
    }
    let updatedAddress : string[] = [await provider.getAddress()];
    updatedAddress.push(await solprovider!.getAddress());
    updatedAddress.push(await tezosprovider!.getAddress());
    return updatedAddress;
  };

  const getBalances = async () => {
    if (!web3Auth) {
      toast.error("web3auth not initialized yet");
      return "";
    }
    console.log("Getting Balances...")
    const balancePromises = Object.keys(token).map(async (key) => {
      if (token[key].network === "Solana Devnet") {
        return solprovider!.getBalance(key);
      } else if (token[key].network === "Tezos Ghostnet") {
        return tezosprovider!.getBalance(key);
      } else {
        return provider!.getBalance(key);
      }
    });
    
    await Promise.all(balancePromises);
    return "balance updated";
  };

  const getPrivateKeys = async () => {
    if (!web3Auth) {
      toast.error("web3auth not initialized yet");
      return "";
    }
    let privateKeys : string[] = [await provider!.getPrivateKey()];
    privateKeys.push(await solprovider!.getPrivateKey());
    privateKeys.push(await tezosprovider!.getPrivateKey());
    return privateKeys;
  };

  const signMessage = async (message: string) => {
    if (!web3Auth) {
      toast.error("web3auth not initialized yet");
      return "";
    }
    let signature = await provider!.signMessage(message);
    if(connectedChain.chainId === "0x3") {signature = await solprovider!.signMessage(message);}
    if(connectedChain.chainId === "Tezos") {signature = await tezosprovider!.signMessage(message);}
    toast(signature);
    return signature;
  };

  const sendTransaction = async (amount: number, destination: string, tok: string,setLoading: (loading: boolean) => void, dispatch?: Function ) => {
    if (!web3Auth) {
      toast.error("web3auth not initialized yet");
      return "";
    }

      setLoading(true);
      let promise = () => provider!.sendTransaction(amount, destination, tok);
      if(connectedChain.chainId === "0x3"){ promise = () => solprovider!.sendTransaction(amount, destination);}
      if(connectedChain.chainId === "Tezos") { promise = () => tezosprovider!.sendTransaction(amount, destination);}
      toast.promise(promise, {
        loading: 'Sending transaction...',
        success: async (data) => {
          await getBalances();
          setLoading(false);
          if(dispatch !== undefined){dispatch();}
          if(connectedChain.chainId === "Tezos"){return (<div className="flex">Transaction successfully sent <ExternalLink size={15} className="cursor-pointer ml-1" onClick={()=>window.open(`${connectedChain.blockExplorer}${data}`)}/></div>);}
          return (<div className="flex">Transaction successfully sent <ExternalLink size={15} className="cursor-pointer ml-1" onClick={()=>window.open(`${connectedChain.blockExplorer}tx/${data}`)}/></div>);
        },
        error: (error) => {
          console.log(error);
          setLoading(false);
          return (<>An error occured</>);
        },
      });
  };
  
  const switchChain = async (tok: string) => {
    if (!provider || !solprovider) {
      toast.error("provider not initialized yet");
      return;
    }
    if(connectedChain.chainId === chain[token[tok].network!].chainId) {return;}
    if(chain[token[tok].network!].chainId !== "0x2" && chain[token[tok].network!].chainId !== "Tezos") {
      await web3Auth!.addChain(chain[token[tok].network!]);
      await web3Auth!.switchChain(chain[token[tok].network!]);
    }
    setConnectedChain(chain[token[tok].network!]);
    toast.success("Switched chain to " + token[tok].network);
  };

  const supplyAave = async (cont: string, tok: string, amount: string, dispatch?: Function ): Promise<string> => {
    if(!provider) {
      toast.error("provider not initialized yet");
      return "";
    }
    await switchChain(tok);
    let promise = () => provider!.supplyAave!(cont, tok, amount);
    if(contract[cont].wrappedAddress) {
      promise = () => provider!.depositETHAave!(cont, tok, amount);
    }
    toast.promise(promise, {
      loading: 'Sending transaction...',
      success: async (data) => {
        await getBalances();
        dispatch!();
        return (<div className="flex">Successfully Staked <ExternalLink size={15} className="cursor-pointer ml-1" onClick={()=>window.open(`${chain[token[tok].network].blockExplorer}/tx/${data.hash}`)}/></div>);
      },
      error: (error) => {
        console.log(error);
        return (<>An error occured</>);
      },
    });
    return "supplied";
  };

  const withdrawAave = async (cont: string, tok: string, amount: string, dispatch?: Function): Promise<string> => {
    if(!provider) {
      toast.error("provider not initialized yet");
      return "";
    }
    await switchChain(tok);
    let promise = () => provider.withdrawAave!(cont, tok, amount);
    if( contract[cont].wrappedAddress) {
      promise = () => provider.withdrawETHAave!(cont, tok, amount);
    }
    toast.promise(promise, {
      loading: 'Sending transaction...',
      success: async (data) => {
        await getBalances();
        dispatch!();
        return (<div className="flex">Successfully Staked <ExternalLink size={15} className="cursor-pointer ml-1" onClick={()=>window.open(`${chain[token[tok].network].blockExplorer}/tx/${data.hash}`)}/></div>);
      },
      error: (error) => {
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
    connectedChain,
    connected,
    login,
    logout,
    getUserInfo,
    getAddresses,
    getBalances,
    getPrivateKeys,
    signMessage,
    sendTransaction,
    switchChain,
    supplyAave,
    withdrawAave,
  };

  return <Web3AuthContext.Provider value={contextProvider}>
    {isLoading ? <Loading/>:
      connected ? children : <Login/>
    }
  </Web3AuthContext.Provider>;
};
