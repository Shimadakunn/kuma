import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import type { IProvider } from "@web3auth/base";
import { ethers } from "ethers";

import { contract } from "@/config/contractConfig";
import {chain} from "@/config/chainConfig";
import { token } from "@/config/tokenConfig";
import ERC20 from "@/public/abi/ERC20.json";
import AAVE from "@/public/abi/aave.json";
import AAVEETH from "@/public/abi/aaveETH.json";

// import { json } from "stream/consumers";
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
    destination: string,
    tok?: string
  ): Promise<string> => {
    try {
      console.log("Evm sending transaction")
      const ethersProvider = new ethers.BrowserProvider(provider as any);
      const signer = await ethersProvider.getSigner();
      let amountBigInt = ethers.parseEther(amount.toString());
      if(token[tok!].address){
        console.log("Token transfer")
        const erc20 = new ethers.Contract(token[tok!].address!, ERC20, signer);
        const decimals = await erc20.decimals();
        amountBigInt = ethers.parseUnits(amount.toString(),decimals);
        const tx = await erc20.transfer(destination, amountBigInt);
        await tx.wait();
        return tx.hash;
      }
      const tx = await signer.sendTransaction({
        to: destination,
        value: amountBigInt,
        maxPriorityFeePerGas: "5000000000", // Max priority fee per gas
        maxFeePerGas: "6000000000000", // Max fee per gas
      });
      await tx.wait();
      return tx.hash;
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
      const privateKey = await provider?.request({
        method: "eth_private_key",
      });
      const ethersProvider = new ethers.JsonRpcProvider(chain[token[tok].network].rpcTarget);
      const signer = new ethers.Wallet(privateKey as string, ethersProvider);
      if (token[tok].address) {
        const contract = new ethers.Contract(
          token[tok].address!,
          ERC20,
          signer
        );
        const decimals = await contract.decimals();
        const res = ethers.formatUnits(
          await contract.balanceOf(signer.getAddress()),decimals
        );
        const balance = (+res).toFixed(4);
        console.log("Balance: ",balance)
        token[tok].balance = balance;
      } else {
        const address = signer.getAddress();
        const res = ethers.formatEther(
          await ethersProvider.getBalance(address)
        );
        const balance = (+res).toFixed(4);
        token[tok].balance = balance;
      }
      if (token[tok].aave) {
        const contract = new ethers.Contract(
          token[tok].aave!,
          ERC20,
          signer
        );
        const decimals = await contract.decimals();
        const res = ethers.formatUnits(
          await contract.balanceOf(signer.getAddress()),decimals
        );
        const balance = (+res).toFixed(4);
        token[tok].aaveBalance = balance;
        console.log("Aave Balance: ",balance)
      }
      return;
    } catch (error: any) {
      return;
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
      const decimals = await contract.decimals();
      const res = ethers.formatUnits(
        await contract.balanceOf(signer.getAddress()),decimals
      );
      const balance = (+res).toFixed(4);
      return balance;
    } catch (error: any) {
      return "";
    }
  };

  const supplyAave = async (cont: string,tok: string,amount: string) => {
    try {
      const expiry = Math.floor(Date.now() / 1000) + 3600;
      const ethersProvider = new ethers.BrowserProvider(provider as any);
      const signer = await ethersProvider.getSigner();
      const address = await signer.getAddress();
      const contrac = new ethers.Contract(contract[cont].address,AAVE,signer);
      const erc20 = new ethers.Contract(token[tok].address!, ERC20, signer);
      const nonces = await erc20.nonces(address);
      const decimals = await erc20.decimals();
      const domain = {name: await erc20.name(),version: "1",chainId: (await ethersProvider!.getNetwork()).chainId,verifyingContract: token[tok].address!,};
      const types = {Permit: [{ name: "owner", type: "address" },{ name: "spender", type: "address" },{ name: "value", type: "uint256" },{ name: "nonce", type: "uint256" },{ name: "deadline", type: "uint256" },],};
      const message = {owner: address,spender: contract[cont].address,value: ethers.parseUnits(amount,decimals),nonce: nonces,deadline: expiry,};
      const signature = await signer.signTypedData(domain, types, message);
      const r = signature.slice(0, 66);
      const s = "0x" + signature.slice(66, 130);
      const v = Number("0x" + signature.slice(130, 132));
      const tx = await contrac.supplyWithPermit(token[tok].address!,ethers.parseUnits(amount,decimals),address,0,expiry,v,r,s, {gasLimit: 800000,});
      const receipt = await tx.wait();
      return receipt;
    } catch (error: any) {
      return error as string;
    }
  };

  const withdrawAave = async (cont: string, tok: string) => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider as any);
      const signer = await ethersProvider.getSigner();
      const contrac = new ethers.Contract(contract[cont].address, AAVE, signer);
      const aerc20 = new ethers.Contract(token[tok].aave!, ERC20, signer);
      const aerc20Balance = await aerc20.balanceOf(signer.getAddress());
      const tx = await contrac.withdraw(token[tok].address!,aerc20Balance,signer.getAddress());
      const receipt = await tx.wait();
      return receipt;
    } catch (error: any) {
      return error as string;
    }
  };

  const depositETHAave = async (cont: string, tok: string, amount: string) => {
    const ethersProvider = new ethers.BrowserProvider(provider as any);
    const signer = await ethersProvider.getSigner();
    const address = await signer.getAddress();
    const contrac = new ethers.Contract(contract[cont].address,AAVEETH,signer);
    const tx = await contrac.depositETH(contract[cont].wrappedAddress,address,0,{value: ethers.parseEther(amount)});
    console.log(tx);
    const receipt = await tx.wait();
    return receipt;
  };

  const withdrawETHAave = async (cont: string, tok: string) => {
    const ethersProvider = new ethers.BrowserProvider(provider as any);
    const signer = await ethersProvider.getSigner();
    const address = await signer.getAddress();
    const contrac = new ethers.Contract(contract[cont].address,AAVEETH,signer);
    const aerc20 = new ethers.Contract(token[tok].aave!, ERC20, signer);
    const aerc20Balance = await aerc20.balanceOf(signer.getAddress());
    const approve = await aerc20.approve(contract[cont].address,aerc20Balance);
    const receiptApprove = await approve.wait();
    const tx = await contrac.withdrawETH(contract[cont].wrappedAddress,aerc20Balance.toString(),address,{gasLimit: 800000});
    const receipt = await tx.wait();
    return receipt;
  };

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
    depositETHAave,
    withdrawETHAave,
  };
};

export default ethersWeb3Provider;
