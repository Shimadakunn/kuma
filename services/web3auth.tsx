"use client"

import dynamic from 'next/dynamic';
import { ReactNode } from "react";

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