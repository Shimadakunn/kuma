type ContractType = {
    name: string;
    chainId: string;
    network?: string;
    address: string;
    tokenArray: TokenType[];
}

import { token, TokenType } from "./tokenConfig";

export const contract: {
    [key: string]: ContractType;
  } = {
    "aave-sepolia": {
        name: "Aave Sepolia",
        chainId: "0xaa36a7",
        network: "Sepolia Testnet",
        address: "0x0562453c3DAFBB5e625483af58f4E6D668c44e19",
        tokenArray: [token["ethereum-sepolia"],token["dai-sepolia"],token["adai-sepolia"]]
    },
  };