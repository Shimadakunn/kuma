// web3auth.tsx
"use client"

import dynamic from 'next/dynamic';
import { ReactNode, createContext, useContext } from "react";
import { IWalletProvider } from './walletProvider';

const Web3AuthProviderWithWindow = dynamic(
  () => import('./Web3AuthProviderWithWindow').then((mod) => mod.Web3AuthProvider),
  { ssr: false }
);

interface IWeb3AuthProps {
  children?: ReactNode;
}

export const Web3AuthProvider = ({ children }: IWeb3AuthProps) => {
  return <Web3AuthProviderWithWindow>{children}</Web3AuthProviderWithWindow>;
};

const Web3Auth = dynamic(
  () => import('./Web3AuthProviderWithWindow').then((mod) => mod.Web3AuthProvider),
  { ssr: false }
);