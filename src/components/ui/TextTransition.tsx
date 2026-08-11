import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, type ReactNode } from 'react'

import { ScrollDirection } from '@/Types/types'

type Props = {
  direction?: ScrollDirection
  exitDirection?: 'same' | 'opposite'
  speed?: number
  children: ReactNode
  className?: string
}

// TODO: fix rapid changes - occur very rarely
const TextTransition = ({
  children,
  direction = ScrollDirection.FORWARD,
  exitDirection = 'same',
  speed = 300,
  className,
}: Props) => {
  const variants = useMemo(() => {
    const isUp = direction === ScrollDirection.BACKWARD
    return {
      initial: {
        y: isUp ? '100%' : '-100%',
      },
      animate: {
        y: '0%',
      },
      exit: {
        y: isUp
          ? exitDirection === 'same'
            ? '-100%'
            : '100%'
          : exitDirection === 'same'
            ? '100%'
            : '-100%',
      },
    }
  }, [direction, exitDirection])

  return (
    <div className={`relative flex flex-col overflow-hidden ${className || ''}`}>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={children?.toString()}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{
            duration: speed / 1000,
            ease: [0.33, 1, 0.68, 1],
          }}
        >
          {children}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

export default TextTransition
