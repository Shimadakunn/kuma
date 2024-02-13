import type { IProvider } from "@web3auth/base";
import { ethers } from "ethers";

// import { json } from "stream/consumers";
import ERC20 from "@/public/abi/ERC20.json";
import { IWalletProvider } from "./walletProvider";

import { toast } from "sonner";

const ethersWeb3Provider = (provider: IProvider | null): IWalletProvider => {
  const getAddress = async (): Promise<string> => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider as any);

      const signer = await ethersProvider.getSigner();

      // Get user's Ethereum public address
      const address = await signer.getAddress();
      return address;
    } catch (error: any) {
      toast.error(error);
      return error.toString();
    }
  };

  const getChainId = async (): Promise<string> => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider as any);

      return (await ethersProvider.getNetwork()).chainId.toString(16);
    } catch (error: any) {
      toast.error(error);
      return error.toString();
    }
  };

  const getBalance = async (): Promise<string> => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider as any);

      const signer = await ethersProvider.getSigner();

      // Get user's Ethereum public address
      const address = signer.getAddress();

      // Get user's balance in ether
      const res = ethers.formatEther(
        await ethersProvider.getBalance(address) // Balance is in wei
      );
      const balance = (+res).toFixed(4);
      return balance;
    } catch (error: any) {
      toast.error(error);
      return error.toString();
    }
  };

  const signMessage = async (message: string): Promise<string> => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider as any);

      const signer = await ethersProvider.getSigner();
      // Sign the message
      const signedMessage = await signer.signMessage(message);
      return signedMessage;
    } catch (error: any) {
      toast.error(error);
      return error.toString();
    }
  };

  const sendTransaction = async (amount: number, destination: string): Promise<string> => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider as any);

      const signer = await ethersProvider.getSigner();

      const amountBigInt = ethers.parseEther(amount.toString());

      // Submit transaction to the blockchain
      const tx = await signer.sendTransaction({
        to: destination,
        value: amountBigInt,
        maxPriorityFeePerGas: "5000000000", // Max priority fee per gas
        maxFeePerGas: "6000000000000", // Max fee per gas
      });
      await tx.wait();
      return `Transaction Hash: ${tx.hash}`;
    } catch (error: any) {
      return error as string;
    }
  };

  const getPrivateKey = async (): Promise<string> => {
    try {
      const privateKey = await provider?.request({
        method: "eth_private_key",
      });

      return privateKey as string;
    } catch (error: any) {
      toast.error(error);
      return error as string;
    }
  };

  const getTokenBalance = async (contractAddress: string) => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider as any);
      const signer = await ethersProvider.getSigner();
      const contract = new ethers.Contract(contractAddress, ERC20, signer);
      const res = ethers.formatEther(await contract.balanceOf(signer.getAddress()));
      const balance = (+res).toFixed(4);
      return balance;
    } catch (error: any) {
      toast.error(error);
      return error as string;
    }
  }

  const readContract = async (contractAddress: string, contractABI: any) => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider as any);
      const signer = await ethersProvider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const message = await contract.balanceOf(signer.getAddress())
      return message;
    } catch (error: any) {
      toast.error(error);
      return error as string;
    }
  };

  const writeContract = async (contractAddress: string, contractABI: any, updatedValue: string) => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider as any);

      const signer = await ethersProvider.getSigner();

      const contract = new ethers.Contract(contractAddress, JSON.parse(JSON.stringify(contractABI)), signer);

      // Send transaction to smart contract to update message
      const tx = await contract.update(updatedValue);

      // Wait for transaction to finish
      const receipt = await tx.wait();
      return receipt;
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
    readContract,
    writeContract,
    getTokenBalance,
  };
};

export default ethersWeb3Provider;
