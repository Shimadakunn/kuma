
"use client";
import { useWeb3Auth } from "@/services/Web3AuthProviderWithWindow";
import { Button } from "@/components/ui/button";

const ClientSideComponent = () => {
  const { interactTezosContract } = useWeb3Auth();

  return (
    <Button onClick={interactTezosContract}>Refresh</Button>
  );
};

export default ClientSideComponent;