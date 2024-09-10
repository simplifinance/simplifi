import React from "react"
import Socials from "../../socials"
import ActiveLink from "./activeLink"

const NavList = ({ isClicked, handleClick }) => {
  return (
    <section className="relative bg-[#0E4236] z-30 font-inter text-[32px]">
      <nav
        className={
          isClicked
            ? "w-full bg-green1/50 backdrop-blur-[16px] backdrop-saturate-[180%] text-white fixed h-screen top-0 left-0 pl-5"
            : "invisible"
        }
      >
        <ul
          className={isClicked ? "flex flex-col items-start h-full" : "hidden"}
        >
          <li className="flex relative py-7 mb-16">
            <div className={isClicked ? "" : "hidden"} onClick={handleClick}>
              <img src="images/navbar/close.svg" alt="close menu" width={30} />
            </div>
          </li>
          {/* nav list */}
          <ul className={["flex flex-col h-full"].join(" ")}>
            <div>
              <ActiveLink
                className="mb-5"
                href="/"
                handleClick={handleClick}
                children={"Home"}
              ></ActiveLink>
              <ActiveLink
                className="mb-5"
                href="/#learn"
                handleClick={handleClick}
                children={"Learn"}
              ></ActiveLink>
              <ActiveLink
                className=""
                href="/#footer"
                handleClick={handleClick}
                children={"Commuinity"}
              ></ActiveLink>
            </div>

            {/* social media icon */}
            <div className="mt-auto mb-24">
              <Socials />
            </div>
          </ul>
        </ul>
      </nav>
    </section>
  )
}
export default NavList
