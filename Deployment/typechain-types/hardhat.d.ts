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
      name: "IDIAOracleV2",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IDIAOracleV2__factory>;
    getContractFactory(
      name: "IntegrationSample",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IntegrationSample__factory>;
    getContractFactory(
      name: "Common",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Common__factory>;
    getContractFactory(
      name: "IAssetClass",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IAssetClass__factory>;
    getContractFactory(
      name: "IBank",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IBank__factory>;
    getContractFactory(
      name: "IBankFactory",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IBankFactory__factory>;
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
      name: "Bank",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Bank__factory>;
    getContractFactory(
      name: "BankFactory",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.BankFactory__factory>;
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
      name: "FactoryLibV2",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.FactoryLibV2__factory>;
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
      name: "IDIAOracleV2",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IDIAOracleV2>;
    getContractAt(
      name: "IntegrationSample",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IntegrationSample>;
    getContractAt(
      name: "Common",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Common>;
    getContractAt(
      name: "IAssetClass",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IAssetClass>;
    getContractAt(
      name: "IBank",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IBank>;
    getContractAt(
      name: "IBankFactory",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IBankFactory>;
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
      name: "Bank",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Bank>;
    getContractAt(
      name: "BankFactory",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.BankFactory>;
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
      name: "FactoryLibV2",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.FactoryLibV2>;
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
      name: "IDIAOracleV2",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IDIAOracleV2>;
    deployContract(
      name: "IntegrationSample",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IntegrationSample>;
    deployContract(
      name: "Common",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Common>;
    deployContract(
      name: "IAssetClass",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IAssetClass>;
    deployContract(
      name: "IBank",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IBank>;
    deployContract(
      name: "IBankFactory",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IBankFactory>;
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
      name: "Bank",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Bank>;
    deployContract(
      name: "BankFactory",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.BankFactory>;
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
      name: "FactoryLibV2",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.FactoryLibV2>;
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
      name: "IDIAOracleV2",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IDIAOracleV2>;
    deployContract(
      name: "IntegrationSample",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IntegrationSample>;
    deployContract(
      name: "Common",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Common>;
    deployContract(
      name: "IAssetClass",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IAssetClass>;
    deployContract(
      name: "IBank",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IBank>;
    deployContract(
      name: "IBankFactory",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IBankFactory>;
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
      name: "Bank",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Bank>;
    deployContract(
      name: "BankFactory",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.BankFactory>;
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
      name: "FactoryLibV2",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.FactoryLibV2>;
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
