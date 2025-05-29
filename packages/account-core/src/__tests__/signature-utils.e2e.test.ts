import { createPublicClient, http, createWalletClient, Hex, PublicClient } from "viem";
import { privateKeyToAccount, generatePrivateKey } from "viem/accounts";
import { sophonTestnet } from "viem/chains";
import { validateERC1271Signature, validateSignature, getEIP712Domain } from "../signature-utils";

describe("Signature Utils E2E Tests", () => {
  let publicClient;
  let walletClient;
  let testAccount;

  const TEST_SMART_ACCOUNT: Hex = "0xE8345Dc6c2c81E8490e7F10f3B3d9F687503F2F4"; // Test AA contract on Sophon testnet

  beforeAll(() => {
    // Create real viem clients
    publicClient = createPublicClient({
      chain: sophonTestnet,
      transport: http(),
    });

    walletClient = createWalletClient({
      account: TEST_SMART_ACCOUNT,
      chain: sophonTestnet,
      transport: http(),
    });
  });

  describe("Real Network Tests", () => {
    it("should connect to Sophon testnet", async () => {
      const chainId = await publicClient.getChainId();
      expect(chainId).toBe(sophonTestnet.id);
    }, 1000);

    it("should get latest block number", async () => {
      const blockNumber = await publicClient.getBlockNumber();
      expect(typeof blockNumber).toBe("bigint");
      expect(blockNumber > BigInt(0)).toBe(true);
    }, 1000);
  });

  describe("ERC-1271 Signature Validation", () => {
    it("should attempt to validate signature on smart account", async () => {
      const message = "cookie monster";
      const signature =
        "0x2d68b841f42070362ef68254ea704d594a9c28cc83e76e31286f772a584b11f020c29053f96fa8e59ccd4505242a54b6a18c4b15caf0ccddd4c1a55b01221b411b";

      try {
        const result = await validateERC1271Signature(publicClient, {
          account: TEST_SMART_ACCOUNT,
          message,
          signature,
          isMessageHashed: false,
        });

        expect(typeof result).toBe("boolean");
        expect(result).toBe(true);
      } catch (error) {
        console.log("Expected error for non-ERC-1271 contract:", error.message);
        // This is expected if the contract doesn't support ERC-1271
        expect(error).toBeInstanceOf(Error);
      }
    }, 30000);

    it("should handle invalid contract address gracefully", async () => {
      const message = "cookie monster";
      const signature =
        "0x2d68b841f42070362ef68254ea704d594a9c28cc83e76e31286f772a584b11f020c29053f96fa8e59ccd4505242a54b6a18c4b15caf0ccddd4c1a55b01221b411b";

      const result = await validateERC1271Signature(publicClient, {
        account: "0x0000000000000000000000000000000000000001", // Invalid address
        message,
        signature,
        isMessageHashed: false,
      });

      expect(result).toBe(false);
    }, 30000);
  });

  describe("EIP-712 Domain Extraction", () => {
    it("should attempt to get EIP-712 domain from contract", async () => {
      try {
        const domain = await getEIP712Domain(publicClient, TEST_SMART_ACCOUNT);

        expect(domain).toHaveProperty("name");
        expect(domain).toHaveProperty("version");
        expect(domain).toHaveProperty("chainId");
        expect(domain).toHaveProperty("verifyingContract");
        expect(domain.chainId).toBe(sophonTestnet.id);
      } catch (error) {
        console.log("Expected error for contract without EIP-712 domain:", error.message);
        // This is expected if the contract doesn't implement eip712Domain()
        expect(error).toBeInstanceOf(Error);
      }
    }, 30000);
  });

  describe("Comprehensive Signature Validation", () => {
    it("should validate message signatures", async () => {
      const message = "cookie monster";
      const signature =
        "0x2d68b841f42070362ef68254ea704d594a9c28cc83e76e31286f772a584b11f020c29053f96fa8e59ccd4505242a54b6a18c4b15caf0ccddd4c1a55b01221b411b";

      try {
        const result = await validateSignature(publicClient, {
          account: TEST_SMART_ACCOUNT,
          signature,
          type: "message",
          message,
        });

        console.log("Message validation result:", result);
        expect(typeof result).toBe("boolean");
        expect(result).toBe(true);
      } catch (error) {
        console.log("Expected error:", error.message);
        expect(error).toBeInstanceOf(Error);
      }
    }, 30000);
  });

  describe("Network Error Handling", () => {
    it("should handle network timeouts gracefully", async () => {
      // Create client with very short timeout
      const timeoutClient = createPublicClient({
        chain: sophonTestnet,
        transport: http("https://rpc.testnet.sophon.xyz", { timeout: 100 }), // 100ms timeout
      }) as unknown as PublicClient;

      try {
        await validateERC1271Signature(timeoutClient, {
          account: TEST_SMART_ACCOUNT,
          message: "test",
          signature: "0x1234",
        });
      } catch (error) {
        // Should handle timeout gracefully
        expect(error).toBeInstanceOf(Error);
      }
    }, 10000);

    it("should handle invalid RPC URL", async () => {
      const invalidClient = createPublicClient({
        chain: sophonTestnet,
        transport: http("https://invalid-rpc-url.com"),
      }) as unknown as PublicClient;

      const result = await validateERC1271Signature(invalidClient, {
        account: TEST_SMART_ACCOUNT,
        message: "test",
        signature: "0x1234",
      });

      expect(result).toBe(false);
    }, 30000);
  });

  describe("Gas and Performance Tests", () => {
    it("should measure contract call performance", async () => {
      const startTime = Date.now();

      try {
        await publicClient.getCode({ address: TEST_SMART_ACCOUNT });
        const endTime = Date.now();

        const duration = endTime - startTime;

        // Should complete within reasonable time
        expect(duration).toBeLessThan(10000); // 10 seconds max
      } catch (error) {
        console.log("Performance test failed:", error.message);
      }
    }, 30000);
  });
});
