import { CHAIN_NAMESPACES, CustomChainConfig } from "@web3auth/base";

export const chain: {
  [key: string]: CustomChainConfig;
} = {
  "Sepolia Testnet": {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0xaa36a7",
    displayName: "Ethereum Sepolia",
    tickerName: "Ethereum",
    ticker: "ETH",
    rpcTarget: "https://sepolia.infura.io/v3/a78ea67f650a46e8bd97f3262d1cef43",
    blockExplorer: "https://sepolia.etherscan.io",
  },
  "Polygon Mumbai Testnet": {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x13881",
    rpcTarget: "https://polygon-mumbai.infura.io/v3/a78ea67f650a46e8bd97f3262d1cef43",
    displayName: "Polygon Mumbai Testnet",
    blockExplorer: "https://mumbai.polygonscan.com/",
    ticker: "MATIC",
    tickerName: "Matic",
  },
  "Arbitrum Sepolia Testnet": {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x66eee",
    rpcTarget: "https://arbitrum-sepolia.infura.io/v3/a78ea67f650a46e8bd97f3262d1cef43",
    displayName: "Arbitrum Sepolia Testnet",
    blockExplorer: "https://sepolia.arbiscan.io/",
    ticker: "ARB",
    tickerName: "Ethereum",
  },
  "Avalanche Fuji Testnet": {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0xa869",
    rpcTarget: "https://avalanche-fuji.infura.io/v3/a78ea67f650a46e8bd97f3262d1cef43",
    displayName: "Avalanche Fuji Testnet",
    blockExplorer: "https://testnet.snowtrace.io/",
    ticker: "AVAX",
    tickerName: "AVAX",
  },
  "Solana Devnet": {
    chainId: "Solana",
    displayName: "Solana Testnet",
    chainNamespace: CHAIN_NAMESPACES.SOLANA,
    tickerName: "SOLANA",
    ticker: "SOL",
    decimals: 18,
    rpcTarget: "https://api.testnet.solana.com",
    blockExplorer: "https://explorer.solana.com/?cluster=testnet",
  },
  "Tezos Ghostnet":{
    chainNamespace: CHAIN_NAMESPACES.OTHER,
    chainId: "Tezos",
    rpcTarget: "https://ghostnet.tezos.marigold.dev/",
    displayName: "Tezos",
    blockExplorer: "https://ghostnet.tzkt.io/",
    ticker: "XTZ",
    tickerName: "Tezos",
  },
  "Etherlink Testnet":{
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x128123",
    rpcTarget: "https://node.ghostnet.etherlink.com/",
    displayName: "Etherlink Testnet",
    blockExplorer: "https://testnet-explorer.etherlink.com/",
    ticker: "XTZ",
    tickerName: "Tezos",
  },
  "Starknet Goerli":{
    chainNamespace: CHAIN_NAMESPACES.OTHER,
    chainId: "Starknet",
    rpcTarget: "https://starknet-goerli.infura.io/v3/a78ea67f650a46e8bd97f3262d1cef43",
    displayName: "Starknet Goerli",
    blockExplorer: "https://testnet.starkscan.co/",
    ticker: "STRK",
    tickerName: "Starknet",
  },
  Ethereum: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x1",
    displayName: "Ethereum Mainnet",
    rpcTarget: "https://mainnet.infura.io/v3/a78ea67f650a46e8bd97f3262d1cef43",
    blockExplorer: "https://etherscan.io",
    ticker: "ETH",
    tickerName: "Ethereum",
  },
  Polygon: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x89", // hex of 137, polygon mainnet
    rpcTarget: "https://polygon-mainnet.infura.io/v3/a78ea67f650a46e8bd97f3262d1cef43",
    // Avoid using public rpcTarget in production.
    // Use services like Infura, Quicknode etc
    displayName: "Polygon Mainnet",
    blockExplorer: "https://polygonscan.com",
    ticker: "MATIC",
    tickerName: "Matic",
  },
  "BNB Chain": {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x38",
    rpcTarget: "https://rpc.ankr.com/bsc",
    displayName: "Binance SmartChain Mainnet",
    blockExplorer: "https://bscscan.com/",
    ticker: "BNB",
    tickerName: "BNB",
  },
  Avalanche: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0xA86A", // hex of 43114
    rpcTarget: "https://rpc.ankr.com/avalanche-c",
    // Avoid using public rpcTarget in production.
    // Use services like Infura, Quicknode etc
    displayName: "Avalanche C-Chain Mainnet",
    blockExplorer: "https://subnets.avax.network/c-chain",
    ticker: "AVAX",
    tickerName: "AVAX",
  },
  Arbitrum: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0xA4B1", // hex of 42161
    rpcTarget: "https://arbitrum-mainnet.infura.io/v3/a78ea67f650a46e8bd97f3262d1cef43",
    // Avoid using public rpcTarget in production.
    // Use services like Infura, Quicknode etc
    displayName: "Arbitrum Mainnet",
    blockExplorer: "https://arbiscan.io",
    ticker: "AETH",
    tickerName: "AETH",
  },
  Optimism: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0xA", // hex of 10
    rpcTarget: "https://optimism-mainnet.infura.io/v3/a78ea67f650a46e8bd97f3262d1cef43",
    // Avoid using public rpcTarget in production.
    // Use services like Infura, Quicknode etc
    displayName: "Optimism Mainnet",
    blockExplorer: "https://optimistic.etherscan.io",
    ticker: "OP",
    tickerName: "OP",
  },
  Solana: {
    chainNamespace: CHAIN_NAMESPACES.SOLANA,
    chainId: "0x3",
    rpcTarget: "https://summer-frosty-friday.solana-devnet.quiknode.pro/5430f85cfb9a90ac2763131b24d8a746f2d18825/",
    displayName: "Solana Mainnet",
    blockExplorer: "https://explorer.solana.com",
    ticker: "SOL",
    tickerName: "SOL",
  },
  Tezos: {
    chainNamespace: CHAIN_NAMESPACES.OTHER,
    chainId: "0x4",
    rpcTarget: "https://rpc.tzbeta.net/",
    displayName: "Tezos",
    blockExplorer: "https://tzstats.com",
    ticker: "XTZ",
    tickerName: "Tezos"
  }
};
