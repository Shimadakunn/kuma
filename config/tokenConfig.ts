type TokenType = {
    coin: string;
    name: string;
    decimals?: number;
    image: string;
    chainId: string;
}


export const token: {
    [key: string]: TokenType;
  } = {
    ethereum: {
        coin: "ETH",
        name: "Ethereum",
        decimals: 18,
        image: "https://sideshift.ai/api/v2/coins/icon/ETH",
        chainId: "0x1"
    },
    matic: {
        coin: "MATIC",
        name: "Matic",
        decimals: 18,
        image: "https://sideshift.ai/api/v2/coins/icon/MATIC",
        chainId: "0x89"
    },
    "ethereum-sepolia": {
        coin: "ETH SEP",
        name: "Ethereum Sepolia",
        decimals: 18,
        image: "https://sideshift.ai/api/v2/coins/icon/ETH",
        chainId: "0xaa36a7"
    },
    usdc: {
        coin: "USDC",
        name: "USD Coin",
        decimals: 6,
        image: "https://sideshift.ai/api/v2/coins/icon/USDC",
        chainId: "0x1"
    }
  } 