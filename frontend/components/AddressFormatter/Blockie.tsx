import { ethers } from "ethers";
import Blockies from "react-blockies";


interface BlockieProp {
  account: string;
  size?: number;
}

export const Blockie = (props: BlockieProp) => {
  const { account, size } = props;

  return (
    <Blockies
      seed={account?.toLowerCase() || ethers.constants.AddressZero}
      size={size || 4}
      scale={3}
    />
  );
}
