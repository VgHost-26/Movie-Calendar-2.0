import { FlaskConical, LogOut, RotateCcw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { useDemoStore } from '@/stores/demoStore'
import { cn } from '@/lib/utils'

/**
 * Persistent indicator shown on every page while demo mode is active.
 * Explains that data lives only in memory and offers reset / exit actions.
 * Returns null outside demo mode, so pages render it unconditionally.
 */
const DemoBanner = ({ className }: { className?: string }) => {
  const isDemoMode = useDemoStore(state => state.isDemoMode)
  const resetDemo = useDemoStore(state => state.resetDemo)
  const exitDemo = useDemoStore(state => state.exitDemo)
  const navigate = useNavigate()

  if (!isDemoMode) {
    return null
  }

  const handleReset = () => {
    resetDemo()
    toast.success('Demo data has been reset.')
  }

  const handleExit = () => {
    exitDemo()
    navigate('/login')
  }

  return (
    <div
      className={cn(
        'flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2 border-b border-dashed border-demo/50 bg-demo/10 px-4 py-2 text-sm',
        className,
      )}
    >
      <span className="flex items-center gap-2 font-semibold tracking-widest uppercase">
        <FlaskConical className="size-4 text-demo" />
        Demo mode
      </span>
      <span className="text-muted-foreground">
        Changes are stored only in this tab and will be lost on refresh.
      </span>
      <span className="ml-auto flex items-center gap-2">
        <Button size="xs" variant="outline" onPress={handleReset}>
          <RotateCcw />
          Reset demo
        </Button>
        <Button size="xs" variant="ghost" onPress={handleExit}>
          <LogOut />
          Exit demo
        </Button>
      </span>
    </div>
  )
}

export default DemoBanner
