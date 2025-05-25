import { Address } from "viem";

export type Limit = {
  max: number;
};

export type Signer = {
  address: string;
  type: "EOA" | "Passkey" | "Contract";
  limit?: Limit;
  validUntil?: number;
};

export type Client = {
  listSigners: (address: Address) => Promise<Signer[]>;
};

export type PublicProvider = {
  readContract: (args: {
    address: Address;
    abi: any[];
    functionName: string;
    args: any[];
  }) => Promise<any>;
};
