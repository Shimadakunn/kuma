"use client";
import { getPublicCompressed } from "@toruslabs/eccrypto";
import { CustomChainConfig, IProvider, WALLET_ADAPTERS } from "@web3auth/base";
import { Web3Auth } from "@web3auth/modal";
import { OPENLOGIN_NETWORK, OpenloginAdapter } from "@web3auth/openlogin-adapter";
import * as jose from "jose";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

import { chain } from "../config/chainConfig";
import { getWalletProvider, IWalletProvider } from "./walletProvider";

import Login from "../components/login-page";
import Loading from "../components/ui/loading-page";

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
  getSignature: (message: string) => Promise<string>;
  sendTransaction: (amount: string, destination: string) => Promise<string>;
  getPrivateKey: () => Promise<string>;
  getChainId: () => Promise<string>;
  deployContract: (abi: any, bytecode: string, initValue: string) => Promise<any>;
  readContract: (contractAddress: string, contractABI: any) => Promise<string>;
  writeContract: (contractAddress: string, contractABI: any, updatedValue: string) => Promise<string>;
  verifyServerSide: (idToken: string) => Promise<any>;
  switchChain: (network: string) => Promise<void>;
  updateConnectedChain: (network: string) => void;
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
  getSignature: async () => "",
  sendTransaction: async () => "",
  getPrivateKey: async () => "",
  getChainId: async () => "",
  deployContract: async () => {},
  readContract: async () => "",
  writeContract: async () => "",
  verifyServerSide: async () => {},
  switchChain: async () => null,
  updateConnectedChain: () => {},
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
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [playgroundConsole, setPlaygroundConsole] = useState<string>("");
  const [chainId, setChainId] = useState<any>(null);
  const [connectedChain, setConnectedChain] = useState<CustomChainConfig>(chain["Sepolia Testnet"]);
  const [connected, setConnected] = useState<boolean>(false);

  const setWalletProvider = useCallback(async (web3authProvider: IProvider | null) => {
    const walletProvider = getWalletProvider(web3authProvider);
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
            mode: "dark", // light, dark or auto
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
    const updatedBalance = await provider!.getBalance();

    setBalance(updatedBalance);
    toast(updatedBalance);
    return balance;
  };

  const getSignature = async (message: string) => {
    if (!web3Auth) {
      toast.error("web3auth not initialized yet");
      return "";
    }
    const signature = await provider!.getSignature(message);
    toast(signature);
    return signature;
  };

  const sendTransaction = async (amount: string, destination: string) => {
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
        return (<>Transaction successfully sent <ExternalLink size={15} className="cursor-pointer" onClick={()=>window.open(`{connectedChain.ticker}/tx/${data.match(hashPattern)}`)}/></>); // Display the transaction hash in the success message
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
    const privateKey = await provider!.getPrivateKey();
    toast("Private Key: "+ privateKey);
    return privateKey;
  };

  const getChainId = async () => {
    if (!web3Auth) {
      toast.error("web3auth not initialized yet");
      return "";
    }

    await provider!.getChainId();
  };

  const deployContract = async (abi: any, bytecode: string, initValue: string): Promise<any> => {
    if (!web3Auth) {
      toast.error("web3auth not initialized yet");
      return;
    }
    const receipt = await provider!.deployContract(abi, bytecode, initValue);
    return receipt;
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

  const parseToken = (token: any) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace("-", "+").replace("_", "/");
      return JSON.parse(window.atob(base64 || ""));
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const verifyServerSide = async (idTokenInFrontend: string) => {
    try {
      if (!provider) {
        toast.error("provider not initialized yet");
        return;
      }
      const privKey: string = await web3Auth!.provider?.request({
        method: "eth_private_key",
      });
      const pubkey = getPublicCompressed(Buffer.from(privKey, "hex")).toString("hex");

      const jwks = jose.createRemoteJWKSet(new URL("https://api.openlogin.com/jwks"));
      const jwtDecoded = await jose.jwtVerify(idTokenInFrontend, jwks, {
        algorithms: ["ES256"],
      });
      if ((jwtDecoded.payload as any).wallets[0].public_key === pubkey) {
        toast.success(
          "Validation Success!"+
          "Public Key from Provider: "+
          pubkey+
          "Public Key from decoded JWT: "+
          (jwtDecoded.payload as any).wallets[0].public_key+
          "Parsed Id Token: "+
          await parseToken(idTokenInFrontend)
        );
      } else {
        toast.error("Failed");
      }
    } catch (e) {
      toast.error("Error")
      console.log(e);
    }
  };

  const switchChain = async (network: string) => {
    if (!provider) {
      toast.error("provider not initialized yet");
      return;
    }

    await web3Auth!.addChain(chain[network]);
    await web3Auth!.switchChain(chain[network]);
    setChainId(await provider.getChainId());
    setAddress(await provider.getAddress());
    setBalance(await provider.getBalance());

    toast.success("Switched chain to " + network);
  };

  const updateConnectedChain = (network: string) => {
    setConnectedChain(chain[network]);
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
    getSignature,
    sendTransaction,
    getPrivateKey,
    getChainId,
    deployContract,
    readContract,
    writeContract,
    verifyServerSide,
    switchChain,
    updateConnectedChain,
  };
  return <Web3AuthContext.Provider value={contextProvider}>
    {isLoading ? <Loading/>:
      connected ? children : <Login/>
    }
  </Web3AuthContext.Provider>;
};
