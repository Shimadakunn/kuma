type ContractType = {
    name: string;
    chainId: string;
    network?: string;
    address: string;
    tokenArray: string[];
}

export const contract: {
    [key: string]: ContractType;
  } = {
    "aave-mumbai": {
      name: "Aave Mumbai",
      chainId: "0x13881",
      network: "Polygon Mumbai Testnet",
      address: "0xcC6114B983E4Ed2737E9BD3961c9924e6216c704",
      tokenArray: ["dai-mumbai","usdc-mumbai","eurs-mumbai","weth-mumbai","wbtc-mumbai"]
    },
    // "aave-sepolia": {
    //   name: "Aave Sepolia",
    //   chainId: "0xaa36a7",
    //   network: "Sepolia Testnet",
    //   address: "0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951",
    //   tokenArray: ["ethereum-sepolia"]
    // },
};