import type { IProvider } from "@web3auth/base";
import { ethers } from "ethers";

import { token } from "@/config/tokenConfig";
import { signPermitSigature } from "ethers-js-permit";

import { Web3Eth } from "web3-eth";
import { Web3 } from "web3";

// import { json } from "stream/consumers";
import ERC20 from "@/public/abi/ERC20.json";
import { IWalletProvider } from "./walletProvider";

import { toast } from "sonner";
import exp from "constants";

const ethersWeb3Provider = (provider: IProvider | null): IWalletProvider => {
  const getAddress = async (): Promise<string> => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider as any);

      const signer = await ethersProvider.getSigner();
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

  const signMessage = async (message: string): Promise<string> => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider as any);
      const signer = await ethersProvider.getSigner();
      const signedMessage = await signer.signMessage(message);
      return signedMessage;
    } catch (error: any) {
      toast.error(error);
      return error.toString();
    }
  };

  const sendTransaction = async (
    amount: number,
    destination: string
  ): Promise<string> => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider as any);
      const signer = await ethersProvider.getSigner();
      const amountBigInt = ethers.parseEther(amount.toString());
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
      return error as string;
    }
  };

  const getBalance = async (): Promise<string> => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider as any);
      const signer = await ethersProvider.getSigner();
      const address = signer.getAddress();
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

  const getTokenBalance = async (tok: string) => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider as any);
      const signer = await ethersProvider.getSigner();
      if (token[tok].address) {
        const contract = new ethers.Contract(
          token[tok].address!,
          ERC20,
          signer
        );
        const res = ethers.formatEther(
          await contract.balanceOf(signer.getAddress())
        );
        const balance = (+res).toFixed(4);
        return balance;
      } else {
        const address = signer.getAddress();
        const res = ethers.formatEther(
          await ethersProvider.getBalance(address)
        );
        const balance = (+res).toFixed(4);
        return balance;
      }
    } catch (error: any) {
      return error as string;
    }
  };

  const readContract = async (contractAddress: string, contractABI: any) => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider as any);
      const signer = await ethersProvider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      const address = await signer.getAddress();
      const message = await contract.getUserAccountData(address);
      return message;
    } catch (error: any) {
      return error as string;
    }
  };

  const writeContract = async (
    contractAddress: string,
    tokenAddress: string,
    contractABI: any,
    amount: string
  ) => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider as any);
      const signer = await ethersProvider.getSigner();
      const address = await signer.getAddress();
      const erc20 = new ethers.Contract(tokenAddress, ERC20, signer);
      const expiry = Math.floor(Date.now() / 1000) + 4200;
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      const domain = {
        name: await erc20.name(),
        version: "1",
        chainId: (await ethersProvider!.getNetwork()).chainId,
        verifyingContract: tokenAddress,
      };
      const types = {
        Permit: [
          { name: "owner", type: "address" },
          { name: "spender", type: "address" },
          { name: "value", type: "uint256" },
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint256" },
        ],
      };
      const message = {
        owner: address,
        spender: contractAddress,
        value: ethers.parseUnits(amount),
        nonce: 3,
        deadline: expiry,
      };
      const signature = await signer.signTypedData(domain, types, message);
      const r = signature.slice(0, 66);
      const s = "0x" + signature.slice(66, 130);
      const v = Number("0x" + signature.slice(130, 132));
      const balance = await erc20.balanceOf(address);
      console.log("balance "+ balance);
      console.log("amount "+ ethers.parseUnits(amount));
      console.log("tokenAddress " +tokenAddress +" amount " +ethers.parseUnits(amount)+" address "+address+" expiry "+expiry+" v "+v+" r "+r+" s "+s);
      const tx = await contract.supplyWithPermit(
        tokenAddress,
        ethers.parseUnits(amount),
        address,
        0,
        expiry,
        v,
        r,
        s, {
          gasLimit: 800000
        }
      );
      const receipt = await tx.wait();
      return receipt;
    } catch (error: any) {
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
