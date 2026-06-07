import { motion } from 'framer-motion'
import type { PropsWithChildren } from 'react'
import { ease, pageVariants } from '../../lib/motion'

export function PageTransition({ children }: PropsWithChildren) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={ease}
      style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}
    >
      {children}
    </motion.div>
  )
}
