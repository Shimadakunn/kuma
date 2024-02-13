type TokenType = {
    coin: string;
    name: string;
    decimals?: number;
    chainId: string;
    address?: string;
}


export const token: {
    [key: string]: TokenType;
  } = {
    ethereum: {
        coin: "ETH",
        name: "Ethereum",
        decimals: 18,
        chainId: "0x1",
    },
    "ethereum-sepolia": {
        coin: "ETH SEP",
        name: "Ethereum Sepolia",
        decimals: 18,
        chainId: "0xaa36a7"
    },
    "dai-sepolia": {
        coin: "DAI SEP",
        name: "Dai Sepolia",
        decimals: 18,
        chainId: "0xaa36a7",
        address: "0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357",
    },
    matic: {
        coin: "MATIC",
        name: "Matic",
        decimals: 18,
        chainId: "0x89",
    },
    "matic-mumbai": {
        coin: "MATIC Mumbai",
        name: "Matic",
        decimals: 18,
        chainId: "0x13881",
    },
    usdc: {
        coin: "USDC",
        name: "USD Coin",
        decimals: 6,
        chainId: "0x1",
    },
    solana :{
        coin: "SOL",
        name: "Solana",
        decimals: 9,
        chainId: "0x3",
    },
    "solana-devnet" :{
        coin: "SOL Devnet",
        name: "Solana Devnet",
        decimals: 9,
        chainId: "0x2",
    }
} 