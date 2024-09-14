import { useState } from "react";
import { getEllipsisTxt } from "./getEllipsisTxt";
import Blockie from "./Blockie";

interface AddressProps {
  account: string;
  display?: boolean;
  size?: number;
}
const Address = (props: AddressProps ) => {
  const [isClicked, setIsClicked] = useState(false);
  const { account, display, size } = props;

  const Copy = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className='w-6 h-6 text-white cursor-pointer '
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="#1780FF"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      onClick={() => {
        navigator.clipboard.writeText(account);
        setIsClicked(true);
        setTimeout(() => { setIsClicked(false)}, 6000);
      }}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M15 3v4a1 1 0 0 0 1 1h4" />
      <path d="M18 17h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h4l5 5v7a2 2 0 0 1 -2 2z" />
      <path d="M16 17v2a2 2 0 0 1 -2 2h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h2" />
      <title id="copy-address">Copy Address</title>
    </svg>
  );

  return (
    <div className="flex justify-start items-center gap-2 text-orange-600 font-semibold">
      <span ><Blockie account={account} size={size} /></span> 
      <a href={`https://mumbai.polygonscan.com/address/${account}`} rel="noreferrer" target="_blank">{size ? getEllipsisTxt(account, size) : account}</a>
      <span className="" >{(isClicked ? display && <Check /> : props?.display && <Copy />)}</span>
    </div>
  );
}

export default Address;

const Check = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    strokeWidth="3"
    stroke="#21BF96"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M5 12l5 5l10 -10" />
    <title id="copied-address">Copied!</title>
  </svg>
);