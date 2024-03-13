"use client";
import dynamic from 'next/dynamic';
import { Label } from '@radix-ui/react-label';

const ServerComponent = dynamic(() => import('./ssr'),
 { ssr: false,
  loading: () => <div className='h-full w-full flex items-center justify-center'><Label className="text-5xl font-[Monument] font-black tracking-tighter pl-8">
  LOADING
  <span className="dot animate-dot">.</span>
  <span className="dot animate-dot delay-1">.</span>
  <span className="dot animate-dot delay-2">.</span>
</Label>
</div>
  }
);

export default function Home() {

  return (
    <ServerComponent />
  );
}
