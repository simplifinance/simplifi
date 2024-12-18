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
      name: "Ownable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Ownable__factory>;
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
      name: "Clones",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Clones__factory>;
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
      name: "Pausable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Pausable__factory>;
    getContractFactory(
      name: "ReentrancyGuard",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ReentrancyGuard__factory>;
    getContractFactory(
      name: "AbstractFactory",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.AbstractFactory__factory>;
    getContractFactory(
      name: "OnlyOwner",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.OnlyOwner__factory>;
    getContractFactory(
      name: "Pausable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Pausable__factory>;
    getContractFactory(
      name: "Common",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Common__factory>;
    getContractFactory(
      name: "IAddressManager",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IAddressManager__factory>;
    getContractFactory(
      name: "IAssetClass",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IAssetClass__factory>;
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
      name: "IOwnerShip",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IOwnerShip__factory>;
    getContractFactory(
      name: "IStrategy",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IStrategy__factory>;
    getContractFactory(
      name: "IStrategyManager",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IStrategyManager__factory>;
    getContractFactory(
      name: "AssetClass",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.AssetClass__factory>;
    getContractFactory(
      name: "Factory",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Factory__factory>;
    getContractFactory(
      name: "OwnerShip",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.OwnerShip__factory>;
    getContractFactory(
      name: "Strategy",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Strategy__factory>;
    getContractFactory(
      name: "StrategyManager",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.StrategyManager__factory>;
    getContractFactory(
      name: "TestAsset",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TestAsset__factory>;
    getContractFactory(
      name: "Attorney",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Attorney__factory>;
    getContractFactory(
      name: "CallContext",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.CallContext__factory>;
    getContractFactory(
      name: "ERC20Abstract",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20Abstract__factory>;
    getContractFactory(
      name: "Reserve",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Reserve__factory>;
    getContractFactory(
      name: "SimpliToken",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.SimpliToken__factory>;
    getContractFactory(
      name: "TokenDistributor",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TokenDistributor__factory>;
    getContractFactory(
      name: "FactoryLib",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.FactoryLib__factory>;
    getContractFactory(
      name: "Lib",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Lib__factory>;
    getContractFactory(
      name: "Utils",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Utils__factory>;
    getContractFactory(
      name: "Lock",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Lock__factory>;
    getContractFactory(
      name: "FuncHandler",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.FuncHandler__factory>;

    getContractAt(
      name: "Ownable",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Ownable>;
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
      name: "Clones",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Clones>;
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
      name: "Pausable",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Pausable>;
    getContractAt(
      name: "ReentrancyGuard",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ReentrancyGuard>;
    getContractAt(
      name: "AbstractFactory",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.AbstractFactory>;
    getContractAt(
      name: "OnlyOwner",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.OnlyOwner>;
    getContractAt(
      name: "Pausable",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Pausable>;
    getContractAt(
      name: "Common",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Common>;
    getContractAt(
      name: "IAddressManager",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IAddressManager>;
    getContractAt(
      name: "IAssetClass",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IAssetClass>;
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
      name: "IOwnerShip",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IOwnerShip>;
    getContractAt(
      name: "IStrategy",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IStrategy>;
    getContractAt(
      name: "IStrategyManager",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IStrategyManager>;
    getContractAt(
      name: "AssetClass",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.AssetClass>;
    getContractAt(
      name: "Factory",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Factory>;
    getContractAt(
      name: "OwnerShip",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.OwnerShip>;
    getContractAt(
      name: "Strategy",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Strategy>;
    getContractAt(
      name: "StrategyManager",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.StrategyManager>;
    getContractAt(
      name: "TestAsset",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.TestAsset>;
    getContractAt(
      name: "Attorney",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Attorney>;
    getContractAt(
      name: "CallContext",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.CallContext>;
    getContractAt(
      name: "ERC20Abstract",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20Abstract>;
    getContractAt(
      name: "Reserve",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Reserve>;
    getContractAt(
      name: "SimpliToken",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.SimpliToken>;
    getContractAt(
      name: "TokenDistributor",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.TokenDistributor>;
    getContractAt(
      name: "FactoryLib",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.FactoryLib>;
    getContractAt(
      name: "Lib",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Lib>;
    getContractAt(
      name: "Utils",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Utils>;
    getContractAt(
      name: "Lock",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Lock>;
    getContractAt(
      name: "FuncHandler",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.FuncHandler>;

    deployContract(
      name: "Ownable",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Ownable>;
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
      name: "Clones",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Clones>;
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
      name: "Pausable",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Pausable>;
    deployContract(
      name: "ReentrancyGuard",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ReentrancyGuard>;
    deployContract(
      name: "AbstractFactory",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.AbstractFactory>;
    deployContract(
      name: "OnlyOwner",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.OnlyOwner>;
    deployContract(
      name: "Pausable",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Pausable>;
    deployContract(
      name: "Common",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Common>;
    deployContract(
      name: "IAddressManager",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IAddressManager>;
    deployContract(
      name: "IAssetClass",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IAssetClass>;
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
      name: "IOwnerShip",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IOwnerShip>;
    deployContract(
      name: "IStrategy",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IStrategy>;
    deployContract(
      name: "IStrategyManager",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IStrategyManager>;
    deployContract(
      name: "AssetClass",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.AssetClass>;
    deployContract(
      name: "Factory",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Factory>;
    deployContract(
      name: "OwnerShip",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.OwnerShip>;
    deployContract(
      name: "Strategy",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Strategy>;
    deployContract(
      name: "StrategyManager",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.StrategyManager>;
    deployContract(
      name: "TestAsset",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.TestAsset>;
    deployContract(
      name: "Attorney",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Attorney>;
    deployContract(
      name: "CallContext",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.CallContext>;
    deployContract(
      name: "ERC20Abstract",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC20Abstract>;
    deployContract(
      name: "Reserve",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Reserve>;
    deployContract(
      name: "SimpliToken",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.SimpliToken>;
    deployContract(
      name: "TokenDistributor",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.TokenDistributor>;
    deployContract(
      name: "FactoryLib",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.FactoryLib>;
    deployContract(
      name: "Lib",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Lib>;
    deployContract(
      name: "Utils",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Utils>;
    deployContract(
      name: "Lock",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Lock>;
    deployContract(
      name: "FuncHandler",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.FuncHandler>;

    deployContract(
      name: "Ownable",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Ownable>;
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
      name: "Clones",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Clones>;
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
      name: "Pausable",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Pausable>;
    deployContract(
      name: "ReentrancyGuard",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ReentrancyGuard>;
    deployContract(
      name: "AbstractFactory",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.AbstractFactory>;
    deployContract(
      name: "OnlyOwner",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.OnlyOwner>;
    deployContract(
      name: "Pausable",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Pausable>;
    deployContract(
      name: "Common",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Common>;
    deployContract(
      name: "IAddressManager",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IAddressManager>;
    deployContract(
      name: "IAssetClass",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IAssetClass>;
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
      name: "IOwnerShip",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IOwnerShip>;
    deployContract(
      name: "IStrategy",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IStrategy>;
    deployContract(
      name: "IStrategyManager",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IStrategyManager>;
    deployContract(
      name: "AssetClass",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.AssetClass>;
    deployContract(
      name: "Factory",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Factory>;
    deployContract(
      name: "OwnerShip",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.OwnerShip>;
    deployContract(
      name: "Strategy",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Strategy>;
    deployContract(
      name: "StrategyManager",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.StrategyManager>;
    deployContract(
      name: "TestAsset",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.TestAsset>;
    deployContract(
      name: "Attorney",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Attorney>;
    deployContract(
      name: "CallContext",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.CallContext>;
    deployContract(
      name: "ERC20Abstract",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC20Abstract>;
    deployContract(
      name: "Reserve",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Reserve>;
    deployContract(
      name: "SimpliToken",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.SimpliToken>;
    deployContract(
      name: "TokenDistributor",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.TokenDistributor>;
    deployContract(
      name: "FactoryLib",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.FactoryLib>;
    deployContract(
      name: "Lib",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Lib>;
    deployContract(
      name: "Utils",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Utils>;
    deployContract(
      name: "Lock",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Lock>;
    deployContract(
      name: "FuncHandler",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.FuncHandler>;

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
