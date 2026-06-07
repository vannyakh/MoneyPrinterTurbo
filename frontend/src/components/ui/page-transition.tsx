import { motion } from 'framer-motion'
import type { PropsWithChildren } from 'react'
import { pageVariants } from '../../lib/motion'

export function PageTransition({ children }: PropsWithChildren) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {children}
    </motion.div>
  )
}
