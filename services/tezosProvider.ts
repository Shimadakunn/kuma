import { CommonJRPCProvider } from "@web3auth/base-provider";

import { IWalletProvider } from "./walletProvider";

import { toast } from "sonner";

const ethersWeb3Provider = (sk: string): IWalletProvider => {
    return {
        getTokenBalance,
        getAddress,
        getBalance,
        getChainId,
        signMessage,
        sendTransaction,
        getPrivateKey,
      };
    };
    
    export default ethersWeb3Provider;