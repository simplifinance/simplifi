import React from "react";
// import { useMediaQuery } from "@mui/material";
import { flexStart } from "@/constants";
import { telegramIcon, discordIcon, twitterIcon } from "../assets";

const Socials = () => {
  // const isLargeScreen = useMediaQuery('(min-width:800px)');
  // const size = isLargeScreen ? 45 : 35;
  return (
    <ul className={`${flexStart} gap-2`}>
      <li className="mr-3">
        <a href="#123" target="_blank" rel="noreferrer">
          {telegramIcon()}
        </a>
      </li>
      <li className="mr-3">
        <a href="#123" target="_blank" rel="noreferrer">
          {twitterIcon()}
        </a>
      </li>
      <li className="">
        <a href="#123" target="_blank" rel="noreferrer">
          {twitterIcon()}
        </a>
      </li>
    </ul>
  )
}
 
export default Socials;