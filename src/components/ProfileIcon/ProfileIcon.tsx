import { useQueryClient } from '@tanstack/react-query'
import { signOut } from 'firebase/auth'
import { UserIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import useAuth from '@/hooks/useAuth'
import { auth } from '@/lib/firebase'
import { useDemoStore } from '@/stores/demoStore'

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { Popover, PopoverHeader, PopoverTrigger } from '../ui/popover'

const ProfileIcon = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const handleLogout = async () => {
    if (useDemoStore.getState().isDemoMode) {
      useDemoStore.getState().exitDemo()
      navigate('/login')
      queryClient.clear()
      return
    }
    await signOut(auth)
    navigate('/calendar')
    queryClient.clear()
  }

  return (
    <PopoverTrigger>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Account"
        className="size-4 shrink-0 rounded-full p-0 hover:bg-transparent [&_svg]:size-4!"
      >
        {user ? (
          <Avatar size="default" className="size-4">
            <AvatarImage src={user?.photoURL || ''} alt="Profile" />
            <AvatarFallback>{user?.displayName?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        ) : (
          <UserIcon size={16} className="size-4 shrink-0" />
        )}
      </Button>
      {user ? (
        <Popover>
          <PopoverHeader>{user.displayName}</PopoverHeader>
          <Button onPress={handleLogout}>Logout</Button>
        </Popover>
      ) : (
        <Popover>
          <Button onPress={() => navigate('/login')}>Login</Button>
          <Button onPress={() => navigate('/signup')}>Register</Button>
        </Popover>
      )}
    </PopoverTrigger>
  )
}

export default ProfileIcon
