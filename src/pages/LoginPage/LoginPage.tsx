import { useNavigate } from 'react-router-dom'

import { LoginForm } from '@/components/LoginForm/LoginForm'
import { Button } from '@/components/ui/button'
import { useDemoStore } from '@/stores/demoStore'

const LoginPage = () => {
  const navigate = useNavigate()

  const handleEnterDemo = () => {
    useDemoStore.getState().enterDemo()
    navigate('/timeline')
  }

  return (
    <div className="relative flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
      <div className="absolute top-6 right-6 flex flex-col items-stretch gap-1 text-right md:top-10 md:right-10">
        <Button
          size="sm"
          variant="outline"
          onPress={handleEnterDemo}
          className="border-demo/50 bg-demo/10 font-bold tracking-[0.3em] text-demo uppercase hover:bg-demo/20 hover:text-demo"
        >
          Demo
        </Button>
        <p className="max-w-44 text-xs leading-snug text-muted-foreground">Check out live demo!</p>
        {/* TODO: GitHub repo link goes here once the repo is public */}
      </div>
    </div>
  )
}

export default LoginPage
