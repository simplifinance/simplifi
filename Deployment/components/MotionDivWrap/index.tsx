import React from 'react';
import { motion } from 'framer-motion';

interface MotionDivWrapProps {
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const MotionDivWrap = (props: MotionDivWrapProps) => {
  const { className, style, children } = props;
  return (
    <motion.div
      initial={{ zoom: "0%", borderRadius: '16px' }} 
      animate={{ zoom: ["10%", "30%", "50%", "70%", "90%", "100%"], }}
      className={`${className || "flex justify-center items-center p-4"}`}
      style={style}
    >
      { children }
    </motion.div>
  )
}

