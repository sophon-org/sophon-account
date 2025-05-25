const PVT_KEY_OWNER =
  "0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110";
const FACTORY_ADDRESS = "0x9Bb2603866dD254d4065E5BA50f15F8F058F600E";
const SESSION_KEY_MODULE_ADDRESS = "0x3E9AEF9331C4c558227542D9393a685E414165a3";

import {
  createPublicClient,
  createWalletClient,
  encodeFunctionData,
  http,
  parseEther,
} from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { sophonTestnet } from "viem/chains";
import { eip712WalletActions, getGeneralPaymasterInput } from "viem/zksync";
import { createZksyncSessionClient } from "zksync-sso/client";
import { createZksyncEcdsaClient } from "zksync-sso/client/ecdsa";

const customSophonTestnet = {
  ...sophonTestnet,
  rpcUrls: {
    default: {
      http: ["http://0.0.0.0:8011"],
    },
    public: {
      http: ["http://0.0.0.0:8011"],
    },
  },
};

const factoryAbi = [
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_beaconProxyBytecodeHash",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "_beacon",
        type: "address",
      },
      {
        internalType: "address",
        name: "_passKeyModule",
        type: "address",
      },
      {
        internalType: "address",
        name: "_sessionKeyModule",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "ACCOUNT_ALREADY_EXISTS",
    type: "error",
  },
  {
    inputs: [],
    name: "EMPTY_BEACON_ADDRESS",
    type: "error",
  },
  {
    inputs: [],
    name: "EMPTY_BEACON_BYTECODE_HASH",
    type: "error",
  },
  {
    inputs: [],
    name: "EMPTY_PASSKEY_ADDRESS",
    type: "error",
  },
  {
    inputs: [],
    name: "EMPTY_SESSIONKEY_ADDRESS",
    type: "error",
  },
  {
    inputs: [],
    name: "INVALID_ACCOUNT_KEYS",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "accountAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "uniqueAccountId",
        type: "bytes32",
      },
    ],
    name: "AccountCreated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "accountId",
        type: "bytes32",
      },
    ],
    name: "accountMappings",
    outputs: [
      {
        internalType: "address",
        name: "deployedAccount",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "beacon",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "beaconProxyBytecodeHash",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "uniqueId",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "passKey",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "sessionKey",
        type: "bytes",
      },
      {
        internalType: "address[]",
        name: "ownerKeys",
        type: "address[]",
      },
    ],
    name: "deployModularAccount",
    outputs: [
      {
        internalType: "address",
        name: "accountAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "uniqueId",
        type: "bytes32",
      },
      {
        internalType: "bytes[]",
        name: "initialValidators",
        type: "bytes[]",
      },
      {
        internalType: "address[]",
        name: "initialK1Owners",
        type: "address[]",
      },
    ],
    name: "deployProxySsoAccount",
    outputs: [
      {
        internalType: "address",
        name: "accountAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getEncodedBeacon",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "passKeyModule",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "sessionKeyModule",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const SsoAccountAbi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "ADDRESS_CAST_OVERFLOW",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "actualValue",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "expectedValue",
        type: "uint256",
      },
    ],
    name: "BATCH_MSG_VALUE_MISMATCH",
    type: "error",
  },
  {
    inputs: [],
    name: "FEE_PAYMENT_FAILED",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "hook",
        type: "address",
      },
      {
        internalType: "bool",
        name: "isValidation",
        type: "bool",
      },
    ],
    name: "HOOK_ALREADY_EXISTS",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "hookAddress",
        type: "address",
      },
      {
        internalType: "bool",
        name: "isValidation",
        type: "bool",
      },
    ],
    name: "HOOK_ERC165_FAIL",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "hook",
        type: "address",
      },
      {
        internalType: "bool",
        name: "isValidation",
        type: "bool",
      },
    ],
    name: "HOOK_NOT_FOUND",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "required",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "available",
        type: "uint256",
      },
    ],
    name: "INSUFFICIENT_FUNDS",
    type: "error",
  },
  {
    inputs: [],
    name: "INVALID_ACCOUNT_KEYS",
    type: "error",
  },
  {
    inputs: [],
    name: "METHOD_NOT_IMPLEMENTED",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "notBootloader",
        type: "address",
      },
    ],
    name: "NOT_FROM_BOOTLOADER",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "notSelf",
        type: "address",
      },
    ],
    name: "NOT_FROM_SELF",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OWNER_ALREADY_EXISTS",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OWNER_NOT_FOUND",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "validator",
        type: "address",
      },
    ],
    name: "VALIDATOR_ALREADY_EXISTS",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "validator",
        type: "address",
      },
    ],
    name: "VALIDATOR_ERC165_FAIL",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "validator",
        type: "address",
      },
    ],
    name: "VALIDATOR_NOT_FOUND",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "revertData",
        type: "bytes",
      },
    ],
    name: "BatchCallFailure",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "hook",
        type: "address",
      },
    ],
    name: "HookAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "hook",
        type: "address",
      },
    ],
    name: "HookRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "addr",
        type: "address",
      },
    ],
    name: "K1OwnerAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "addr",
        type: "address",
      },
    ],
    name: "K1OwnerRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "validator",
        type: "address",
      },
    ],
    name: "ValidatorAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "validator",
        type: "address",
      },
    ],
    name: "ValidatorRemoved",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "hook",
        type: "address",
      },
      {
        internalType: "bool",
        name: "isValidation",
        type: "bool",
      },
      {
        internalType: "bytes",
        name: "initData",
        type: "bytes",
      },
    ],
    name: "addHook",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "addr",
        type: "address",
      },
    ],
    name: "addK1Owner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "validator",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "initData",
        type: "bytes",
      },
    ],
    name: "addModuleValidator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "target",
            type: "address",
          },
          {
            internalType: "bool",
            name: "allowFailure",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "callData",
            type: "bytes",
          },
        ],
        internalType: "struct Call[]",
        name: "_calls",
        type: "tuple[]",
      },
    ],
    name: "batchCall",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "txType",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "from",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "to",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "gasLimit",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "gasPerPubdataByteLimit",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxFeePerGas",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxPriorityFeePerGas",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "paymaster",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "nonce",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
          {
            internalType: "uint256[4]",
            name: "reserved",
            type: "uint256[4]",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "signature",
            type: "bytes",
          },
          {
            internalType: "bytes32[]",
            name: "factoryDeps",
            type: "bytes32[]",
          },
          {
            internalType: "bytes",
            name: "paymasterInput",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "reservedDynamic",
            type: "bytes",
          },
        ],
        internalType: "struct Transaction",
        name: "_transaction",
        type: "tuple",
      },
    ],
    name: "executeTransaction",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "txType",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "from",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "to",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "gasLimit",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "gasPerPubdataByteLimit",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxFeePerGas",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxPriorityFeePerGas",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "paymaster",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "nonce",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
          {
            internalType: "uint256[4]",
            name: "reserved",
            type: "uint256[4]",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "signature",
            type: "bytes",
          },
          {
            internalType: "bytes32[]",
            name: "factoryDeps",
            type: "bytes32[]",
          },
          {
            internalType: "bytes",
            name: "paymasterInput",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "reservedDynamic",
            type: "bytes",
          },
        ],
        internalType: "struct Transaction",
        name: "",
        type: "tuple",
      },
    ],
    name: "executeTransactionFromOutside",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes[]",
        name: "initialValidators",
        type: "bytes[]",
      },
      {
        internalType: "address[]",
        name: "initialK1Owners",
        type: "address[]",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "addr",
        type: "address",
      },
    ],
    name: "isHook",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "addr",
        type: "address",
      },
    ],
    name: "isK1Owner",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "validator",
        type: "address",
      },
    ],
    name: "isModuleValidator",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "hash",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "signature",
        type: "bytes",
      },
    ],
    name: "isValidSignature",
    outputs: [
      {
        internalType: "bytes4",
        name: "magicValue",
        type: "bytes4",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "isValidation",
        type: "bool",
      },
    ],
    name: "listHooks",
    outputs: [
      {
        internalType: "address[]",
        name: "hookList",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "listK1Owners",
    outputs: [
      {
        internalType: "address[]",
        name: "k1OwnerList",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "listModuleValidators",
    outputs: [
      {
        internalType: "address[]",
        name: "validatorList",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC1155BatchReceived",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC1155Received",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC721Received",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "txType",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "from",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "to",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "gasLimit",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "gasPerPubdataByteLimit",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxFeePerGas",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxPriorityFeePerGas",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "paymaster",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "nonce",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
          {
            internalType: "uint256[4]",
            name: "reserved",
            type: "uint256[4]",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "signature",
            type: "bytes",
          },
          {
            internalType: "bytes32[]",
            name: "factoryDeps",
            type: "bytes32[]",
          },
          {
            internalType: "bytes",
            name: "paymasterInput",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "reservedDynamic",
            type: "bytes",
          },
        ],
        internalType: "struct Transaction",
        name: "_transaction",
        type: "tuple",
      },
    ],
    name: "payForTransaction",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "txType",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "from",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "to",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "gasLimit",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "gasPerPubdataByteLimit",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxFeePerGas",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxPriorityFeePerGas",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "paymaster",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "nonce",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
          {
            internalType: "uint256[4]",
            name: "reserved",
            type: "uint256[4]",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "signature",
            type: "bytes",
          },
          {
            internalType: "bytes32[]",
            name: "factoryDeps",
            type: "bytes32[]",
          },
          {
            internalType: "bytes",
            name: "paymasterInput",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "reservedDynamic",
            type: "bytes",
          },
        ],
        internalType: "struct Transaction",
        name: "_transaction",
        type: "tuple",
      },
    ],
    name: "prepareForPaymaster",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "hook",
        type: "address",
      },
      {
        internalType: "bool",
        name: "isValidation",
        type: "bool",
      },
      {
        internalType: "bytes",
        name: "deinitData",
        type: "bytes",
      },
    ],
    name: "removeHook",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "addr",
        type: "address",
      },
    ],
    name: "removeK1Owner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "validator",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "deinitData",
        type: "bytes",
      },
    ],
    name: "removeModuleValidator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "hook",
        type: "address",
      },
      {
        internalType: "bool",
        name: "isValidation",
        type: "bool",
      },
      {
        internalType: "bytes",
        name: "deinitData",
        type: "bytes",
      },
    ],
    name: "unlinkHook",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "validator",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "deinitData",
        type: "bytes",
      },
    ],
    name: "unlinkModuleValidator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "_suggestedSignedHash",
        type: "bytes32",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "txType",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "from",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "to",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "gasLimit",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "gasPerPubdataByteLimit",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxFeePerGas",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxPriorityFeePerGas",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "paymaster",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "nonce",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
          {
            internalType: "uint256[4]",
            name: "reserved",
            type: "uint256[4]",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "signature",
            type: "bytes",
          },
          {
            internalType: "bytes32[]",
            name: "factoryDeps",
            type: "bytes32[]",
          },
          {
            internalType: "bytes",
            name: "paymasterInput",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "reservedDynamic",
            type: "bytes",
          },
        ],
        internalType: "struct Transaction",
        name: "_transaction",
        type: "tuple",
      },
    ],
    name: "validateTransaction",
    outputs: [
      {
        internalType: "bytes4",
        name: "magic",
        type: "bytes4",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
] as const;

const SessionKeyValidatorAbi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "ADDRESS_CAST_OVERFLOW",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "input",
        type: "bytes",
      },
    ],
    name: "INVALID_PAYMASTER_INPUT",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "notInitialized",
        type: "address",
      },
    ],
    name: "NOT_FROM_INITIALIZED_ACCOUNT",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "chainId",
        type: "uint256",
      },
    ],
    name: "NO_TIMESTAMP_ASSERTER",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "allowance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxAllowance",
        type: "uint256",
      },
      {
        internalType: "uint64",
        name: "period",
        type: "uint64",
      },
    ],
    name: "SESSION_ALLOWANCE_EXCEEDED",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "sessionHash",
        type: "bytes32",
      },
    ],
    name: "SESSION_ALREADY_EXISTS",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "target",
        type: "address",
      },
      {
        internalType: "bytes4",
        name: "selector",
        type: "bytes4",
      },
    ],
    name: "SESSION_CALL_POLICY_VIOLATED",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "param",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "refValue",
        type: "bytes32",
      },
      {
        internalType: "uint8",
        name: "condition",
        type: "uint8",
      },
    ],
    name: "SESSION_CONDITION_FAILED",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "expiresAt",
        type: "uint256",
      },
    ],
    name: "SESSION_EXPIRES_TOO_SOON",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "actualLength",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "expectedMinimumLength",
        type: "uint256",
      },
    ],
    name: "SESSION_INVALID_DATA_LENGTH",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "recovered",
        type: "address",
      },
      {
        internalType: "address",
        name: "expected",
        type: "address",
      },
    ],
    name: "SESSION_INVALID_SIGNER",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "lifetimeUsage",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxUsage",
        type: "uint256",
      },
    ],
    name: "SESSION_LIFETIME_USAGE_EXCEEDED",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "usedValue",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxValuePerUse",
        type: "uint256",
      },
    ],
    name: "SESSION_MAX_VALUE_EXCEEDED",
    type: "error",
  },
  {
    inputs: [],
    name: "SESSION_NOT_ACTIVE",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "target",
        type: "address",
      },
    ],
    name: "SESSION_TRANSFER_POLICY_VIOLATED",
    type: "error",
  },
  {
    inputs: [],
    name: "SESSION_UNLIMITED_FEES",
    type: "error",
  },
  {
    inputs: [],
    name: "SESSION_ZERO_SIGNER",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "openSessions",
        type: "uint256",
      },
    ],
    name: "UNINSTALL_WITH_OPEN_SESSIONS",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "sessionHash",
        type: "bytes32",
      },
      {
        components: [
          {
            internalType: "address",
            name: "signer",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "expiresAt",
            type: "uint256",
          },
          {
            components: [
              {
                internalType: "enum SessionLib.LimitType",
                name: "limitType",
                type: "uint8",
              },
              {
                internalType: "uint256",
                name: "limit",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "period",
                type: "uint256",
              },
            ],
            internalType: "struct SessionLib.UsageLimit",
            name: "feeLimit",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "address",
                name: "target",
                type: "address",
              },
              {
                internalType: "bytes4",
                name: "selector",
                type: "bytes4",
              },
              {
                internalType: "uint256",
                name: "maxValuePerUse",
                type: "uint256",
              },
              {
                components: [
                  {
                    internalType: "enum SessionLib.LimitType",
                    name: "limitType",
                    type: "uint8",
                  },
                  {
                    internalType: "uint256",
                    name: "limit",
                    type: "uint256",
                  },
                  {
                    internalType: "uint256",
                    name: "period",
                    type: "uint256",
                  },
                ],
                internalType: "struct SessionLib.UsageLimit",
                name: "valueLimit",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "enum SessionLib.Condition",
                    name: "condition",
                    type: "uint8",
                  },
                  {
                    internalType: "uint64",
                    name: "index",
                    type: "uint64",
                  },
                  {
                    internalType: "bytes32",
                    name: "refValue",
                    type: "bytes32",
                  },
                  {
                    components: [
                      {
                        internalType: "enum SessionLib.LimitType",
                        name: "limitType",
                        type: "uint8",
                      },
                      {
                        internalType: "uint256",
                        name: "limit",
                        type: "uint256",
                      },
                      {
                        internalType: "uint256",
                        name: "period",
                        type: "uint256",
                      },
                    ],
                    internalType: "struct SessionLib.UsageLimit",
                    name: "limit",
                    type: "tuple",
                  },
                ],
                internalType: "struct SessionLib.Constraint[]",
                name: "constraints",
                type: "tuple[]",
              },
            ],
            internalType: "struct SessionLib.CallSpec[]",
            name: "callPolicies",
            type: "tuple[]",
          },
          {
            components: [
              {
                internalType: "address",
                name: "target",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "maxValuePerUse",
                type: "uint256",
              },
              {
                components: [
                  {
                    internalType: "enum SessionLib.LimitType",
                    name: "limitType",
                    type: "uint8",
                  },
                  {
                    internalType: "uint256",
                    name: "limit",
                    type: "uint256",
                  },
                  {
                    internalType: "uint256",
                    name: "period",
                    type: "uint256",
                  },
                ],
                internalType: "struct SessionLib.UsageLimit",
                name: "valueLimit",
                type: "tuple",
              },
            ],
            internalType: "struct SessionLib.TransferSpec[]",
            name: "transferPolicies",
            type: "tuple[]",
          },
        ],
        indexed: false,
        internalType: "struct SessionLib.SessionSpec",
        name: "sessionSpec",
        type: "tuple",
      },
    ],
    name: "SessionCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "sessionHash",
        type: "bytes32",
      },
    ],
    name: "SessionRevoked",
    type: "event",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "signer",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "expiresAt",
            type: "uint256",
          },
          {
            components: [
              {
                internalType: "enum SessionLib.LimitType",
                name: "limitType",
                type: "uint8",
              },
              {
                internalType: "uint256",
                name: "limit",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "period",
                type: "uint256",
              },
            ],
            internalType: "struct SessionLib.UsageLimit",
            name: "feeLimit",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "address",
                name: "target",
                type: "address",
              },
              {
                internalType: "bytes4",
                name: "selector",
                type: "bytes4",
              },
              {
                internalType: "uint256",
                name: "maxValuePerUse",
                type: "uint256",
              },
              {
                components: [
                  {
                    internalType: "enum SessionLib.LimitType",
                    name: "limitType",
                    type: "uint8",
                  },
                  {
                    internalType: "uint256",
                    name: "limit",
                    type: "uint256",
                  },
                  {
                    internalType: "uint256",
                    name: "period",
                    type: "uint256",
                  },
                ],
                internalType: "struct SessionLib.UsageLimit",
                name: "valueLimit",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "enum SessionLib.Condition",
                    name: "condition",
                    type: "uint8",
                  },
                  {
                    internalType: "uint64",
                    name: "index",
                    type: "uint64",
                  },
                  {
                    internalType: "bytes32",
                    name: "refValue",
                    type: "bytes32",
                  },
                  {
                    components: [
                      {
                        internalType: "enum SessionLib.LimitType",
                        name: "limitType",
                        type: "uint8",
                      },
                      {
                        internalType: "uint256",
                        name: "limit",
                        type: "uint256",
                      },
                      {
                        internalType: "uint256",
                        name: "period",
                        type: "uint256",
                      },
                    ],
                    internalType: "struct SessionLib.UsageLimit",
                    name: "limit",
                    type: "tuple",
                  },
                ],
                internalType: "struct SessionLib.Constraint[]",
                name: "constraints",
                type: "tuple[]",
              },
            ],
            internalType: "struct SessionLib.CallSpec[]",
            name: "callPolicies",
            type: "tuple[]",
          },
          {
            components: [
              {
                internalType: "address",
                name: "target",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "maxValuePerUse",
                type: "uint256",
              },
              {
                components: [
                  {
                    internalType: "enum SessionLib.LimitType",
                    name: "limitType",
                    type: "uint8",
                  },
                  {
                    internalType: "uint256",
                    name: "limit",
                    type: "uint256",
                  },
                  {
                    internalType: "uint256",
                    name: "period",
                    type: "uint256",
                  },
                ],
                internalType: "struct SessionLib.UsageLimit",
                name: "valueLimit",
                type: "tuple",
              },
            ],
            internalType: "struct SessionLib.TransferSpec[]",
            name: "transferPolicies",
            type: "tuple[]",
          },
        ],
        internalType: "struct SessionLib.SessionSpec",
        name: "sessionSpec",
        type: "tuple",
      },
    ],
    name: "createSession",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "smartAccount",
        type: "address",
      },
    ],
    name: "isInitialized",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "onInstall",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "onUninstall",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "sessionHash",
        type: "bytes32",
      },
    ],
    name: "revokeKey",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32[]",
        name: "sessionHashes",
        type: "bytes32[]",
      },
    ],
    name: "revokeKeys",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        components: [
          {
            internalType: "address",
            name: "signer",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "expiresAt",
            type: "uint256",
          },
          {
            components: [
              {
                internalType: "enum SessionLib.LimitType",
                name: "limitType",
                type: "uint8",
              },
              {
                internalType: "uint256",
                name: "limit",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "period",
                type: "uint256",
              },
            ],
            internalType: "struct SessionLib.UsageLimit",
            name: "feeLimit",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "address",
                name: "target",
                type: "address",
              },
              {
                internalType: "bytes4",
                name: "selector",
                type: "bytes4",
              },
              {
                internalType: "uint256",
                name: "maxValuePerUse",
                type: "uint256",
              },
              {
                components: [
                  {
                    internalType: "enum SessionLib.LimitType",
                    name: "limitType",
                    type: "uint8",
                  },
                  {
                    internalType: "uint256",
                    name: "limit",
                    type: "uint256",
                  },
                  {
                    internalType: "uint256",
                    name: "period",
                    type: "uint256",
                  },
                ],
                internalType: "struct SessionLib.UsageLimit",
                name: "valueLimit",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "enum SessionLib.Condition",
                    name: "condition",
                    type: "uint8",
                  },
                  {
                    internalType: "uint64",
                    name: "index",
                    type: "uint64",
                  },
                  {
                    internalType: "bytes32",
                    name: "refValue",
                    type: "bytes32",
                  },
                  {
                    components: [
                      {
                        internalType: "enum SessionLib.LimitType",
                        name: "limitType",
                        type: "uint8",
                      },
                      {
                        internalType: "uint256",
                        name: "limit",
                        type: "uint256",
                      },
                      {
                        internalType: "uint256",
                        name: "period",
                        type: "uint256",
                      },
                    ],
                    internalType: "struct SessionLib.UsageLimit",
                    name: "limit",
                    type: "tuple",
                  },
                ],
                internalType: "struct SessionLib.Constraint[]",
                name: "constraints",
                type: "tuple[]",
              },
            ],
            internalType: "struct SessionLib.CallSpec[]",
            name: "callPolicies",
            type: "tuple[]",
          },
          {
            components: [
              {
                internalType: "address",
                name: "target",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "maxValuePerUse",
                type: "uint256",
              },
              {
                components: [
                  {
                    internalType: "enum SessionLib.LimitType",
                    name: "limitType",
                    type: "uint8",
                  },
                  {
                    internalType: "uint256",
                    name: "limit",
                    type: "uint256",
                  },
                  {
                    internalType: "uint256",
                    name: "period",
                    type: "uint256",
                  },
                ],
                internalType: "struct SessionLib.UsageLimit",
                name: "valueLimit",
                type: "tuple",
              },
            ],
            internalType: "struct SessionLib.TransferSpec[]",
            name: "transferPolicies",
            type: "tuple[]",
          },
        ],
        internalType: "struct SessionLib.SessionSpec",
        name: "spec",
        type: "tuple",
      },
    ],
    name: "sessionState",
    outputs: [
      {
        components: [
          {
            internalType: "enum SessionLib.Status",
            name: "status",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "feesRemaining",
            type: "uint256",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "remaining",
                type: "uint256",
              },
              {
                internalType: "address",
                name: "target",
                type: "address",
              },
              {
                internalType: "bytes4",
                name: "selector",
                type: "bytes4",
              },
              {
                internalType: "uint256",
                name: "index",
                type: "uint256",
              },
            ],
            internalType: "struct SessionLib.LimitState[]",
            name: "transferValue",
            type: "tuple[]",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "remaining",
                type: "uint256",
              },
              {
                internalType: "address",
                name: "target",
                type: "address",
              },
              {
                internalType: "bytes4",
                name: "selector",
                type: "bytes4",
              },
              {
                internalType: "uint256",
                name: "index",
                type: "uint256",
              },
            ],
            internalType: "struct SessionLib.LimitState[]",
            name: "callValue",
            type: "tuple[]",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "remaining",
                type: "uint256",
              },
              {
                internalType: "address",
                name: "target",
                type: "address",
              },
              {
                internalType: "bytes4",
                name: "selector",
                type: "bytes4",
              },
              {
                internalType: "uint256",
                name: "index",
                type: "uint256",
              },
            ],
            internalType: "struct SessionLib.LimitState[]",
            name: "callParams",
            type: "tuple[]",
          },
        ],
        internalType: "struct SessionLib.SessionState",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "sessionHash",
        type: "bytes32",
      },
    ],
    name: "sessionStatus",
    outputs: [
      {
        internalType: "enum SessionLib.Status",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "validateSignature",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "signedHash",
        type: "bytes32",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "txType",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "from",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "to",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "gasLimit",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "gasPerPubdataByteLimit",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxFeePerGas",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxPriorityFeePerGas",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "paymaster",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "nonce",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
          {
            internalType: "uint256[4]",
            name: "reserved",
            type: "uint256[4]",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "signature",
            type: "bytes",
          },
          {
            internalType: "bytes32[]",
            name: "factoryDeps",
            type: "bytes32[]",
          },
          {
            internalType: "bytes",
            name: "paymasterInput",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "reservedDynamic",
            type: "bytes",
          },
        ],
        internalType: "struct Transaction",
        name: "transaction",
        type: "tuple",
      },
    ],
    name: "validateTransaction",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const sessionConfig = (signerAddress) => {
  return {
    signer: signerAddress,
    expiresAt: BigInt(new Date(2025, 5, 31).getTime() / 1000),
    feeLimit: {
      limitType: 1,
      limit: 1000000000000000000n,
      period: 0n,
    },
    callPolicies: [],
    transferPolicies: [
      {
        target: "0x36615Cf349d7F6344891B1e7CA7C72883F5dc049" as `0x${string}`,
        maxValuePerUse: 1000000000000000000n,
        valueLimit: {
          limitType: 1,
          limit: 1000000000000000000n,
          period: 1000000000000000000n,
        },
      },
    ],
  };
};

