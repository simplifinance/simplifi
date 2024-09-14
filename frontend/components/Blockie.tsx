import Blockies from "react-blockies";
import { ZeroAddress } from "ethers/constants";

interface BlockieProp {
  account: string;
  size?: number;
}

/**
 * Shows a blockie image for the provided wallet address
 * @param {*} props
 * @returns <Blockies> JSX Elemenet
 */


function Blockie(props: BlockieProp) {
  const { account, size } = props;

  return (
    <Blockies
      seed={account?.toLowerCase() || ZeroAddress}
      size={size || 4}
      scale={3}
    />
  );
}

export default Blockie;
