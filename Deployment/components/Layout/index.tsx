"use client"
import React from "react";
import ScrollButton from "./ScrollButton";
import { Spinner } from "../utilities/Spinner";
import Stack from '@mui/material/Stack';
import { ThemeProvider } from "../contexts/ThemeProvider";
import ErrorBoundary from "../utilities/ErrorBoundary";
import Navbar from "./Navbar";
import LeftSidebar from "./LeftSidebar";
import RightSideBar from "./RightSidebar";

const Layout = ({children} : {children: React.ReactNode}) => {
  const [loading, setLoading] = React.useState(true);
  const windowIsDefined = typeof window !== "undefined"
  
  React.useEffect(() => {
    // setMount(true);
    setTimeout(() => {
      setLoading(false)
    }, 3000)
  }, []);2
  
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={true}
      // disableTransitionOnChange
    >
      <ErrorBoundary fallback={<p>Something went wrong</p>}>
        <section
          className={[
            "fixed h-screen w-full flex justify-center items-center bg-green1 z-50",
            !loading && "hidden",
          ].join(" ")}
        >
          <Stack className="place-items-center space-y-4 text-orange-300">
            <Spinner color="#fed7aa" />
          </Stack>
        </section>
        <div className="relative appContainer">
          <Navbar />
          <LeftSidebar />
          <ScrollButton windowIsDefined={windowIsDefined} />
          <main className='relative md:py-4 md:pr-4 bg-gray1 md:bg-transparent'>
            <div className="p-4 bg-white1 dark:bg-gray1 border-t border-t-green1/30 md:dark:border-gray1 md:rounded-xl">
              {children}
            </div>
          </main>
          <RightSideBar />
        </div>
      </ErrorBoundary>
    </ThemeProvider>
  )
}

export default Layout
{/* <Footer /> */}
