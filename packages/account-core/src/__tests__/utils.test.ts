import { isEraVMContract } from "../utils";

describe("isEraVMContract - Integration Tests", () => {
  it("should work with real testnet contract", async () => {
    const realContractAddress = "0x56e9fd8991506f6bc79a7e2e3c2c2a471fbb62ac";

    const result = await isEraVMContract(realContractAddress, true);

    expect(typeof result).toBe("boolean");
    expect(result).toBe(true);
  }, 5000);

  it("should work with real mainnet contract", async () => {
    const realContractAddress = "0x56e9fd8991506f6bc79a7e2e3c2c2a471fbb62ac";

    const result = await isEraVMContract(realContractAddress, false);

    expect(typeof result).toBe("boolean");
    expect(result).toBe(false);
  }, 5000);
});
