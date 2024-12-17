import React from "react"
import Socials from "../../Layout/socials";
import Link from "next/link";

const Footer = () => {
  return (
    <footer id="footer" className="pt-[10px] relative">
      <div className="md:border-4  border-white1/20 sm:rounded-[26px] md:rounded-[56px] bg-gray1/80 py-6 lg:py-[4rem] text-white font-inter poweredbycrossfi">
        <div className="wrapper flex flex-col md:flex-row justify-between gap-4">
          <ul className="mb-[40px]">
            <li>
              <h1 className="font-nova-square text-2xl lg:text-4xl mb-[16px] lg:mb-[24px] text-orangec">
                SimpliFinance
              </h1>
            </li>
            <Socials />
            <li className="mt-[16px] md:text-md lg:text-xl">
              {" "}
              <a
                href="mailto:officialemail@gmail.com"
                target="_blank"
                rel="noreferrer"
              >
                  officialemail@gmail.com
              </a>
            </li>
          </ul>

          <div className="w-full md:border-2 text-sm md:text-lg border-white1/10 rounded-[36px] px-4 py-6 bg-green1 flex justify-evenly gap-2 items-center">
              <ul className='space-y-2'>
                  <li>
                      <h1 className="text-md lg:text-2xl text-orangec/70 font-bold mb-[16px] lg:mb-[24px] ">
                      WHAT WE DO
                      </h1>
                  </li>
                  <li>
                      <Link href="/">
                      Learn
                      </Link>
                  </li>
                  <li>
                      <Link href="/">
                      Community
                      </Link>
                  </li>
              </ul>
              <ul>
                  <li>
                      {" "}
                      <h1 className="text-md text-orangec/70 lg:text-2xl font-bold mb-[16px] lg:mb-[24px] ">
                      COMPANY
                      </h1>
                  </li>
                  <li>
                      <Link href="/">
                      About Us
                      </Link>
                      </li>
                  <li>
                      <Link href="/">
                      Privacy Policy
                      </Link>
                  </li>
              </ul>
          </div>
        </div>
        <div className="text-lg text-center pt-[58px] text-orangec">
          &copy;2024 SimpliFinance. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer
