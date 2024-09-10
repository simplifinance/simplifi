// Page Layout
import NavBar from "./navbar/navbar"
import Footer from "./footer"
import { useEffect, useState } from "react"
import ScrollButton from "./scrollButton"
import Spinner from "../spinner"
import React from "react"
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
    <div className="relative">
      <section
        className={[
          "fixed h-screen w-full flex justify-center items-center bg-green1 z-50",
          !loading && "hidden",
        ].join(" ")}
      >
        <Spinner size={40} color={"white"} />
      </section>

      <main className="relative font-gothic">
        <ScrollButton windowIsDefined={windowIsDefined} />
        <NavBar handleClick={handleClick} isClicked={isClicked} />
        {children}
        <Footer />
      </main>
    </div>
  )
}

export default Layout
