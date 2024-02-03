"use client";
import { CHAIN_NAMESPACES, IProvider, WALLET_ADAPTERS } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { createContext, useEffect, useState } from "react";
import { ContractFactory, ethers } from "ethers";
import Web3 from "web3";

import { toast } from 'sonner';

import Loading from "../components/ui/loading-page";
import Login from "./login-page";

const clientId =
  "BCqPWVEYpxRQaQKlTqcoZf3ChePO95Xn2IlfIuxsRJO1zofLmC7637tP0Tth8SWkzxXfkTHCgxSgg1TeihZmlGc";

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0xaa36a7",
  displayName: "Ethereum Sepolia",
  blockExplorer: "https://sepolia.etherscan.io/",
  ticker: "ETH",
  tickerName: "Sepolia",
  rpcTarget: "https://sepolia.infura.io/v3/a78ea67f650a46e8bd97f3262d1cef43",
};

const web3auth = new Web3AuthNoModal({
  clientId,
  chainConfig,
  web3AuthNetwork: "sapphire_devnet",
});

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

const openloginAdapter = new OpenloginAdapter({
  adapterSettings: {
    clientId,
    uxMode: "redirect",
    whiteLabel: {
      appName: "W3A Heroes",
      appUrl: "https://web3auth.io",
      logoLight: "https://web3auth.io/images/web3auth-logo.svg",
      logoDark: "https://web3auth.io/images/web3auth-logo---Dark.svg",
      defaultLanguage: "en", // en, de, ja, ko, zh, es, fr, pt, nl
      mode: "dark", // whether to enable dark mode. defaultValue: auto
      theme: {
        primary: "#a56cfe",
      },
      useLogoLoader: true,
    },
  },
  privateKeyProvider,
});
web3auth.configureAdapter(openloginAdapter);

export const ProviderContext = createContext<{
  provider: IProvider | null;
  login: () => void;
  logout: () => void;
  userInfo: any | undefined;
  getUserInfo: () => void;
  accounts: string[] | undefined;
  getAccounts: () => void;
  balance: string | undefined;
  getBalance: () => void;
  signedMessage: string | undefined;
  signMessage: (message: string) => void;
  sendTransaction: (amount: number, toAddress: string) => void;
}>({});

export default function Provider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<any | undefined>(undefined);
  const [accounts, setAccounts] = useState<string[] | undefined>(undefined);
  const [balance, setBalance] = useState<string | undefined>(undefined);
  const [signedMessage, setSignedMessage] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.init();
        setProvider(web3auth.provider);
        if (web3auth.connected) {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error(error);
      }
    };
    init();
    setTimeout(() => {
    setLoading(false);
    toast.success('Logged in successfully!');
  }, 750);
  }, []);
  
  const login = async () => {
    const web3authProvider = await web3auth.connectTo(
      WALLET_ADAPTERS.OPENLOGIN,
      {
        loginProvider: "google",
        // loginProvider: 'sms_passwordless',
        // extraLoginOptions: {
        //     login_hint: "+33-768681759",
        // }
      }
    );
    setProvider(web3authProvider);
    if (web3auth.connected) {
      setLoggedIn(true);
    }
  };

  const getUserInfo = async () => {
    const user = await web3auth.getUserInfo();
    setUserInfo(user);
  };

  const logout = async () => {
    await web3auth.logout();
    setProvider(null);
    setLoggedIn(false);
    toast.error("logged out");
  };

  const getAccounts = async () => {
    if (!provider) {
      toast.error("provider not initialized yet");
      return;
    }
    const web3 = new Web3(provider as any);
    const address = await web3.eth.getAccounts();
    setAccounts(address);
  };

  const getBalance = async () => {
    if (!provider) {
      toast.error("provider not initialized yet");
      return;
    }
    const web3 = new Web3(provider as any);
    const address = (await web3.eth.getAccounts())[0];
    const balance = web3.utils.fromWei(
      await web3.eth.getBalance(address), // Balance is in wei
      "ether"
    );
    setBalance(balance);
  };

  const signMessage = async (message: string) => {
    if (!provider) {
      toast.error("provider not initialized yet");
      return;
    }
    const web3 = new Web3(provider as any);
    const fromAddress = (await web3.eth.getAccounts())[0];
    const signedMessage = await web3.eth.personal.sign(
      message,
      fromAddress,
      ""
    );
    setSignedMessage(signedMessage);
  };

  const sendTransaction = async (amount:number, toAddress:string ): Promise<string> => {
    // if (!provider){
    //   toast.error("An error has occured.");
    //   return;
    // }
    // const web3 = new Web3(provider as any);
    // const fromAddress = (await web3.eth.getAccounts())[0];
    // // const amountInWei = web3.utils.toWei(amount!, "ether");
    // toast(fromAddress);
    // toast(toAddress);
    // // toast(amountInWei);
    // const receipt = await web3.eth.sendTransaction({
    //   from: fromAddress,
    //   to: "0x63972913FC6FA0dd24250E0F0cEe8724b47a8e14",
    //   value: "1000000000000000",
    // })
    // toast.success(`Transaction Hash: ${receipt.transactionHash}`);
    try {
      const ethersProvider = new ethers.BrowserProvider(provider as any);

      const signer = await ethersProvider.getSigner();

      const amountBigInt = ethers.parseEther(amount.toString());
      const tx = await signer.sendTransaction({
        to: toAddress,
        value: amountBigInt,
        maxPriorityFeePerGas: "5000000000",
        maxFeePerGas: "6000000000000",
      });
      toast.success(`Transaction Hash: ${tx.hash}`);
      return `Transaction Hash: ${tx.hash}`;
    } catch (error: any) {
      toast.error(`Error: ${error.message}`); 
      return error as string;
    }
  };

  return (
    <ProviderContext.Provider
      value={{
        provider,
        login,
        logout,
        userInfo,
        getUserInfo,
        accounts,
        getAccounts,
        balance,
        getBalance,
        signedMessage,
        signMessage,
        sendTransaction,
      }}
    >
      {loading ? <Loading/>:
        loggedIn ? children : <Login/>
      }
    </ProviderContext.Provider>
  );
}