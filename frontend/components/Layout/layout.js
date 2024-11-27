// Page Layout
import { useEffect, useState } from "react";
import ScrollButton from "./scrollButton";
import Spinner_2 from "../Spinner_2";
import React from "react";
// Navbar and Footer Component

const Layout = ({ handleClick, isClicked, children }) => {
  const [loading, setLoading] = useState(true)

  const windowIsDefined = typeof window !== "undefined"
  useEffect(() => {
    if (windowIsDefined) {
      window.WOW = require("wowjs")
    }
    new WOW.WOW().init()
  }, [])

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 3000)
  }, [])

  return (
    <main className="relative">
      <section
        className={[
          "fixed h-screen w-full flex justify-center items-center bg-green1 z-50",
          !loading && "hidden",
        ].join(" ")}
      >
        <Spinner_2 size={40} color={"white"} />
      </section>

      <div className="relative font-gothic">
        <ScrollButton windowIsDefined={windowIsDefined} />
        {children}
      </div>
    </main>
  )
}

export default Layout
