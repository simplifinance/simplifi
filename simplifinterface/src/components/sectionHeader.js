import React from "react"

const SectionHeader = ({ sectionTitle, subTitle }) => {
  return (
    <header>
      <h2 className="font-nova-square text-[32px] lg:text-5xl xl:text-6xl mb-2 tracking-[-0.095em]">
        {sectionTitle}
      </h2>
      <p className="w-9/12 lg:mx-auto tracking-[-0.03em]">{subTitle}</p>
    </header>
  )
}

export default SectionHeader
