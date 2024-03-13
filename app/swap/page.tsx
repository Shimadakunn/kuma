"use client";
import dynamic from 'next/dynamic';

const ServerComponent = dynamic(() => import('./ssr'), { ssr: false });

export default function Home() {

  return (
    <ServerComponent />
  );
}
