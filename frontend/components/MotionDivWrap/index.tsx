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
      className={`bg-orange-500 h-[100%] w-[40%] p-4 place-items-center ${className}`}
      style={style}
    >
      { children }
    </motion.div>
  )
}
