/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IRender,
  IRenderInterface,
} from "../../../contracts/Pieces.sol/IRender";

const _abi = [
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
      {
        internalType: "uint16",
        name: "destLen",
        type: "uint16",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
    ],
    name: "addToken",
    outputs: [],
    stateMutability: "nonpayable",
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
