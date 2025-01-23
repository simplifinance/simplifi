// Page Layout
import React from "react";
import ScrollButton from "./ScrollButton";
import { Spinner } from "../Spinner";
import Stack from '@mui/material/Stack';

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
        <Stack className="place-items-center space-y-4 text-orange-300">
          {/* <h1 className="text-2xl font-black">{'Loading...'}</h1> */}
          <Spinner color="#fed7aa" />
        </Stack>
      </section>
      <div className="w-full h-screen relative">
        <ScrollButton windowIsDefined={windowIsDefined} />
        {children}
      </div>
    </React.Fragment>
  )
}

export default Layout
