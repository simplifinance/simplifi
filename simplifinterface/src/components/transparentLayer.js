const TransparenLayer = ({isClicked}) => {
  return (
    <div
      className={
        isClicked ? "absolute bg-white/30 h-full w-full z-20 top-0" : "hidden"
      }
    ></div>
  );
};

export default TransparenLayer;
