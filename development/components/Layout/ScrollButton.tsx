import React from "react";
import { useState } from "react";

const ScrollButton = ({ windowIsDefined }: {windowIsDefined: boolean}) => {
  const [visible, setVisible] = useState(false);
  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 300) {
      setVisible(true);
    } else if (scrolled <= 300) {
      setVisible(false);
    }
  };

  React.useEffect(() => {
    windowIsDefined && window.addEventListener("scroll", toggleVisible);

  }, []);

  const scrollToTop = () => {
    windowIsDefined &&
      window.scrollTo({
        top: 0,
        behavior: "smooth",
        /* you can also use 'auto' behaviour
         in place of 'smooth' */
      });
  };

  return (
    <button
      onClick={scrollToTop}
      style={{ display: visible ? "flex" : "none" }}
      className={
        "fixed z-50 bottom-12 right-1 xl:right-5 1xl:right-10  h-10 w-10 xl:h-[53px] xl:w-[52px]"
      }
    >
      <svg width="37" height="59" viewBox="0 0 37 59" fill="#F87C00" xmlns="http://www.w3.org/2000/svg" className="rotate-180 border border-white1/20 bg-orange-400 rounded-[56px] hover:bg-opacity-70">
        <rect x="0.5" y="0.5" width="36" height="58" rx="18" stroke="#F9F4F4"/>
        <path d="M18.2929 45.7071C18.6834 46.0976 19.3166 46.0976 19.7071 45.7071L26.0711 39.3431C26.4616 38.9526 26.4616 38.3195 26.0711 37.9289C25.6805 37.5384 25.0474 37.5384 24.6569 37.9289L19 43.5858L13.3431 37.9289C12.9526 37.5384 12.3195 37.5384 11.9289 37.9289C11.5384 38.3195 11.5384 38.9526 11.9289 39.3431L18.2929 45.7071ZM18 14L18 45L20 45L20 14L18 14Z" fill="#121212"/>
      </svg>
    </button>
  );
};

export default ScrollButton;
