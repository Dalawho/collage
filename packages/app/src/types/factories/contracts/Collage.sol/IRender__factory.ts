/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IRender,
  IRenderInterface,
} from "../../../contracts/Collage.sol/IRender";

const _abi = [
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint8",
            name: "scale",
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
          {
            internalType: "uint16",
            name: "layerId",
            type: "uint16",
          },
        ],
        internalType: "struct SharedStructs.LayerStruct[16]",
        name: "layerIds",
        type: "tuple[16]",
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
        components: [
          {
            internalType: "uint8",
            name: "scale",
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
          {
            internalType: "uint16",
            name: "layerId",
            type: "uint16",
          },
        ],
        internalType: "struct SharedStructs.LayerStruct[16]",
        name: "layerIds",
        type: "tuple[16]",
      },
      {
        internalType: "address",
        name: "creator",
        type: "address",
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
];

export class IRender__factory {
  static readonly abi = _abi;
  static createInterface(): IRenderInterface {
    return new utils.Interface(_abi) as IRenderInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IRender {
    return new Contract(address, _abi, signerOrProvider) as IRender;
  }
}
