// Page Layout
import React from "react";
import ScrollButton from "./ScrollButton";
import { Spinner } from "../Spinner";
import Image from "next/image";
import Footer from "../App/Footer";

const Layout = ({children} : {children: React.ReactNode}) => {
  const [loading, setLoading] = React.useState(true);
  const windowIsDefined = typeof window !== "undefined"

  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 3000)
  }, [])

  return (
    <React.Fragment>
      <section
        className={[
          "fixed h-screen w-full flex justify-center items-center bg-green1 z-50",
          !loading && "hidden",
        ].join(" ")}
      >
        <Spinner color="white" />
      </section>
      <div className="w-full h-screen relative">
        <ScrollButton windowIsDefined={windowIsDefined} />
        {children}
      </div>
    </React.Fragment>
  )
}

export default Layout
