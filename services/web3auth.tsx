// web3auth.tsx
"use client"
import dynamic from 'next/dynamic';
import { ReactNode, useContext } from "react";
import { Web3AuthContext } from '@/services/Web3AuthProviderWithWindow';

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

// useWeb3Auth.ts
export const useWeb3Auth = () => {
  const context = useContext(Web3AuthContext);
  return context || null;
};