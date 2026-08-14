import { useQueryClient } from '@tanstack/react-query'
import { signOut } from 'firebase/auth'
import { UserIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import useAuth from '@/hooks/useAuth'
import { useIsMobile } from '@/hooks/useMobile'
import { auth } from '@/lib/firebase'

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { Popover, PopoverHeader, PopoverTrigger } from '../ui/popover'

const ProfileIcon = () => {
  const { user } = useAuth()
  const isMobile = useIsMobile()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut(auth)
    navigate('/calendar')
    queryClient.clear()
  }

  return (
    <PopoverTrigger>
      <Button variant="ghost" size="icon">
        {user ? (
          <Avatar size={isMobile ? 'lg' : 'sm'}>
            <AvatarImage src={user?.photoURL || ''} alt="Profile" />
            <AvatarFallback>{user?.displayName?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        ) : (
          <UserIcon size={24} />
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
