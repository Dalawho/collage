/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  Collage,
  CollageInterface,
} from "../../../contracts/Collage.sol/Collage";

const _abi = [
  {
    inputs: [],
    name: "MaxSupplyReached",
    type: "error",
  },
  {
    inputs: [],
    name: "maxFreeClaimed",
    type: "error",
  },
  {
    inputs: [],
    name: "maxMintsPerWallet",
    type: "error",
  },
  {
    inputs: [],
    name: "mintNotStarted",
    type: "error",
  },
  {
    inputs: [],
    name: "notAValidSender",
    type: "error",
  },
  {
    inputs: [],
    name: "notTokenOwner",
    type: "error",
  },
  {
    inputs: [],
    name: "onlyMinter",
    type: "error",
  },
  {
    inputs: [],
    name: "payRightAmount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
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
        indexed: false,
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "MetadataUpdate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "_balanceData",
    outputs: [
      {
        internalType: "uint32",
        name: "balance",
        type: "uint32",
      },
      {
        internalType: "uint32",
        name: "mintedAmount",
        type: "uint32",
      },
      {
        internalType: "uint32",
        name: "allowListMinted",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId_",
        type: "uint256",
      },
    ],
    name: "_getTokenDataOf",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            components: [
              {
                internalType: "uint8",
                name: "layerId",
                type: "uint8",
              },
              {
                internalType: "uint8",
                name: "xOffset",
                type: "uint8",
              },
              {
                internalType: "uint8",
                name: "yOffset",
                type: "uint8",
              },
            ],
            internalType: "struct ERC721G.LayerStruct[4]",
            name: "layers",
            type: "tuple[4]",
          },
        ],
        internalType: "struct ERC721G.OwnerStruct",
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
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "_tokenData",
    outputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId_",
        type: "uint256",
      },
    ],
    name: "_trueOwnerOf",
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
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "layer",
        type: "uint8",
      },
      {
        internalType: "uint8",
        name: "layerId",
        type: "uint8",
      },
      {
        internalType: "uint8",
        name: "xOffset",
        type: "uint8",
      },
      {
        internalType: "uint8",
        name: "yOffset",
        type: "uint8",
      },
    ],
    name: "addLayer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to_",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId_",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "address_",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "getApproved",
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
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
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
    ],
    name: "isApprovedForAll",
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
    inputs: [],
    name: "maxBatchSize",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "maxSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "mint",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8[4]",
        name: "layerIds",
        type: "uint8[4]",
      },
      {
        internalType: "uint8[4]",
        name: "xOffsets",
        type: "uint8[4]",
      },
      {
        internalType: "uint8[4]",
        name: "yOffsets",
        type: "uint8[4]",
      },
    ],
    name: "mintAndBuy",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8[4]",
        name: "layerIds",
        type: "uint8[4]",
      },
      {
        internalType: "uint8[4]",
        name: "xOffsets",
        type: "uint8[4]",
      },
      {
        internalType: "uint8[4]",
        name: "yOffsets",
        type: "uint8[4]",
      },
    ],
    name: "mintAndSet",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "mintIndex",
    outputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
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
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId_",
        type: "uint256",
      },
    ],
    name: "ownerOf",
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
    name: "pieces",
    outputs: [
      {
        internalType: "contract IPieces",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8[4]",
        name: "pieceIds",
        type: "uint8[4]",
      },
      {
        internalType: "uint8[4]",
        name: "xOffsets",
        type: "uint8[4]",
      },
      {
        internalType: "uint8[4]",
        name: "yOffsets",
        type: "uint8[4]",
      },
    ],
    name: "previewCollage",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "layerNr",
        type: "uint8",
      },
      {
        internalType: "uint8",
        name: "pieceId",
        type: "uint8",
      },
      {
        internalType: "uint8",
        name: "xOffset",
        type: "uint8",
      },
      {
        internalType: "uint8",
        name: "yOffset",
        type: "uint8",
      },
    ],
    name: "previewTokenCollage",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "render",
    outputs: [
      {
        internalType: "contract IRender",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from_",
        type: "address",
      },
      {
        internalType: "address",
        name: "to_",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId_",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from_",
        type: "address",
      },
      {
        internalType: "address",
        name: "to_",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId_",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data_",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator_",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved_",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_newPieces",
        type: "address",
      },
    ],
    name: "setPieces",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_newRender",
        type: "address",
      },
    ],
    name: "setRender",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "startTokenId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "iid_",
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
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "tokenIndex",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "address_",
        type: "address",
      },
    ],
    name: "totalBalanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "address_",
        type: "address",
      },
    ],
    name: "totalMinted",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from_",
        type: "address",
      },
      {
        internalType: "address",
        name: "to_",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId_",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "address_",
        type: "address",
      },
    ],
    name: "walletOfOwner",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506128db806100206000396000f3fe60806040526004361061023a5760003560e01c8063715018a61161012e578063c87b56dd116100ab578063e6798baa1161006f578063e6798baa14610752578063e985e9c514610768578063eaea130f146107a3578063f0c136cb146107c3578063f2fde38b146107e357600080fd5b8063c87b56dd146106c6578063d55f9273146106e6578063d5abeb01146106fc578063d607497a14610712578063e1d7a59d1461073257600080fd5b8063aaa7f0fb116100f2578063aaa7f0fb14610610578063b0b50ed514610623578063b88d4fde14610659578063ba745f2e14610679578063bcd39215146106a657600080fd5b8063715018a6146105935780638129fc1c146105a85780638da5cb5b146105bd57806395d89b41146105db578063a22cb465146105f057600080fd5b806326332c41116101bc5780634b0ee02a116101805780634b0ee02a146104815780635266069d146104a15780635e7676e1146105175780636352211e1461053757806370a082311461055757600080fd5b806326332c41146103c85780632913daa0146103e85780632c2cdd60146103fe57806342842e0e14610434578063438b63001461045457600080fd5b80630b9633cc116102035780630b9633cc146103585780631249c58b1461036b578063176740361461037357806318160ddd1461039357806323b872dd146103a857600080fd5b80623d47901461023f57806301ffc9a71461029657806306fdde03146102c6578063081812fc146102e8578063095ea7b314610336575b600080fd5b34801561024b57600080fd5b5061028361025a3660046120cd565b6001600160a01b0316600090815260076020526040902054640100000000900463ffffffff1690565b6040519081526020015b60405180910390f35b3480156102a257600080fd5b506102b66102b13660046120fe565b610803565b604051901515815260200161028d565b3480156102d257600080fd5b506102db61088b565b60405161028d9190612173565b3480156102f457600080fd5b5061031e610303366004612186565b6009602052600090815260409020546001600160a01b031681565b6040516001600160a01b03909116815260200161028d565b34801561034257600080fd5b5061035661035136600461219f565b610919565b005b6103566103663660046121da565b6109c0565b610356610afb565b34801561037f57600080fd5b5060705461031e906001600160a01b031681565b34801561039f57600080fd5b50610283610b3d565b3480156103b457600080fd5b506103566103c3366004612222565b610b54565b3480156103d457600080fd5b506102db6103e336600461232b565b610bc0565b3480156103f457600080fd5b5061028360055481565b34801561040a57600080fd5b5061031e610419366004612186565b6006602052600090815260409020546001600160a01b031681565b34801561044057600080fd5b5061035661044f366004612222565b610ce8565b34801561046057600080fd5b5061047461046f3660046120cd565b610d03565b60405161028d919061236a565b34801561048d57600080fd5b5061028361049c3660046120cd565b610de4565b3480156104ad57600080fd5b506104f06104bc3660046120cd565b60076020526000908152604090205463ffffffff808216916401000000008104821691680100000000000000009091041683565b6040805163ffffffff9485168152928416602084015292169181019190915260600161028d565b34801561052357600080fd5b5061031e610532366004612186565b610e08565b34801561054357600080fd5b5061031e610552366004612186565b610e1a565b34801561056357600080fd5b506102836105723660046120cd565b6001600160a01b031660009081526007602052604090205463ffffffff1690565b34801561059f57600080fd5b50610356610e2e565b3480156105b457600080fd5b50610356610e40565b3480156105c957600080fd5b50603d546001600160a01b031661031e565b3480156105e757600080fd5b506102db610f99565b3480156105fc57600080fd5b5061035661060b3660046123ae565b610fa6565b61035661061e3660046121da565b610fb5565b34801561062f57600080fd5b5061031e61063e366004612186565b6008602052600090815260409020546001600160a01b031681565b34801561066557600080fd5b50610356610674366004612412565b611094565b34801561068557600080fd5b50610699610694366004612186565b6111f2565b60405161028d9190612503565b3480156106b257600080fd5b506102db6106c136600461252f565b6113d3565b3480156106d257600080fd5b506102db6106e1366004612186565b6114a4565b3480156106f257600080fd5b5061028360035481565b34801561070857600080fd5b506102836103e881565b34801561071e57600080fd5b50606f5461031e906001600160a01b031681565b34801561073e57600080fd5b5061035661074d36600461252f565b611528565b34801561075e57600080fd5b5061028360045481565b34801561077457600080fd5b506102b661078336600461258d565b600a60209081526000928352604080842090915290825290205460ff1681565b3480156107af57600080fd5b506103566107be3660046120cd565b611697565b3480156107cf57600080fd5b506103566107de3660046120cd565b6116c1565b3480156107ef57600080fd5b506103566107fe3660046120cd565b6116eb565b60006301ffc9a760e01b6001600160e01b03198316148061083457506380ac58cd60e01b6001600160e01b03198316145b8061084f5750635b5e139f60e01b6001600160e01b03198316145b8061086a57506307f5828d60e41b6001600160e01b03198316145b806108855750632483248360e11b6001600160e01b03198316145b92915050565b60018054610898906125c0565b80601f01602080910402602001604051908101604052809291908181526020018280546108c4906125c0565b80156109115780601f106108e657610100808354040283529160200191610911565b820191906000526020600020905b8154815290600101906020018083116108f457829003601f168201915b505050505081565b600061092482610e1a565b90506001600160a01b03811633148061096057506001600160a01b0381166000908152600a6020908152604080832033845290915290205460ff165b6109b15760405162461bcd60e51b815260206004820152601f60248201527f455243373231473a20617070726f7665206e6f7420617574686f72697a65640060448201526064015b60405180910390fd5b6109bb8383611761565b505050565b6103e86109cb610b3d565b6109d6906001612611565b11156109f55760405163d05cb60960e01b815260040160405180910390fd5b60005b60048160ff161015610aec576000848260ff1660048110610a1b57610a1b612629565b602002016020810190610a2e919061263f565b60ff161115610ada576070546001600160a01b031663f5298aca338660ff851660048110610a5e57610a5e612629565b602002016020810190610a71919061263f565b6040516001600160e01b031960e085901b1681526001600160a01b03909216600483015260ff16602482015260016044820152606401600060405180830381600087803b158015610ac157600080fd5b505af1158015610ad5573d6000803e3d6000fd5b505050505b80610ae48161265a565b9150506109f8565b506109bb3360018585856117cf565b6103e8610b06610b3d565b610b11906001612611565b1115610b305760405163d05cb60960e01b815260040160405180910390fd5b610b3b336001611a6c565b565b6000600454600354610b4f919061267a565b905090565b610b5e3382611aa2565b610bb55760405162461bcd60e51b815260206004820152602260248201527f455243373231473a207472616e7366657246726f6d20756e617574686f72697a604482015261195960f21b60648201526084016109a8565b6109bb838383611b21565b606f546040805160e081018252855160ff908116608083019081528651821660a08401528551821660c084015282528251606080820185526020808a01518416835280890151841681840152808801518416838701528085019290925284518082018652898601518416815288860151841681840152878601518416818701528486015284518082018652818a015184168152818901518416928101929092528087015190921681850152818301529151637f0cda3360e01b815291926001600160a01b031691637f0cda3391610c9991600401612691565b600060405180830381865afa158015610cb6573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052610cde91908101906126a0565b90505b9392505050565b6109bb83838360405180602001604052806000815250611094565b60606000610d2c836001600160a01b031660009081526007602052604090205463ffffffff1690565b905060008167ffffffffffffffff811115610d4957610d4961225e565b604051908082528060200260200182016040528015610d72578160200160208202803683370190505b506004549091506000905b83821015610dda57856001600160a01b0316610d9882610e1a565b6001600160a01b03161415610dd257808383610db381612717565b945081518110610dc557610dc5612629565b6020026020010181815250505b600101610d7d565b5090949350505050565b6001600160a01b03811660009081526007602052604081205463ffffffff16610885565b6000610e13826111f2565b5192915050565b600080610e26836111f2565b519392505050565b610e36611c93565b610b3b6000611ced565b600054610100900460ff1615808015610e605750600054600160ff909116105b80610e7a5750303b158015610e7a575060005460ff166001145b610edd5760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b60648201526084016109a8565b6000805460ff191660011790558015610f00576000805461ff0019166101001790555b610f4860405180604001604052806007815260200166436f6c6c61676560c81b81525060405180604001604052806003815260200162434c4760e81b8152506001601e611d3f565b610f50611da0565b8015610f96576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b50565b60028054610898906125c0565b610fb1338383611dcf565b5050565b6103e8610fc0610b3d565b610fcb906001612611565b1115610fea5760405163d05cb60960e01b815260040160405180910390fd5b60705460405163fe4c5f7b60e01b81526000916001600160a01b03169063fe4c5f7b9061101b908790600401612732565b6020604051808303816000875af115801561103a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061105e919061276e565b9050803414611080576040516333a868c560e11b815260040160405180910390fd5b61108e3360018686866117cf565b50505050565b61109f848484610b54565b6001600160a01b0383163b1561108e576000836001600160a01b031663150b7a02338786866040516024016110d79493929190612787565b6040516020818303038152906040529060e01b6020820180516001600160e01b03838183161783525050505060405161111091906127c4565b6000604051808303816000865af19150503d806000811461114d576040519150601f19603f3d011682016040523d82523d6000602084013e611152565b606091505b5091505060008180602001905181019061116c91906127e0565b9050630a85bd0160e11b6001600160e01b03198216146111ea5760405162461bcd60e51b815260206004820152603360248201527f455243373231473a20736166655472616e7366657246726f6d20746f5f206e6f6044820152726e2d45524337323152656365697661626c652160681b60648201526084016109a8565b505050505050565b6111fa611fb6565b60045482101561124c5760405162461bcd60e51b815260206004820152601a60248201527f546f6b656e49642062656c6f77207374617274696e672049642100000000000060448201526064016109a8565b6000828152600660205260409020546001600160a01b031615158061127357506003548210155b1561130f5760008281526006602090815260408083208151808301835281546001600160a01b03168152825160808101909352939092840191906001840190600490835b8282101561130157604080516060810182528386015460ff8082168352610100820481166020808501919091526201000090920416928201929092528252600190920191016112b7565b505050915250909392505050565b815b6000818152600860205260409020546001600160a01b03166113365760001901611311565b60008181526008602090815260408083208151808301835281546001600160a01b03168152825160808101909352939092840191906001840190600490835b828210156113bf57604080516060810182528386015460ff808216835261010082048116602080850191909152620100009092041692820192909252825260019092019101611375565b50505091525090949350505050565b919050565b606060006113e0876111f2565b60200151905060405180606001604052808660ff1681526020018560ff1681526020018460ff16815250818760ff166004811061141f5761141f612629565b6020020152606f54604051637f0cda3360e01b81526001600160a01b0390911690637f0cda3390611454908490600401612691565b600060405180830381865afa158015611471573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405261149991908101906126a0565b979650505050505050565b606f546060906001600160a01b03166388e59343836114c2816111f2565b602001516040518363ffffffff1660e01b81526004016114e39291906127fd565b600060405180830381865afa158015611500573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405261088591908101906126a0565b6000858152600660205260409020546001600160a01b0316331461155f576040516348f2abcb60e11b815260040160405180910390fd5b607054604051637a94c56560e11b815233600482015260ff85166024820152600160448201526001600160a01b039091169063f5298aca90606401600060405180830381600087803b1580156115b457600080fd5b505af11580156115c8573d6000803e3d6000fd5b5050505060405180606001604052808460ff1681526020018360ff1681526020018260ff16815250600660008781526020019081526020016000206001018560ff166004811061161a5761161a612629565b825191018054602084015160409485015160ff908116620100000262ff0000199282166101000261ffff1990941691909516179190911716919091179055517ff8e1a15aba9398e019f0b49df1a4fde98ee17ae345cb5f6b5e2c27f5033e8ce7906116889087815260200190565b60405180910390a15050505050565b61169f611c93565b607080546001600160a01b0319166001600160a01b0392909216919091179055565b6116c9611c93565b606f80546001600160a01b0319166001600160a01b0392909216919091179055565b6116f3611c93565b6001600160a01b0381166117585760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b60648201526084016109a8565b610f9681611ced565b600081815260096020526040902080546001600160a01b0319166001600160a01b038416908117909155819061179682610e1a565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b6001600160a01b0385166118255760405162461bcd60e51b815260206004820152601d60248201527f455243373231473a205f6d696e74496e7465726e616c20746f2030783000000060448201526064016109a8565b6005548411156118475760405162461bcd60e51b81526004016109a890612812565b60035460006118568683612611565b905060005b60048160ff1610156119a7576000868260ff166004811061187e5761187e612629565b602002016020810190611891919061263f565b60ff161115611995576040518060600160405280878360ff16600481106118ba576118ba612629565b6020020160208101906118cd919061263f565b60ff168152602001868360ff16600481106118ea576118ea612629565b6020020160208101906118fd919061263f565b60ff168152602001858360ff166004811061191a5761191a612629565b60200201602081019061192d919061263f565b60ff90811690915260008581526006602052604090206001019083166004811061195957611959612629565b825191018054602084015160409094015160ff908116620100000262ff0000199582166101000261ffff19909316919094161717929092161790555b8061199f8161265a565b91505061185b565b50600082815260066020908152604080832080546001600160a01b038c166001600160a01b03199091168117909155835260079091529020805464010000000063ffffffff8083168a01811663ffffffff198416811783900482168b0190911690910267ffffffffffffffff19909216171790555b60405182906001600160a01b038916906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a4808260010192508210611a1c57600355505050505050565b805b600554811115611a9857600554611a85908261267a565b9050611a9383600554611e3c565b611a6e565b6109bb8382611e3c565b600080611aae83610e1a565b9050836001600160a01b0316816001600160a01b03161480611ae957506000838152600960205260409020546001600160a01b038581169116145b80611b1957506001600160a01b038082166000908152600a602090815260408083209388168352929052205460ff165b949350505050565b611b2a81610e1a565b6001600160a01b0316836001600160a01b031614611b8a5760405162461bcd60e51b815260206004820152601d60248201527f455243373231473a205f7472616e7366657220213d206f776e65724f6600000060448201526064016109a8565b6001600160a01b038216611be05760405162461bcd60e51b815260206004820152601960248201527f455243373231473a205f7472616e7366657220746f203078300000000000000060448201526064016109a8565b600081815260096020908152604080832080546001600160a01b03199081169091556006835281842080549091166001600160a01b038781169182179092559087168085526007909352818420805463ffffffff1980821663ffffffff928316600019018316179092558286528386208054928316928216600101909116919091179055905184939192917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b603d546001600160a01b03163314610b3b5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016109a8565b603d80546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b600054610100900460ff16611d665760405162461bcd60e51b81526004016109a89061285a565b8351611d79906001906020870190611fde565b508251611d8d906002906020860190611fde565b5060038290556004919091556005555050565b600054610100900460ff16611dc75760405162461bcd60e51b81526004016109a89061285a565b610b3b611f86565b6001600160a01b038381166000818152600a6020908152604080832094871680845294825291829020805460ff191686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b6001600160a01b038216611e925760405162461bcd60e51b815260206004820152601d60248201527f455243373231473a205f6d696e74496e7465726e616c20746f2030783000000060448201526064016109a8565b600554811115611eb45760405162461bcd60e51b81526004016109a890612812565b6003546000611ec38383612611565b600083815260066020908152604080832080546001600160a01b038a166001600160a01b03199091168117909155835260079091529020805464010000000063ffffffff8083168801811663ffffffff19841681178390048216890190911690910267ffffffffffffffff199092161717905590505b60405182906001600160a01b038616906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a4808260010192508210611f3957600355505050565b600054610100900460ff16611fad5760405162461bcd60e51b81526004016109a89061285a565b610b3b33611ced565b604051806040016040528060006001600160a01b03168152602001611fd9612062565b905290565b828054611fea906125c0565b90600052602060002090601f01602090048101928261200c5760008555612052565b82601f1061202557805160ff1916838001178555612052565b82800160010185558215612052579182015b82811115612052578251825591602001919060010190612037565b5061205e9291506120a1565b5090565b60405180608001604052806004905b60408051606081018252600080825260208083018290529282015282526000199092019101816120715790505090565b5b8082111561205e57600081556001016120a2565b80356001600160a01b03811681146113ce57600080fd5b6000602082840312156120df57600080fd5b610ce1826120b6565b6001600160e01b031981168114610f9657600080fd5b60006020828403121561211057600080fd5b8135610ce1816120e8565b60005b8381101561213657818101518382015260200161211e565b8381111561108e5750506000910152565b6000815180845261215f81602086016020860161211b565b601f01601f19169290920160200192915050565b602081526000610ce16020830184612147565b60006020828403121561219857600080fd5b5035919050565b600080604083850312156121b257600080fd5b6121bb836120b6565b946020939093013593505050565b806080810183101561088557600080fd5b600080600061018084860312156121f057600080fd5b6121fa85856121c9565b925061220985608086016121c9565b91506122198561010086016121c9565b90509250925092565b60008060006060848603121561223757600080fd5b612240846120b6565b925061224e602085016120b6565b9150604084013590509250925092565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f1916810167ffffffffffffffff8111828210171561229d5761229d61225e565b604052919050565b803560ff811681146113ce57600080fd5b600082601f8301126122c757600080fd5b6040516080810181811067ffffffffffffffff821117156122ea576122ea61225e565b6040528060808401858111156122ff57600080fd5b845b8181101561232057612312816122a5565b835260209283019201612301565b509195945050505050565b6000806000610180848603121561234157600080fd5b61234b85856122b6565b925061235a85608086016122b6565b91506122198561010086016122b6565b6020808252825182820181905260009190848201906040850190845b818110156123a257835183529284019291840191600101612386565b50909695505050505050565b600080604083850312156123c157600080fd5b6123ca836120b6565b9150602083013580151581146123df57600080fd5b809150509250929050565b600067ffffffffffffffff8211156124045761240461225e565b50601f01601f191660200190565b6000806000806080858703121561242857600080fd5b612431856120b6565b935061243f602086016120b6565b925060408501359150606085013567ffffffffffffffff81111561246257600080fd5b8501601f8101871361247357600080fd5b8035612486612481826123ea565b612274565b81815288602083850101111561249b57600080fd5b8160208401602083013760006020838301015280935050505092959194509250565b8060005b600481101561108e578151805160ff908116865260208083015182168188015260409283015190911691860191909152606090940193909101906001016124c1565b81516001600160a01b031681526020808301516101a0830191612528908401826124bd565b5092915050565b600080600080600060a0868803121561254757600080fd5b85359450612557602087016122a5565b9350612565604087016122a5565b9250612573606087016122a5565b9150612581608087016122a5565b90509295509295909350565b600080604083850312156125a057600080fd5b6125a9836120b6565b91506125b7602084016120b6565b90509250929050565b600181811c908216806125d457607f821691505b602082108114156125f557634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fd5b60008219821115612624576126246125fb565b500190565b634e487b7160e01b600052603260045260246000fd5b60006020828403121561265157600080fd5b610ce1826122a5565b600060ff821660ff811415612671576126716125fb565b60010192915050565b60008282101561268c5761268c6125fb565b500390565b610180810161088582846124bd565b6000602082840312156126b257600080fd5b815167ffffffffffffffff8111156126c957600080fd5b8201601f810184136126da57600080fd5b80516126e8612481826123ea565b8181528560208385010111156126fd57600080fd5b61270e82602083016020860161211b565b95945050505050565b600060001982141561272b5761272b6125fb565b5060010190565b60808101818360005b60048110156127655760ff61274f836122a5565b168352602092830192919091019060010161273b565b50505092915050565b60006020828403121561278057600080fd5b5051919050565b6001600160a01b03858116825284166020820152604081018390526080606082018190526000906127ba90830184612147565b9695505050505050565b600082516127d681846020870161211b565b9190910192915050565b6000602082840312156127f257600080fd5b8151610ce1816120e8565b8281526101a08101610ce160208301846124bd565b60208082526028908201527f455243373231473a205f6d696e74496e7465726e616c206f766572206d6178426040820152676174636853697a6560c01b606082015260800190565b6020808252602b908201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960408201526a6e697469616c697a696e6760a81b60608201526080019056fea264697066735822122034056d06b9aa9b81a7f2db16a56d0eb08e656df06ce4f45d63bca4901b9a7ac964736f6c634300080c0033";

type CollageConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: CollageConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Collage__factory extends ContractFactory {
  constructor(...args: CollageConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<Collage> {
    return super.deploy(overrides || {}) as Promise<Collage>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): Collage {
    return super.attach(address) as Collage;
  }
  override connect(signer: Signer): Collage__factory {
    return super.connect(signer) as Collage__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): CollageInterface {
    return new utils.Interface(_abi) as CollageInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Collage {
    return new Contract(address, _abi, signerOrProvider) as Collage;
  }
}
