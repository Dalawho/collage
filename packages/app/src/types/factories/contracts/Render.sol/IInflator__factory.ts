/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IInflator,
  IInflatorInterface,
} from "../../../contracts/Render.sol/IInflator";

const _abi = [
  {
    inputs: [
      {
        internalType: "bytes",
        name: "source",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "destlen",
        type: "uint256",
      },
    ],
    name: "puff",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
];

export class IInflator__factory {
  static readonly abi = _abi;
  static createInterface(): IInflatorInterface {
    return new utils.Interface(_abi) as IInflatorInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IInflator {
    return new Contract(address, _abi, signerOrProvider) as IInflator;
  }
}
