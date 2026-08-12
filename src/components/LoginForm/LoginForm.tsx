import { zodResolver } from '@hookform/resolvers/zod'
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import type { LoginFormData } from '@/Types/types'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { auth } from '@/lib/firebase'
import { cn } from '@/lib/utils'
import { loginSchema } from '@/schemas/zotSchemas'

import FieldErrorMessage from '../ui/field-error-message'


export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParameters = new URLSearchParams(location.search)
  const missingAccount = queryParameters.get('missingAccount') === 'true'

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const handleLoginWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
      navigate('/timeline')
    } catch (error) {
      console.error('Error signing in with Google:', error)
    }
  }

  const loginWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/timeline')
    } catch (error) {
      console.error('Error signing in with email:', error)
    }
  }

  const onSubmit = (data: LoginFormData) => {
    const { email, password } = data
    loginWithEmail(email, password)
  }



  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          {!missingAccount && <CardTitle>Login to your account</CardTitle>}
          {missingAccount && <CardTitle>Please login before accessing the page</CardTitle>}
          {!missingAccount && <CardDescription>Enter your email below to login to your account</CardDescription>}
          {missingAccount && <CardDescription>Local account is not yet supported</CardDescription>}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field data-invalid={!!errors.email?.message}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" type="email" {...register('email')} placeholder="m@example.com" />
                <FieldErrorMessage fieldError={errors.email} />
              </Field>
              <Field data-invalid={!!errors.password?.message}>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input id="password" type="password" {...register('password')} />
                <div className="flex items-center">
                  <Link
                    to="/forgot-password"
                    className="ml-auto block text-sm underline-offset-4 hover:underline"

                  >
                    Forgot your password?
                  </Link>
                </div>
                <FieldErrorMessage fieldError={errors.password} />
              </Field>
              <Field>
                <Button type="submit" >Login</Button>
                <Button variant="outline" type="button" onClick={handleLoginWithGoogle}>
                  Login with Google
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <Link to="/signup">Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
