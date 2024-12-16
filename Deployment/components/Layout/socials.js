import React from "react";
import Image from "next/image";
import { useMediaQuery } from "@mui/material";

const Socials = () => {
  const isLargeScreen = useMediaQuery('(min-width:800px)');
  const size = isLargeScreen ? 45 : 35;
  return (
    <ul className="flex">
      <li className="mr-3">
        <a href="#123" target="_blank" rel="noreferrer">
          <Image height={size} src="images/socials/telegram.svg" alt="telegram" width={size} />
        </a>
      </li>
      <li className="mr-3">
        <a href="#123" target="_blank" rel="noreferrer">
          <Image height={size} src="images/socials/twitter.svg" alt="twitter" width={size} />
        </a>
      </li>
      <li className="">
        <a href="#123" target="_blank" rel="noreferrer">
          <Image height={size} src="images/socials/discord.svg" alt="discord" width={size} />
        </a>
      </li>
    </ul>
  )
}
 
export default Socials;