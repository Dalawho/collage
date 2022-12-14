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
      name: "OwnableUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.OwnableUpgradeable__factory>;
    getContractFactory(
      name: "Initializable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Initializable__factory>;
    getContractFactory(
      name: "ERC1155Upgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC1155Upgradeable__factory>;
    getContractFactory(
      name: "ERC1155BurnableUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC1155BurnableUpgradeable__factory>;
    getContractFactory(
      name: "ERC1155SupplyUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC1155SupplyUpgradeable__factory>;
    getContractFactory(
      name: "IERC1155MetadataURIUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC1155MetadataURIUpgradeable__factory>;
    getContractFactory(
      name: "IERC1155ReceiverUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC1155ReceiverUpgradeable__factory>;
    getContractFactory(
      name: "IERC1155Upgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC1155Upgradeable__factory>;
    getContractFactory(
      name: "ContextUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ContextUpgradeable__factory>;
    getContractFactory(
      name: "ERC165Upgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC165Upgradeable__factory>;
    getContractFactory(
      name: "IERC165Upgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC165Upgradeable__factory>;
    getContractFactory(
      name: "Collage",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Collage__factory>;
    getContractFactory(
      name: "IPieces",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IPieces__factory>;
    getContractFactory(
      name: "IRender",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IRender__factory>;
    getContractFactory(
      name: "ERC721G",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC721G__factory>;
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
      name: "IRender",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IRender__factory>;
    getContractFactory(
      name: "Pieces",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Pieces__factory>;
    getContractFactory(
      name: "IInflator",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IInflator__factory>;
    getContractFactory(
      name: "Render",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Render__factory>;
    getContractFactory(
      name: "SSTORE2",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.SSTORE2__factory>;
    getContractFactory(
      name: "Bytecode",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Bytecode__factory>;

    getContractAt(
      name: "OwnableUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.OwnableUpgradeable>;
    getContractAt(
      name: "Initializable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Initializable>;
    getContractAt(
      name: "ERC1155Upgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC1155Upgradeable>;
    getContractAt(
      name: "ERC1155BurnableUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC1155BurnableUpgradeable>;
    getContractAt(
      name: "ERC1155SupplyUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC1155SupplyUpgradeable>;
    getContractAt(
      name: "IERC1155MetadataURIUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC1155MetadataURIUpgradeable>;
    getContractAt(
      name: "IERC1155ReceiverUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC1155ReceiverUpgradeable>;
    getContractAt(
      name: "IERC1155Upgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC1155Upgradeable>;
    getContractAt(
      name: "ContextUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ContextUpgradeable>;
    getContractAt(
      name: "ERC165Upgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC165Upgradeable>;
    getContractAt(
      name: "IERC165Upgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC165Upgradeable>;
    getContractAt(
      name: "Collage",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Collage>;
    getContractAt(
      name: "IPieces",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IPieces>;
    getContractAt(
      name: "IRender",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IRender>;
    getContractAt(
      name: "ERC721G",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC721G>;
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
      name: "IRender",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IRender>;
    getContractAt(
      name: "Pieces",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Pieces>;
    getContractAt(
      name: "IInflator",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IInflator>;
    getContractAt(
      name: "Render",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Render>;
    getContractAt(
      name: "SSTORE2",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.SSTORE2>;
    getContractAt(
      name: "Bytecode",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Bytecode>;

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
