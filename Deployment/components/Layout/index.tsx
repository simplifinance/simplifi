"use client"
import React from "react";
import ScrollButton from "./ScrollButton";
import { Spinner } from "../utilities/Spinner";
import Stack from '@mui/material/Stack';
import { ThemeProvider } from "../contexts/ThemeProvider";
import ErrorBoundary from "../utilities/ErrorBoundary";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import LeftSidebar from "./LeftSidebar";
import { MotionDivWrap } from "../utilities/MotionDivWrap";

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
          <Sidebar />
          <ScrollButton windowIsDefined={windowIsDefined} />
          <main className='relative bg-white2 dark:bg-gray1'>
            <MotionDivWrap>
              {children}
            </MotionDivWrap>
          </main>
          <LeftSidebar />
        </div>
      </ErrorBoundary>
    </ThemeProvider>
  )
}

export default Layout
{/* <Footer /> */}
