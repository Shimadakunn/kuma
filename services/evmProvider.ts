import type { IProvider } from "@web3auth/base";
import { ethers } from "ethers";

import { token } from "@/config/tokenConfig";
import AAVE from "@/public/abi/aave.json";

// import { json } from "stream/consumers";
import ERC20 from "@/public/abi/ERC20.json";
import { IWalletProvider } from "./walletProvider";

import { toast } from "sonner";

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

  const getTokenBalanceWithAddress = async (address: string) => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider as any);
      const signer = await ethersProvider.getSigner();
      const contract = new ethers.Contract(
        address,
        ERC20,
        signer
      );
      const res = ethers.formatEther(
        await contract.balanceOf(signer.getAddress())
      );
      const balance = (+res).toFixed(4);
      return balance;
    } catch (error: any) {
      return error as string;
    }
  };

  const supplyAave = async (
    contractAddress: string,
    tok: string,
    amount: string
  ) => {
    try {
      console.log(token[tok].address)
      const expiry = Math.floor(Date.now() / 1000) + 3600;
      const ethersProvider = new ethers.BrowserProvider(provider as any);
      const signer = await ethersProvider.getSigner();
      const address = await signer.getAddress();
      const contract = new ethers.Contract(contractAddress,AAVE,signer);
      const erc20 = new ethers.Contract(token[tok].address!, ERC20, signer);
      const nonces = await erc20.nonces(address);
      const domain = {name: await erc20.name(),version: "1",chainId: (await ethersProvider!.getNetwork()).chainId,verifyingContract: token[tok].address!,};
      const types = {Permit: [{ name: "owner", type: "address" },{ name: "spender", type: "address" },{ name: "value", type: "uint256" },{ name: "nonce", type: "uint256" },{ name: "deadline", type: "uint256" },],};
      const message = {owner: address,spender: contractAddress,value: ethers.parseUnits(amount),nonce: nonces,deadline: expiry,};
      const signature = await signer.signTypedData(domain, types, message);
      const r = signature.slice(0, 66);
      const s = "0x" + signature.slice(66, 130);
      const v = Number("0x" + signature.slice(130, 132));
      const tx = await contract.supplyWithPermit(token[tok].address!,ethers.parseUnits(amount),address,0,expiry,v,r,s, {gasLimit: 800000,});
      const receipt = await tx.wait();
      return receipt;
    } catch (error: any) {
      return error as string;
    }
  };

  const withdrawAave = async (contractAddress: string, tok: string) => {
    try {
      console.log(contractAddress);
      const ethersProvider = new ethers.BrowserProvider(provider as any);
      const signer = await ethersProvider.getSigner();
      const contract = new ethers.Contract(contractAddress, AAVE, signer);
      const aerc20 = new ethers.Contract(token[tok].aave!, ERC20, signer);
      const aerc20Balance = await aerc20.balanceOf(signer.getAddress());
      const tx = await contract.withdraw(token[tok].address!,aerc20Balance,signer.getAddress());
      const receipt = await tx.wait();
      return receipt;
    } catch (error: any) {
      return error as string;
    }
  }

  return {
    getAddress,
    getBalance,
    getChainId,
    signMessage,
    sendTransaction,
    getPrivateKey,
    getTokenBalance,
    getTokenBalanceWithAddress,
    supplyAave,
    withdrawAave,
  };
};

export default ethersWeb3Provider;
