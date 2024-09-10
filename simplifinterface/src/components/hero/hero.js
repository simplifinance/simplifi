import React from "react"
// @ts-ignore
import styles from "./hero.module.css"
const Hero = () => {
  return (
    <section className="relative font-inter mb-10">
      <div className="absolute flex z-0 justify-between w-full top-[-5rem]">
        <img
          src="images/hero/hero-bg1.png"
          alt="background image"
          className=""
        />
        <img
          src="images/hero/hero-bg2.png"
          alt="background image"
          className="hidden lg:flex right-0 absolute"
        />
      </div>
      <div className="wrapper py-16 lg:pt-32 text-white flex flex-col justify-center relative z-10">
        <header className="lg:w-10/12 mx-auto xl:w-11/12 1xl:w-full 2xl:w-11/12">
          <h1
            className={[
              "font-nova-square text-[40px] md:text-[60px] lg:text-[60px] xl:text-[80px] 1xl:text-[100px] 2xl:text-[120px] text-center",
              "tracking-[-0.095em] md:leading-[5rem] xl:leading-[6rem] 1xl:leading-[8rem]",
            ].join(" ")}
          >
            Enjoy <span className={styles.gradient}>Decentralised</span>{" "}
            <span className={styles.gradient}>Protocols</span> Built On The
            Blockchain
          </h1>
        </header>
        <p className="text-xl  lg:text-2xl text-center mx-auto my-8 mb-10 lg:my-10 md:w-9/12 xl:w-8/12 1xl:w-7/12">
          We consistently build decentralized protocols, in a trustless
          environments that manage both financial and non-financial
          relationships between parties.
        </p>
        <div className="flex flex-col xss:flex-row w-full  justify-center font-extrabold mb-10">
          <a href="">
            {" "}
            <button
              className={[
                "w-full h-[40px] m-0 mb-3 xss:mb-0 xss:w-[130px]",
                "xss:h-[40px] lg:w-[312px] lg:h-[60px]",
                "rounded-lg bg-orange xss:mr-[9px] underlineFromLeft",
              ].join(" ")}
            >
              Go To App
            </button>
          </a>

          <a href="">
            {" "}
            <button
              className={[
                "w-full h-[40px] m-0 mb-3 xss:mb-0 border-[1.5px]",
                "xss:w-[130px] xss:h-[40px] lg:w-[312px] lg:h-[60px]",
                "rounded-lg bg-tranparent border-white1 xss:ml-[9px]",
              ].join(" ")}
            >
              Learn
            </button>
          </a>
        </div>
        <div className="mx-auto mt-10">
          <a href="/#about" className="flex flex-col items-center">
            <img
              src="images/scrollDown.svg"
              alt="scroll down"
              className="w-[30px]"
            />
            <span className="text-base mt-2">Scroll down</span>
          </a>
        </div>
      </div>
    </section>
  )
}

export default Hero
