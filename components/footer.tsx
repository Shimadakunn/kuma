"use client";

import {
  UserRound,
  PawPrint,
  Home,
  ArrowRightLeft,
  HandCoins,
  PercentCircle,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Footer = () => {
  return (
    <footer className="w-[6vw] h-screen p-4 mr-8 ml-2">
      <div className="w-full h-full bg-primary rounded flex items-center justify-between flex-col pt-4 pb-8">
        <div className="flex items-center justify-between flex-col space-y-8">
          <PawPrint size={60} color="#d0f500" />
          <Icons path_name="" tooltip="Go to Home Page"/>
          <Icons path_name="swap" tooltip="Swap Tokens"/>
          <Icons path_name="stake" tooltip="Stake Tokens"/>
          <Icons path_name="lend" tooltip="Lend Tokens"/>
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
            className={`flex items-center justify-center cursor-pointer p-4 ${
              path === "/" + path_name ? "bg-foreground" : "bg-transparent"
            }  rounded-xl`}
            onClick={() => router.push("/" + path_name)}
          >
            {path_name === "" ? (
              <Home
                size={35}
                color={`${path === "/" + path_name ? "black" : "#ebe9e9"}`}
              />
            ) : path_name === "swap" ? (
              <ArrowRightLeft
                size={35}
                color={`${path === "/" + path_name ? "black" : "#ebe9e9"}`}
              />
            ) : path_name === "stake" ? (
              <HandCoins
                size={35}
                color={`${path === "/" + path_name ? "black" : "#ebe9e9"}`}
              />
            ) : path_name === "lend" ? (
              <PercentCircle
                size={35}
                color={`${path === "/" + path_name ? "black" : "#ebe9e9"}`}
              />
            ) : path_name === "profile" ? (
              <UserRound
                size={35}
                color={`${path === "/" + path_name ? "black" : "#ebe9e9"}`}
              />
            ) : (
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
