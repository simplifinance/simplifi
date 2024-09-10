import React from "react"
import SectionHeader from "../sectionHeader"
import Cards from "./cards"
// @ts-ignore
import { problemsData } from "./data"
const Problems = () => {
  return (
    <section
      className={[
        "wrapper font-inter text-lg lg:text-xl text-white1 text-left lg:text-center",
        "py-10 lg:py-20",
      ].join(" ")}
    >
      {problemsData.map((data) => (
        <div key={data.id}>
          <SectionHeader
            sectionTitle={data.sectionTitle}
            subTitle={data.subTitle}
          />
        </div>
      ))}
      <Cards />
    </section>
  )
}

export default Problems
