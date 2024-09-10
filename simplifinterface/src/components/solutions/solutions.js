import React from "react"
import SectionBody from "../sectionBody"
import SectionHeader from "../sectionHeader"
import { solutionData } from "./data"

const Solutions = () => {
  return (
    <section className="font-inter text-lg lg:text-xl text-white1 text-left lg:text-center">
      {solutionData.map((data) => (
        // @ts-ignore
        <div key={data.id}>
          <div className="bg-gray1 py-10 lg:py-20">
            {" "}
            <section className="wrapper">
              <SectionHeader
                sectionTitle={data.sectionTitle}
                subTitle={data.subTitle}
              />
              <SectionBody
                paragraph1={data.paragraph1}
                sectionImage={data.sectionImage}
                sectionName={data.sectionName}
                flexRow={data.flexRow}
                paragraph2={undefined}
                flexRowReverse={undefined}
              />
            </section>
          </div>
          <div className="py-10 lg:py-20">
            <section className="wrapper">
              <SectionBody
                sectionImage={data.sectionImage2}
                sectionName={data.sectionName}
                flexRowReverse={data.flexRowReverse}
                paragraph2={data.paragraph2}
                paragraph1={undefined}
                flexRow={undefined}
              />
            </section>
          </div>
          <div className="bg-gray1 py-10 lg:py-20">
            <section className="wrapper">
              <SectionBody
                sectionImage={data.sectionImage3}
                sectionName={data.sectionName}
                paragraph2={data.paragraph2}
                paragraph1={undefined}
                flexRow={data.flexRow}
                flexRowReverse={undefined}
              />
            </section>
          </div>
        </div>
      ))}
    </section>
  )
}

export default Solutions
