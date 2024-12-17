import React from "react";
import { useMediaQuery } from "@mui/material";
import { flexStart } from "@/constants";

const Socials = () => {
  // const isLargeScreen = useMediaQuery('(min-width:800px)');
  // const size = isLargeScreen ? 45 : 35;
  return (
    <ul className={`${flexStart} gap-2`}>
      <li className="mr-3">
        <a href="#123" target="_blank" rel="noreferrer">
          <img src="/images/socials/telegram.svg" alt="telegram" className="size-8 md:size-12" />
        </a>
      </li>
      <li className="mr-3">
        <a href="#123" target="_blank" rel="noreferrer">
          <img src="/images/socials/twitter.svg" alt="twitter" className="size-8 md:size-12" />
        </a>
      </li>
      <li className="">
        <a href="#123" target="_blank" rel="noreferrer">
          <img src="/images/socials/discord.svg" alt="discord" className="size-8 md:size-12" />
        </a>
      </li>
    </ul>
  )
}
 
export default Socials;