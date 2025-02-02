// import React from "react";
// // import { useMediaQuery } from "@mui/material";
// import { flexStart } from "@/constants";
// import { telegramIcon, discordIcon, twitterIcon } from "../assets";

// const Socials = () => {
//   // const isLargeScreen = useMediaQuery('(min-width:800px)');
//   // const size = isLargeScreen ? 45 : 35;
//   return (
//     <ul className={`${flexStart} gap-2`}>
//       <li className="mr-3">
//         <a href="#123" target="_blank" rel="noreferrer">
//           {telegramIcon()}
//         </a>
//       </li>
//       <li className="mr-3">
//         <a href="#123" target="_blank" rel="noreferrer">
//           {twitterIcon()}
//         </a>
//       </li>
//       <li className="">
//         <a href="#123" target="_blank" rel="noreferrer">
//           {twitterIcon()}
//         </a>
//       </li>
//     </ul>
//   )
// }
 
// export default Socials;

import React from "react";

const Socials = () => {
  return (
    <ul className="w-full flex justify-center gap-6 text-orange-300 text-sm md:text-md md:gap-10">
      <li className="hover:text-orange-200">
        <a href="#123" target="_blank" rel="noreferrer">
          Telegram
          {/* <img src="images/socials/telegram.svg" alt="telegram" width={45} /> */}
        </a>
      </li>
      <li className="hover:text-orange-200">
        <a href="#123" target="_blank" rel="noreferrer">
          {'X(Twitter)'}
          {/* <img src="images/socials/twitter.svg" alt="twitter" width={45} /> */}
        </a>
      </li>
      <li className="hover:text-orange-200">
        <a href="#123" target="_blank" rel="noreferrer">
          Discord
          {/* <img src="images/socials/discord.svg" alt="discord" width={45} /> */}
        </a>
      </li>
    </ul>
  )
}
 
export default Socials;