/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomiclabs/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "Ownable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Ownable__factory>;
    getContractFactory(
      name: "IERC20Permit",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20Permit__factory>;
    getContractFactory(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20__factory>;
    getContractFactory(
      name: "CCZoo",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.CCZoo__factory>;
    getContractFactory(
      name: "ICCZooRenderer",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ICCZooRenderer__factory>;
    getContractFactory(
      name: "CCZooRender",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.CCZooRender__factory>;
    getContractFactory(
      name: "ICCZooMain",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ICCZooMain__factory>;
    getContractFactory(
      name: "ICCZPayment",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ICCZPayment__factory>;
    getContractFactory(
      name: "IInflator",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IInflator__factory>;
    getContractFactory(
      name: "PaymentSplitter",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.PaymentSplitter__factory>;
    getContractFactory(
      name: "ExquisiteGraphics",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ExquisiteGraphics__factory>;
    getContractFactory(
      name: "Inflator",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Inflator__factory>;
    getContractFactory(
      name: "IExquisiteGraphics",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IExquisiteGraphics__factory>;
    getContractFactory(
      name: "IInflator",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IInflator__factory>;
    getContractFactory(
      name: "SSTORE2",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.SSTORE2__factory>;
    getContractFactory(
      name: "StringTest",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.StringTest__factory>;
    getContractFactory(
      name: "Bytecode",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Bytecode__factory>;
    getContractFactory(
      name: "ERC721A__IERC721Receiver",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC721A__IERC721Receiver__factory>;
    getContractFactory(
      name: "ERC721A",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC721A__factory>;
    getContractFactory(
      name: "IERC721A",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721A__factory>;

    getContractAt(
      name: "Ownable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Ownable>;
    getContractAt(
      name: "IERC20Permit",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20Permit>;
    getContractAt(
      name: "IERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20>;
    getContractAt(
      name: "CCZoo",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.CCZoo>;
    getContractAt(
      name: "ICCZooRenderer",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ICCZooRenderer>;
    getContractAt(
      name: "CCZooRender",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.CCZooRender>;
    getContractAt(
      name: "ICCZooMain",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ICCZooMain>;
    getContractAt(
      name: "ICCZPayment",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ICCZPayment>;
    getContractAt(
      name: "IInflator",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IInflator>;
    getContractAt(
      name: "PaymentSplitter",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.PaymentSplitter>;
    getContractAt(
      name: "ExquisiteGraphics",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ExquisiteGraphics>;
    getContractAt(
      name: "Inflator",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Inflator>;
    getContractAt(
      name: "IExquisiteGraphics",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IExquisiteGraphics>;
    getContractAt(
      name: "IInflator",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IInflator>;
    getContractAt(
      name: "SSTORE2",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.SSTORE2>;
    getContractAt(
      name: "StringTest",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.StringTest>;
    getContractAt(
      name: "Bytecode",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Bytecode>;
    getContractAt(
      name: "ERC721A__IERC721Receiver",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC721A__IERC721Receiver>;
    getContractAt(
      name: "ERC721A",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC721A>;
    getContractAt(
      name: "IERC721A",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721A>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.utils.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
  }
}
