import { useState, type ReactNode } from 'react'

type Props = {
  direction?: 'up' | 'down'
  speed?: number
  children: ReactNode
}

// TODO: fix rapid changes
const TextTransition = ({ children, direction = 'up', speed = 300 }: Props) => {
  const [currentValue, setCurrentValue] = useState(children)
  const [prevChildren, setPrevChildren] = useState(children)
  const [prevValue, setPrevValue] = useState(children)
  const [isAnimating, setIsAnimating] = useState(false)

  if (children !== prevChildren && !isAnimating) {
    setPrevChildren(children)
    setCurrentValue(children)
    setIsAnimating(false)

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsAnimating(true)
      })
    })
  }

  const handleTransitionEnd = () => {
    setIsAnimating(false)
    setPrevValue(currentValue)
  }

  const isUp = direction === 'up'
  const transform = isUp ? 'translateY(-100%)' : 'translateY(100%)'

  return (
    <div className="relative flex flex-col overflow-y-hidden">
      <span
        className={`aria-hidden:true ${isUp ? 'translate-y-full' : '-translate-y-full'} pointer-events-none absolute inset-0 transition-transform ease-[cubic-bezier(0.33,1,0.68,1)]`}
        style={{
          transform: isAnimating ? transform : '',
          transitionDuration: isAnimating ? `${speed}ms` : '0ms',
        }}
      >
        {currentValue}
      </span>

      <span
        className={isAnimating ? 'transition-transform ease-[cubic-bezier(0.33,1,0.68,1)]' : ''}
        style={{
          transform: isAnimating ? transform : '',
          transitionDuration: isAnimating ? `${speed}ms` : '0ms',
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {prevValue}
      </span>
    </div>
  )
}

export default TextTransition
