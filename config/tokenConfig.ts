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
    "matic-mumbai": {
        coin: "MATIC",
        name: "Matic",
        decimals: 18,
        chainId: "0x13881",
        network: "Polygon Mumbai Testnet",
    },
    "dai-mumbai": {
        coin: "DAI",
        name: "Dai Mumbai",
        decimals: 18,
        chainId: "0x13881",
        network: "Polygon Mumbai Testnet",
        address: "0xc8c0Cf9436F4862a8F60Ce680Ca5a9f0f99b5ded",
        aave: "0x9973Ce75946D56fA3B0C6aa3647d67D440BDAec8"
    },
    "usdc-mumbai": {
        coin: "USDC",
        name: "USD Coin Mumbai",
        decimals: 6,
        chainId: "0x13881",
        network: "Polygon Mumbai Testnet",
        address: "0x52D800ca262522580CeBAD275395ca6e7598C014",
        aave: "0x4086fabeE92a080002eeBA1220B9025a27a40A49"
    },
    "eurs-mumbai": {
        coin: "EURS",
        name: "EURS Mumbai",
        decimals: 2,
        chainId: "0x13881",
        network: "Polygon Mumbai Testnet",
        address: "0xB516d30421d2A0524769A243BBE5e193E78ab35c",
        aave: "0x6fD1376295392f1F6F9EcCc89bff0e26dDB2aE74"
    },
    "weth-mumbai": {
        coin: "WETH",
        name: "Wrapped Ether Mumbai",
        decimals: 18,
        chainId: "0x13881",
        network: "Polygon Mumbai Testnet",
        address: "0xc199807AF4fEDB02EE567Ed0FeB814A077de4802",
        aave: "0xAba444af64ad33A6d8575b8A353226997d6A126a"
    },
    "wbtc-mumbai": {
        coin: "WBTC",
        name: "Wrapped Bitcoin Mumbai",
        decimals: 8,
        chainId: "0x13881",
        network: "Polygon Mumbai Testnet",
        address: "0x2Fa2e7a6dEB7bb51B625336DBe1dA23511914a8A",
        aave: "0xdA67e6C1171D4f0D522Db7f127B88405eA1535d4"
    },
    "solana-devnet" :{
        coin: "SOL",
        name: "Solana Devnet",
        decimals: 9,
        chainId: "0x2",
        network: "Solana Devnet",
    },
    // "dai-sepolia": {
    //     coin: "DAI",
    //     name: "Dai Sepolia",
    //     decimals: 18,
    //     chainId: "0xaa36a7",
    //     network : "Sepolia Testnet",
    //     address: "0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357",
    //     aave: "0x29598b72eb5CeBd806C5dCD549490FdA35B13cD8"
    // },
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