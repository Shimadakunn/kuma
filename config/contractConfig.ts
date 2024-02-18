type ContractType = {
    name: string;
    chainId: string;
    network?: string;
    address: string;
    tokenArray: string[];
    // tokenArray: TokenType[];
}

import { token, TokenType } from "./tokenConfig";

export const contract: {
    [key: string]: ContractType;
  } = {
  "aave-sepolia": {
    name: "Aave Sepolia",
    chainId: "0xaa36a7",
    network: "Sepolia Testnet",
    address: "0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951",
    tokenArray: ["ethereum-sepolia"]
  },
  "aave-mumbai": {
    name: "Aave Mumbai",
    chainId: "0x13881",
    network: "Polygon Mumbai Testnet",
    address: "0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951",
    tokenArray: ["ethereum-sepolia","dai-mumbai"]
  },
};