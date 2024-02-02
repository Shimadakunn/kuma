"use client";
import Image from "next/image";
import { useEffect } from 'react';

import { Label } from '@radix-ui/react-label';
import Background from "../../public/images/3.png";
import Background2 from "../../public/images/4.png";


const LoadingPage = () => {
    useEffect(() => {
        async function getLoader() {
          const { hatch } = await import('ldrs')
          hatch.register()
        }
        getLoader()
        }, [])
    return ( 
        <div className="absolute w-screen h-screen flex items-center justify-center">
            <Label className="text-5xl font-[Monument] font-black tracking-tighter pl-4">
                LOADING
                <span className="dot animate-dot">.</span>
                <span className="dot animate-dot delay-1">.</span>
                <span className="dot animate-dot delay-2">.</span>
            </Label>
            <Image src={Background} alt="coin" className="absolute top-0 right-0 w-[40%]"/>
            <Image src={Background2} alt="coin" className="absolute bottom-0 left-0 w-[40%]"/>
        </div>
    );
}

export default LoadingPage;