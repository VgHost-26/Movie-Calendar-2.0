import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import useAuth from '@/hooks/useAuth'
import { Popover, PopoverHeader, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { CircleUserIcon, UserIcon } from 'lucide-react'

const ProfileIcon = () => {
    const { user } = useAuth()
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
                {user ?
                    <Avatar size="sm">
                        <AvatarImage
                            src={user?.photoURL || ''}
                            alt="Profile"
                        />
                        <AvatarFallback>{user?.displayName?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    : <UserIcon size={24} />}
            </Button>
            {user ?
                <Popover>
                    <PopoverHeader>
                        {user.displayName}
                    </PopoverHeader>
                    <Button onPress={handleLogout}>Logout</Button>
                </Popover>
                : <Popover>
                    <Button onPress={() => navigate('/login')}>Login</Button>
                    <Button onPress={() => navigate('/signup')}>Register</Button>
                </Popover>
            }
        </PopoverTrigger>
    )
}

export default ProfileIcon