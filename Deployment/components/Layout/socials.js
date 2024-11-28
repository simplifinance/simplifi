import React from "react";
import Image from 'next/Image';

const Socials = () => {
  return (
    <ul className="flex">
      <li className="mr-3">
        <a href="#123" target="_blank" rel="noreferrer">
          <Image height={45} src="images/socials/telegram.svg" alt="telegram" width={45} />
        </a>
      </li>
      <li className="mr-3">
        <a href="#123" target="_blank" rel="noreferrer">
          <Image height={45} src="images/socials/twitter.svg" alt="twitter" width={45} />
        </a>
      </li>
      <li className="">
        <a href="#123" target="_blank" rel="noreferrer">
          <Image height={45} src="images/socials/discord.svg" alt="discord" width={45} />
        </a>
      </li>
    </ul>
  )
}
 
export default Socials;