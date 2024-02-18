export type TokenType = {
    coin: string;
    name: string;
    decimals?: number;
    chainId: string;
    network?: string;
    address?: string;
    aave?: string;
}


export const token: {
    [key: string]: TokenType;
  } = {
    "ethereum-sepolia": {
        coin: "ETH",
        name: "Ethereum Sepolia",
        decimals: 18,
        chainId: "0xaa36a7",
        network : "Sepolia Testnet"
    },
    "dai-sepolia": {
        coin: "DAI",
        name: "Dai Sepolia",
        decimals: 18,
        chainId: "0xaa36a7",
        network : "Sepolia Testnet",
        address: "0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357",
        aave: "0x29598b72eb5CeBd806C5dCD549490FdA35B13cD8"
    },
    "matic-mumbai": {
        coin: "MATIC",
        name: "Matic",
        decimals: 18,
        chainId: "0x13881",
        network: "Polygon Mumbai Testnet",
    },
    "solana-devnet" :{
        coin: "SOL",
        name: "Solana Devnet",
        decimals: 9,
        chainId: "0x2",
        network: "Solana Devnet",
    },
    // ethereum: {
    //     coin: "ETH",
    //     name: "Ethereum",
    //     decimals: 18,
    //     chainId: "0x1",
    //     network: "Ethereum",
    // },
    // usdc: {
    //     coin: "USDC",
    //     name: "USD Coin",
    //     decimals: 18,
    //     chainId: "0x1",
    //     network: "Ethereum",
    //     address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    // },
    // matic: {
    //     coin: "MATIC",
    //     name: "Matic",
    //     decimals: 18,
    //     chainId: "0x89",
    //     network: "Polygon",
    // },
    // solana :{
    //     coin: "SOL",
    //     name: "Solana",
    //     decimals: 9,
    //     chainId: "0x3",
    //     network: "Solana",
    // },
} 