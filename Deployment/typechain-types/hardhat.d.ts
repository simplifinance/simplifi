/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  DeployContractOptions,
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomicfoundation/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "IERC1155Errors",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC1155Errors__factory>;
    getContractFactory(
      name: "IERC20Errors",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20Errors__factory>;
    getContractFactory(
      name: "IERC721Errors",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721Errors__factory>;
    getContractFactory(
      name: "ERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20__factory>;
    getContractFactory(
      name: "IERC20Metadata",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20Metadata__factory>;
    getContractFactory(
      name: "IERC20Permit",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20Permit__factory>;
    getContractFactory(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20__factory>;
    getContractFactory(
      name: "Address",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Address__factory>;
    getContractFactory(
      name: "ReentrancyGuard",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ReentrancyGuard__factory>;
    getContractFactory(
      name: "Common",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Common__factory>;
    getContractFactory(
      name: "IDIAOracleV2",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IDIAOracleV2__factory>;
    getContractFactory(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20__factory>;
    getContractFactory(
      name: "IERC20Metadata",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20Metadata__factory>;
    getContractFactory(
      name: "IFactory",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IFactory__factory>;
    getContractFactory(
      name: "IPoint",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IPoint__factory>;
    getContractFactory(
      name: "IRoleBase",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IRoleBase__factory>;
    getContractFactory(
      name: "ISafe",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ISafe__factory>;
    getContractFactory(
      name: "ISafeFactory",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ISafeFactory__factory>;
    getContractFactory(
      name: "ISupportedAsset",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ISupportedAsset__factory>;
    getContractFactory(
      name: "ErrorLib",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ErrorLib__factory>;
    getContractFactory(
      name: "AwardPoint",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.AwardPoint__factory>;
    getContractFactory(
      name: "Contributor",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Contributor__factory>;
    getContractFactory(
      name: "DIAOracleV2",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DIAOracleV2__factory>;
    getContractFactory(
      name: "IDIAOracleV2",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IDIAOracleV2__factory>;
    getContractFactory(
      name: "ERC20Manager",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20Manager__factory>;
    getContractFactory(
      name: "FeeToAndRate",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.FeeToAndRate__factory>;
    getContractFactory(
      name: "MinimumLiquidity",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MinimumLiquidity__factory>;
    getContractFactory(
      name: "OnlyRoleBase",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.OnlyRoleBase__factory>;
    getContractFactory(
      name: "Pausable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Pausable__factory>;
    getContractFactory(
      name: "Pool",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Pool__factory>;
    getContractFactory(
      name: "Price",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Price__factory>;
    getContractFactory(
      name: "Safe",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Safe__factory>;
    getContractFactory(
      name: "SafeGetter",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.SafeGetter__factory>;
    getContractFactory(
      name: "Slots",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Slots__factory>;
    getContractFactory(
      name: "ERC20Abstract",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20Abstract__factory>;
    getContractFactory(
      name: "TokenInteractor",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TokenInteractor__factory>;
    getContractFactory(
      name: "Attorney",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Attorney__factory>;
    getContractFactory(
      name: "FlexpoolFactory",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.FlexpoolFactory__factory>;
    getContractFactory(
      name: "Providers",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Providers__factory>;
    getContractFactory(
      name: "Escape",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Escape__factory>;
    getContractFactory(
      name: "Points",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Points__factory>;
    getContractFactory(
      name: "Reserve",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Reserve__factory>;
    getContractFactory(
      name: "RoleManager",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.RoleManager__factory>;
    getContractFactory(
      name: "SafeFactory",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.SafeFactory__factory>;
    getContractFactory(
      name: "SupportedAssetManager",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.SupportedAssetManager__factory>;
    getContractFactory(
      name: "TokenDistributor",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TokenDistributor__factory>;
    getContractFactory(
      name: "SimpliToken",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.SimpliToken__factory>;
    getContractFactory(
      name: "BaseAsset",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.BaseAsset__factory>;
    getContractFactory(
      name: "Faucet",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Faucet__factory>;

    getContractAt(
      name: "IERC1155Errors",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC1155Errors>;
    getContractAt(
      name: "IERC20Errors",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20Errors>;
    getContractAt(
      name: "IERC721Errors",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721Errors>;
    getContractAt(
      name: "ERC20",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20>;
    getContractAt(
      name: "IERC20Metadata",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20Metadata>;
    getContractAt(
      name: "IERC20Permit",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20Permit>;
    getContractAt(
      name: "IERC20",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20>;
    getContractAt(
      name: "Address",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Address>;
    getContractAt(
      name: "ReentrancyGuard",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ReentrancyGuard>;
    getContractAt(
      name: "Common",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Common>;
    getContractAt(
      name: "IDIAOracleV2",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IDIAOracleV2>;
    getContractAt(
      name: "IERC20",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20>;
    getContractAt(
      name: "IERC20Metadata",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20Metadata>;
    getContractAt(
      name: "IFactory",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IFactory>;
    getContractAt(
      name: "IPoint",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IPoint>;
    getContractAt(
      name: "IRoleBase",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IRoleBase>;
    getContractAt(
      name: "ISafe",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ISafe>;
    getContractAt(
      name: "ISafeFactory",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ISafeFactory>;
    getContractAt(
      name: "ISupportedAsset",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ISupportedAsset>;
    getContractAt(
      name: "ErrorLib",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ErrorLib>;
    getContractAt(
      name: "AwardPoint",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.AwardPoint>;
    getContractAt(
      name: "Contributor",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Contributor>;
    getContractAt(
      name: "DIAOracleV2",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.DIAOracleV2>;
    getContractAt(
      name: "IDIAOracleV2",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IDIAOracleV2>;
    getContractAt(
      name: "ERC20Manager",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20Manager>;
    getContractAt(
      name: "FeeToAndRate",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.FeeToAndRate>;
    getContractAt(
      name: "MinimumLiquidity",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.MinimumLiquidity>;
    getContractAt(
      name: "OnlyRoleBase",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.OnlyRoleBase>;
    getContractAt(
      name: "Pausable",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Pausable>;
    getContractAt(
      name: "Pool",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Pool>;
    getContractAt(
      name: "Price",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Price>;
    getContractAt(
      name: "Safe",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Safe>;
    getContractAt(
      name: "SafeGetter",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.SafeGetter>;
    getContractAt(
      name: "Slots",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Slots>;
    getContractAt(
      name: "ERC20Abstract",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20Abstract>;
    getContractAt(
      name: "TokenInteractor",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.TokenInteractor>;
    getContractAt(
      name: "Attorney",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Attorney>;
    getContractAt(
      name: "FlexpoolFactory",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.FlexpoolFactory>;
    getContractAt(
      name: "Providers",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Providers>;
    getContractAt(
      name: "Escape",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Escape>;
    getContractAt(
      name: "Points",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Points>;
    getContractAt(
      name: "Reserve",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Reserve>;
    getContractAt(
      name: "RoleManager",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.RoleManager>;
    getContractAt(
      name: "SafeFactory",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.SafeFactory>;
    getContractAt(
      name: "SupportedAssetManager",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.SupportedAssetManager>;
    getContractAt(
      name: "TokenDistributor",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.TokenDistributor>;
    getContractAt(
      name: "SimpliToken",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.SimpliToken>;
    getContractAt(
      name: "BaseAsset",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.BaseAsset>;
    getContractAt(
      name: "Faucet",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Faucet>;

    deployContract(
      name: "IERC1155Errors",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC1155Errors>;
    deployContract(
      name: "IERC20Errors",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC20Errors>;
    deployContract(
      name: "IERC721Errors",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC721Errors>;
    deployContract(
      name: "ERC20",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC20>;
    deployContract(
      name: "IERC20Metadata",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC20Metadata>;
    deployContract(
      name: "IERC20Permit",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC20Permit>;
    deployContract(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC20>;
    deployContract(
      name: "Address",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Address>;
    deployContract(
      name: "ReentrancyGuard",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ReentrancyGuard>;
    deployContract(
      name: "Common",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Common>;
    deployContract(
      name: "IDIAOracleV2",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IDIAOracleV2>;
    deployContract(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC20>;
    deployContract(
      name: "IERC20Metadata",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC20Metadata>;
    deployContract(
      name: "IFactory",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IFactory>;
    deployContract(
      name: "IPoint",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IPoint>;
    deployContract(
      name: "IRoleBase",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IRoleBase>;
    deployContract(
      name: "ISafe",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ISafe>;
    deployContract(
      name: "ISafeFactory",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ISafeFactory>;
    deployContract(
      name: "ISupportedAsset",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ISupportedAsset>;
    deployContract(
      name: "ErrorLib",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ErrorLib>;
    deployContract(
      name: "AwardPoint",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.AwardPoint>;
    deployContract(
      name: "Contributor",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Contributor>;
    deployContract(
      name: "DIAOracleV2",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.DIAOracleV2>;
    deployContract(
      name: "IDIAOracleV2",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IDIAOracleV2>;
    deployContract(
      name: "ERC20Manager",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC20Manager>;
    deployContract(
      name: "FeeToAndRate",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.FeeToAndRate>;
    deployContract(
      name: "MinimumLiquidity",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.MinimumLiquidity>;
    deployContract(
      name: "OnlyRoleBase",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.OnlyRoleBase>;
    deployContract(
      name: "Pausable",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Pausable>;
    deployContract(
      name: "Pool",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Pool>;
    deployContract(
      name: "Price",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Price>;
    deployContract(
      name: "Safe",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Safe>;
    deployContract(
      name: "SafeGetter",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.SafeGetter>;
    deployContract(
      name: "Slots",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Slots>;
    deployContract(
      name: "ERC20Abstract",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC20Abstract>;
    deployContract(
      name: "TokenInteractor",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.TokenInteractor>;
    deployContract(
      name: "Attorney",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Attorney>;
    deployContract(
      name: "FlexpoolFactory",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.FlexpoolFactory>;
    deployContract(
      name: "Providers",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Providers>;
    deployContract(
      name: "Escape",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Escape>;
    deployContract(
      name: "Points",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Points>;
    deployContract(
      name: "Reserve",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Reserve>;
    deployContract(
      name: "RoleManager",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.RoleManager>;
    deployContract(
      name: "SafeFactory",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.SafeFactory>;
    deployContract(
      name: "SupportedAssetManager",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.SupportedAssetManager>;
    deployContract(
      name: "TokenDistributor",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.TokenDistributor>;
    deployContract(
      name: "SimpliToken",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.SimpliToken>;
    deployContract(
      name: "BaseAsset",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.BaseAsset>;
    deployContract(
      name: "Faucet",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Faucet>;

    deployContract(
      name: "IERC1155Errors",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC1155Errors>;
    deployContract(
      name: "IERC20Errors",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC20Errors>;
    deployContract(
      name: "IERC721Errors",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC721Errors>;
    deployContract(
      name: "ERC20",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC20>;
    deployContract(
      name: "IERC20Metadata",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC20Metadata>;
    deployContract(
      name: "IERC20Permit",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC20Permit>;
    deployContract(
      name: "IERC20",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC20>;
    deployContract(
      name: "Address",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Address>;
    deployContract(
      name: "ReentrancyGuard",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ReentrancyGuard>;
    deployContract(
      name: "Common",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Common>;
    deployContract(
      name: "IDIAOracleV2",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IDIAOracleV2>;
    deployContract(
      name: "IERC20",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC20>;
    deployContract(
      name: "IERC20Metadata",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC20Metadata>;
    deployContract(
      name: "IFactory",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IFactory>;
    deployContract(
      name: "IPoint",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IPoint>;
    deployContract(
      name: "IRoleBase",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IRoleBase>;
    deployContract(
      name: "ISafe",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ISafe>;
    deployContract(
      name: "ISafeFactory",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ISafeFactory>;
    deployContract(
      name: "ISupportedAsset",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ISupportedAsset>;
    deployContract(
      name: "ErrorLib",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ErrorLib>;
    deployContract(
      name: "AwardPoint",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.AwardPoint>;
    deployContract(
      name: "Contributor",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Contributor>;
    deployContract(
      name: "DIAOracleV2",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.DIAOracleV2>;
    deployContract(
      name: "IDIAOracleV2",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IDIAOracleV2>;
    deployContract(
      name: "ERC20Manager",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC20Manager>;
    deployContract(
      name: "FeeToAndRate",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.FeeToAndRate>;
    deployContract(
      name: "MinimumLiquidity",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.MinimumLiquidity>;
    deployContract(
      name: "OnlyRoleBase",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.OnlyRoleBase>;
    deployContract(
      name: "Pausable",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Pausable>;
    deployContract(
      name: "Pool",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Pool>;
    deployContract(
      name: "Price",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Price>;
    deployContract(
      name: "Safe",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Safe>;
    deployContract(
      name: "SafeGetter",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.SafeGetter>;
    deployContract(
      name: "Slots",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Slots>;
    deployContract(
      name: "ERC20Abstract",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC20Abstract>;
    deployContract(
      name: "TokenInteractor",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.TokenInteractor>;
    deployContract(
      name: "Attorney",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Attorney>;
    deployContract(
      name: "FlexpoolFactory",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.FlexpoolFactory>;
    deployContract(
      name: "Providers",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Providers>;
    deployContract(
      name: "Escape",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Escape>;
    deployContract(
      name: "Points",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Points>;
    deployContract(
      name: "Reserve",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Reserve>;
    deployContract(
      name: "RoleManager",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.RoleManager>;
    deployContract(
      name: "SafeFactory",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.SafeFactory>;
    deployContract(
      name: "SupportedAssetManager",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.SupportedAssetManager>;
    deployContract(
      name: "TokenDistributor",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.TokenDistributor>;
    deployContract(
      name: "SimpliToken",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.SimpliToken>;
    deployContract(
      name: "BaseAsset",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.BaseAsset>;
    deployContract(
      name: "Faucet",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Faucet>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
    deployContract(
      name: string,
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<ethers.Contract>;
    deployContract(
      name: string,
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<ethers.Contract>;
  }
}
