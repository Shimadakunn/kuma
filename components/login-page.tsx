"use client";
import { useWeb3Auth } from "../services/web3auth";

import Image from "next/image";
import Background from "../public/images/2-white.png";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { Twitter, Github, Facebook ,Youtube, PawPrint } from 'lucide-react';

const Landing = () => {
    const { login } = useWeb3Auth();
    return (
        <main className="relative h-screen w-screen">
            <header className="text-5xl font-[Monument] font-black tracking-tighter pl-8 pt-4 flex items-center justify-start">
            <PawPrint size={50} strokeWidth={2} color="white" className="mr-4"/> 
            <div>KUMA</div> 
            </header>
            <div className="absolute left-0 bottom-0 h-[90vh] pl-28">
                <Image src={Background} alt="landing" className="w-full h-full object-cover"/>
                <div className="bg-primary w-full h-[80%] absolute left-0 bottom-0">
                </div>
            </div>
            <div className="absolute left-0 bottom-0 h-[90vh] pl-28">
                <Image src={Background} alt="landing" className="w-full h-full object-cover"/>
            </div>
            <div className="absolute right-0 bottom-0 h-[90vh] w-[45%] flex items-start justify-center space-y-16 flex-col pl-12">
                <h1 className="text-5xl font-[Monument] font-black tracking-tighter">OWN YOUR MONEY</h1>
                <p className="text-2xl font-light tracking-tighter">Take control of your money and data</p>
                <Button className="bg-foreground rounded-none hover:bg-foreground/90 tracking-tighter" onClick={login}>GET STARTED</Button>
                <Dialog>
                    <DialogTrigger asChild>
                    </DialogTrigger>
                    <DialogContent className="border border-[#a56cfe]/50">
                        <DialogHeader>
                        <DialogTitle className="text-xl">Connect with</DialogTitle>
                        <DialogDescription>
                            Your Web3 portfolio in one click
                        </DialogDescription>
                        </DialogHeader>
                            <div className="pt-4 flex items-start justify-center space-y-4 flex-col">
                                <Label className="font-light text-lg">Social Logins</Label>
                                <div className="flex space-x-8 w-full items-center justify-center pb-8">
                                    <div className="bg-foreground rounded-3xl flex items-center justify-center p-4 hover:bg-foreground/90 cursor-pointer"
                                        onClick={login}>
                                        <Twitter size={32} color="black"/>
                                    </div>
                                    <div className="bg-foreground rounded-3xl flex items-center justify-center p-4 hover:bg-foreground/90 cursor-pointer">
                                        <Youtube size={32} color="black"/>
                                    </div>
                                    <div className="bg-foreground rounded-3xl flex items-center justify-center p-4 hover:bg-foreground/90 cursor-pointer">
                                        <Facebook size={32} color="black"/>
                                    </div>
                                    <div className="bg-foreground rounded-3xl flex items-center justify-center p-4 hover:bg-foreground/90 cursor-pointer">
                                        <Github size={32} color="black"/>
                                    </div>
                                </div>
                                <Label className="font-light text-lg">Phone Login</Label>
                                <div className="flex items-center justify-center w-full pb-8">
                                    <Input placeholder="Ex: 0712459874" className="w-[75%] border-0 bg-primary/15 font-light"/>
                                </div>
                                <div className="flex items-center justify-center w-full">
                                    <Button className="w-[98%] bg-foreground rounded-none hover:bg-foreground/90 tracking-tighter">LOG IN</Button>
                                </div>
                            </div>
                    </DialogContent>
                </Dialog>
            </div>
        </main>
    );
}

export default Landing;