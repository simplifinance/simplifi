import React from "react"

const PlayStore = () => {
  return (
    <section className="flex relative bg-gradient-to-r from-[#8FBAAD] via-[#D97C20] to-[#D97C20] w-full text-white1">
      <div className="absolute flex justify-center right-0 top-0 left-0 bottom-0">
        <img
          src="images/frame5.svg"
          alt="play store"
          className="w-full opacity-[0.29]  "
        />{" "}
      </div>
      <div className="relative z-10 wrapper flex flex-col text-center py-[50px] lg:py-[76px] lg:justify-center">
        <h1 className="font-nova-square text-[32px] lg:text-5xl xl:text-6xl mb-2 lg:mb-[37px] tracking-[-0.095em]">
          Experience The Power of Decentralisation
        </h1>
        <div className="mx-auto">
          {" "}
          <img
            src="images/playstore.svg"
            alt="play store"
            className="w-[200px] lg:w-[414px]"
          />
        </div>
      </div>
    </section>
  )
}

export default PlayStore
