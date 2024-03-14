"use client";

import {
  UserRound,
  PawPrint,
  Home,
  ArrowRightLeft,
  HandCoins,
  PercentCircle,
  Send,
  CreditCard ,
  Webhook 
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import Image from "next/image";
import Logo from "@/public/logo-white.png";

const Footer = () => {
  return (
    <footer className="w-[6vw] h-screen p-4 mr-8 ml-2">
      <div className="w-full h-full bg-primary/70 rounded-xl flex items-center justify-between flex-col px-10 pt-4 pb-8">
        <div className="flex items-center flex-col space-y-8">
          <Image src={Logo} width={60} height={60} alt="logo" className="mb-4"/>
          <Icons path_name="" tooltip="Go to Home Page"/>
          <Icons path_name="swap" tooltip="Swap Tokens"/>
          <Icons path_name="stake" tooltip="Stake Tokens"/>
          <Icons path_name="send" tooltip="Send / Receive Tokens"/>
          <Icons path_name="onramp" tooltip="Buy Tokens with Fiat"/>
        </div>
        <Icons path_name="profile" tooltip="See Profile Info"/>
      </div>
    </footer>
  );
};

export default Footer;

type FooterProps = {
  path_name: string;
  tooltip: string;
};

const Icons: React.FC<FooterProps> = ({ path_name, tooltip }) => {
  const router = useRouter();
  const path = usePathname();
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`flex items-center justify-center cursor-pointer p-3 ${
              path === "/" + path_name ? "bg-foreground" : "bg-transparent"
            }  rounded-xl`}
            onClick={() => router.push("/" + path_name)}
          >
            {path_name === "" ? (
              <Home
                size={32}
                color={`${path === "/" + path_name ? "black" : "#ebe9e9"}`}
              />
            ) : path_name === "swap" ? (
              <ArrowRightLeft
                size={32}
                color={`${path === "/" + path_name ? "black" : "#ebe9e9"}`}
              />
            ) : path_name === "stake" ? (
              <HandCoins
                size={32}
                color={`${path === "/" + path_name ? "black" : "#ebe9e9"}`}
              />
            ) : path_name === "profile" ? (
              <UserRound
                size={32}
                color={`${path === "/" + path_name ? "black" : "#ebe9e9"}`}
              />
            ) : path_name === "send" ? (
              <Send
                size={32}
                color={`${path === "/" + path_name ? "black" : "#ebe9e9"}`}
              />
            ) :
            path_name === "onramp" ? (
              <CreditCard
                size={32}
                color={`${path === "/" + path_name ? "black" : "#ebe9e9"}`}
              />
            ) :
             (
              ""
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
