import { zeroAddress } from 'viem';

export const DONOTHING = () => null;
export const ZERO_ADDR = zeroAddress;
export const STRINGS = ["Decentralized", "Secure", "Permissionless"];
export const INIT_ZOOM = '0%';
export const DEFAULT_ANIMATION_STEPS = ['50%', '100%'];
export const FLEX_BEWTEEN =`export const flex justify-between items-center`;
export const FLEX_AROUND =`flex justify-around items-center`;
export const FLEX_START =`flex justify-start items-center`;
export const FLEX_END =`flex justify-end items-center`;
export const FLEX_COL_BETWEEN =`flex flex-col justify-between items-center`;
export const FLEX_COL_CENTER =`flex flex-col justify-center items-center`;
export const FLEX_COL_START =`flex flex-col justify-between items-center`;
export const FLEX_COL_END =`flex flex-col justify-end items-center`;
export const FLEX_CENTER =`flex justify-center items-center`;

export const ERROR = [
  'execution reverted: No approval to spend', 
  'execution reverted: User denied transaction',
  "MetaMask Tx Signature: User denied transaction signature.",
  "Transaction could not be completed"
];
export const CONFIRMATIONS = 3;


export const ACTIVE_CONTENT = [
  {
    children: "Home",
    href: '/'
  },
  {
    children: "Learn",
    href: '/#learn'
  },
  {
    children: "Community",
    href: '/#footer'
  },
  
] as const;