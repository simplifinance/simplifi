export const modes = {
  lightMode: {
    color: "rgb(var(--foreground-rgb))",
    /* background: linear-gradient(
        to bottom,
        transparent,
        rgb(var(--background-end-rgb))
      )
      rgb(var(--background-start-rgb)); */
  },
  
  darkMode: {
    color: "rgb(var(--foreground-rgb))",
    background: `linear-gradient(
        to bottom,
        transparent,
        rgb(var(--background-end-rgb))
      )
      rgb(var(--background-start-rgb))`,
  }
}