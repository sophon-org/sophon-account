import { createPublicClient } from "viem";
import {
  validateERC1271Signature,
  validateSignature,
  ERC1271_MAGIC_VALUE,
} from "../signature-utils";

// Mock viem
jest.mock("viem", () => ({
  createPublicClient: jest.fn(),
  hashMessage: jest.fn(),
  hashTypedData: jest.fn(),
  toBytes: jest.fn(),
  encodeAbiParameters: jest.fn(),
  parseAbiParameters: jest.fn(),
  keccak256: jest.fn(),
}));

const mockCreatePublicClient = createPublicClient as jest.MockedFunction<any>;

describe("Signature Utils", () => {
  const mockClient = {
    readContract: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockCreatePublicClient.mockReturnValue(mockClient as any);
  });

  describe("validateERC1271Signature", () => {
    it("should return true for valid signature", async () => {
      mockClient.readContract.mockResolvedValue(ERC1271_MAGIC_VALUE);

      const result = await validateERC1271Signature(mockClient as any, {
        account: "0xE8345Dc6c2c81E8490e7F10f3B3d9F687503F2F4",
        message: "Hello, world!",
        signature:
          "0xa3f724c4e11a2f36b14c63f27d576b6e9f632797d2680a64001eec60bae2619e0bddc01280434f29445b74d540ac95aaf5d37b46c1630d142b184c40d496f6bf1c",
      });

      expect(result).toBe(true);
      expect(mockClient.readContract).toHaveBeenCalledWith({
        address: "0xE8345Dc6c2c81E8490e7F10f3B3d9F687503F2F4",
        abi: expect.any(Array),
        functionName: "isValidSignature",
        args: expect.any(Array),
      });
    });

    it("should return false for invalid signature", async () => {
      mockClient.readContract.mockResolvedValue("0x00000000");

      const result = await validateERC1271Signature(mockClient as any, {
        account: "0x1234567890123456789012345678901234567890",
        message: "Hello, world!",
        signature: "0xabcd",
      });

      expect(result).toBe(false);
    });

    it("should return false when contract call fails", async () => {
      mockClient.readContract.mockRejectedValue(
        new Error("Contract call failed"),
      );

      const result = await validateERC1271Signature(mockClient as any, {
        account: "0x1234567890123456789012345678901234567890",
        message: "Hello, world!",
        signature: "0xabcd",
      });

      expect(result).toBe(false);
    });
  });

  describe("validateSignature", () => {
    it("should validate message signature", async () => {
      mockClient.readContract.mockResolvedValue(ERC1271_MAGIC_VALUE);

      const result = await validateSignature(mockClient as any, {
        account: "0x1234567890123456789012345678901234567890",
        signature: "0xabcd",
        type: "message",
        message: "Hello, world!",
      });

      expect(result).toBe(true);
    });

    it("should validate hash signature", async () => {
      mockClient.readContract.mockResolvedValue(ERC1271_MAGIC_VALUE);

      const result = await validateSignature(mockClient as any, {
        account: "0x1234567890123456789012345678901234567890",
        signature: "0xabcd",
        type: "hash",
        messageHash:
          "0x1234567890123456789012345678901234567890123456789012345678901234",
      });

      expect(result).toBe(true);
    });
  });
});
