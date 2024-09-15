import { zeroAddress } from 'viem';

export const DONOTHING = () => null;
export const DRAWERWIDTH = 240;
export const ZERO_ADDR = zeroAddress;
export const STRINGS = ["Decentralized", "Secure", "Permissionless"];
export const INIT_ZOOM = '0%';
export const DEFAULT_ANIMATION_STEPS = ['50%', '100%'];
export const ERROR = [
  'execution reverted: No approval to spend', 
  'execution reverted: User denied transaction',
  "MetaMask Tx Signature: User denied transaction signature.",
  "Transaction could not be completed"
];
export const CONFIRMATIONS = 3;

export const flexCenter = "flex justify-center items-center";
export const flexStart = "flex justify-start items-center";
export const flexEnd = "flex justify-end items-center";
export const flexSpread = "flex justify-between items-center";
export const flexEven = "flex justify-evenly items-center";

export const ROUTE_ENUM = {
  DASHBOARD : 'dashboard',
  INVEST: 'invest',
  DAO: 'digdao',
  LIQUIDITY: 'liquidity',
  SPEEDDOC: 'speeddoc',
  CREATE: 'liquidity/create',
  OPEN: 'liquidity/open',
  CLOSED: 'liquidity/closed'
}
