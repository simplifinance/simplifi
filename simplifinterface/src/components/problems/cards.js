import React from "react"
import { problemsData } from "./data"

const Cards = () => {
  return (
    <section
      className={["grid md:grid-cols-2 xl:grid-cols-3 gap-[49px]", "py-8"].join(
        " "
      )}
    >
      {problemsData.map(
        (data) =>
          data.id > 0 && (
            <div
              className={[
                "flex flex-col bg-gray1 justify-center items-center text-center",
                "rounded-[20px] w-full xs:w-10/12 h-[334px] sm:w-[407px] md:w-11/12 2xl:w-full mx-auto",
                "px-8 lg:px-16",
                "drop-shadow-[0_-2px_4px_rgba(0,0,0,0.25)]",
              ].join(" ")}
              key={data.id}
            >
              <img src={data.image} alt={data.problem} className="mb-[12px]" />
              <h3 className="mb-[19px] font-bold text-2xl">{data.problem}</h3>
              <p className="text-lg">{data.body}</p>
            </div>
          )
      )}
    </section>
  )
}

export default Cards
