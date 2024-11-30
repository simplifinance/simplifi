import React from "react";
import { useState } from "react";
import Image from "next/image";

const ScrollButton = ({ windowIsDefined }) => {
  const [visible, setVisible] = useState(false);
  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 300) {
      setVisible(true);
    } else if (scrolled <= 300) {
      setVisible(false);
    }
  };

  const scrollToTop = () => {
    windowIsDefined &&
      window.scrollTo({
        top: 0,
        behavior: "smooth",
        /* you can also use 'auto' behaviour
         in place of 'smooth' */
      });
  };

  windowIsDefined && window.addEventListener("scroll", toggleVisible);
  return (
    <button
      onClick={scrollToTop}
      style={{ display: visible ? "flex" : "none" }}
      className={
        "fixed z-50 bottom-12 right-1 xl:right-5 1xl:right-10  h-10 w-10 xl:h-[53px] xl:w-[52px]"
      }
    >
      <Image 
        src="/images/scrollDown.svg" 
        alt="global lanthern" 
        className="rotate-180"
        width={500}
        height={500}
      />
    </button>
  );
};

export default ScrollButton;
