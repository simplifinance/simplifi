import React from "react";
import { useMediaQuery } from "@mui/material";

const Socials = () => {
  const isLargeScreen = useMediaQuery('(min-width:800px)');
  const size = isLargeScreen ? 45 : 35;
  return (
    <ul className="flex">
    <li className="mr-3">
      <a href="#123" target="_blank" rel="noreferrer">
        <img src="images/socials/telegram.svg" alt="telegram" width={45} />
      </a>
    </li>
    <li className="mr-3">
      <a href="#123" target="_blank" rel="noreferrer">
        <img src="images/socials/twitter.svg" alt="twitter" width={45} />
      </a>
    </li>
    <li className="">
      <a href="#123" target="_blank" rel="noreferrer">
        <img src="images/socials/discord.svg" alt="discord" width={45} />
      </a>
    </li>
  </ul>
  )
}
 
export default Socials;