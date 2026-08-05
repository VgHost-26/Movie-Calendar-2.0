import { useMemo, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ScrollDirection } from '@/Types/types'

type Props = {
  direction?: ScrollDirection
  speed?: number
  children: ReactNode
}

// TODO: fix rapid changes - occur very rarely
const TextTransition = ({ children, direction = ScrollDirection.FORWARD, speed = 300 }: Props) => {
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
        y: isUp ? '-100%' : '100%',
      },
    }
  }, [direction])

  return (
    <div className="relative flex flex-col overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={`${children?.toString()}`}
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
