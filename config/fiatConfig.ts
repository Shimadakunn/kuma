export type Fiattype = {
    coin: string;
    name: string;
    decimals?: number;
}

export const fiat: {
    [key: string]: Fiattype;
  } = {
    "usd": {
        coin: "USD",
        name: "US Dollar",
        decimals: 2,
    },
    "eur": {
        coin: "EUR",
        name: "Euro",
        decimals: 2,
    },
  };