export const getInstallSessionKeyModuleTx = (args) => {
  const callData = encodeFunctionData({
    abi: SsoAccountAbi,
    functionName: "addModuleValidator",
    args: [SESSION_KEY_MODULE_ADDRESS, "0x"],
  });

  const sendTransactionArgs = {
    from: args.accountAddress,
    to: args.accountAddress,
    paymaster: args.paymaster?.address,
    paymasterInput: args.paymaster?.address
      ? args.paymaster?.paymasterInput ||
        getGeneralPaymasterInput({ innerInput: "0x" })
      : undefined,
    data: callData,
    gas: 10_000_000, // TODO: Remove when gas estimation is fixed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;

  return sendTransactionArgs;
};

const getCreateSessionTxForViem = (args, accountAddress) => {
  const _args = {
    ...args,
    contracts: { session: SESSION_KEY_MODULE_ADDRESS },
  };

  const callData = encodeFunctionData({
    abi: SessionKeyValidatorAbi,
    functionName: "createSession",
    args: [_args.sessionConfig],
  });

  const sendTransactionArgs = {
    from: accountAddress,
    to: _args.contracts.session,
    paymaster: args.paymaster?.address,
    paymasterInput: args.paymaster?.address
      ? args.paymaster?.paymasterInput ||
        getGeneralPaymasterInput({ innerInput: "0x" })
      : undefined,
    data: callData,
    gas: 10_000_000, // TODO: Remove when gas estimation is fixed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;

  return sendTransactionArgs;
};

const publicClient = createPublicClient({
  chain: customSophonTestnet,
  transport: http(),
});

const account = privateKeyToAccount(PVT_KEY_OWNER);

const walletClient = createWalletClient({
  chain: customSophonTestnet,
  transport: http(),
  account,
}).extend(eip712WalletActions());

const signerPvtKey = generatePrivateKey();
const signer = privateKeyToAccount(signerPvtKey);
const signerAddress = signer.address;

const uniqueID =
  "0x" +
  Array.from({ length: 64 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("");

const test = async () => {
  //deploy account
  const { request: deployReq, result: accountAddress } =
    await publicClient.simulateContract({
      account,
      address: FACTORY_ADDRESS,
      abi: factoryAbi,
      functionName: "deployProxySsoAccount",
      args: [uniqueID as `0x${string}`, [], [account.address]],
      paymaster: "0x98546B226dbbA8230cf620635a1e4ab01F6A99B2",
      paymasterInput: getGeneralPaymasterInput({ innerInput: "0x" }),
    });

  const deployHash = await walletClient.writeContract(deployReq);
  await publicClient.waitForTransactionReceipt({ hash: deployHash });

  console.log(accountAddress);

  //   const accountAddress = "0xAeA29abdf6Af51c4Ab2C5FF8dffC3f590A40EE8A";

  const transferHash = await walletClient.sendTransaction({
    to: accountAddress,
    value: parseEther("30"),
  });

  await publicClient.waitForTransactionReceipt({ hash: transferHash });

  const ecdsaClient = await createZksyncEcdsaClient({
    address: accountAddress,
    owner: account,
    chain: customSophonTestnet,
    transport: http(),
  });

  const installTx = getInstallSessionKeyModuleTx({
    accountAddress,
  });

  const installHash = await ecdsaClient.sendTransaction(installTx);

  await ecdsaClient.waitForTransactionReceipt({
    hash: installHash,
  });

  const createSessionTx = getCreateSessionTxForViem(
    {
      sessionConfig: sessionConfig(signerAddress),
      paymaster: {
        address: "0x98546B226dbbA8230cf620635a1e4ab01F6A99B2",
        paymasterInput: getGeneralPaymasterInput({ innerInput: "0x" }),
      },
    },
    account.address
  );

  const createSessionHash = await ecdsaClient.sendTransaction(createSessionTx);

  await ecdsaClient.waitForTransactionReceipt({
    hash: createSessionHash,
  });

  const sessionClient = createZksyncSessionClient({
    chain: customSophonTestnet,
    address: accountAddress,
    sessionKey: signerPvtKey,
    sessionConfig: sessionConfig(signerAddress),
    contracts: {
      session: SESSION_KEY_MODULE_ADDRESS,
    },
    transport: http(),
  });

  const tx = await sessionClient.sendTransaction({
    to: account.address,
    value: parseEther("1"),
    data: "0x",
  });

  console.log(tx);

  const result2 = await sessionClient.waitForTransactionReceipt({
    hash: tx,
  });

  console.log(result2);
};

test();
