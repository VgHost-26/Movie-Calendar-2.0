import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Link, useNavigate } from "react-router-dom"
import { auth } from "@/lib/firebase"
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from "firebase/auth"
import { useForm, type FieldError } from "react-hook-form"
import type { SignupFormData } from "@/Types/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { signupSchema } from "@/schemas/zotSchemas"
import { toast } from "sonner"
import { FirebaseError } from "firebase/app"
import { useState } from "react"

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors }, setError } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  })

  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
      toast('Account created successfully', {
        description: 'Welcome to Movie Calendar!',
      })
      navigate('/timeline')
    } catch (error) {
      toast.error('Error signing up with Google')
    }
  }

  const createUserWithEmail = async (email: string, password: string, name: string) => {

    try {
      setLoading(true)
      const response = await createUserWithEmailAndPassword(auth, email, password)
      console.log('reponse: ', response)
      toast('Account created successfully', {
        description: 'Welcome to Movie Calendar!',
      })
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: name
        })
      }
      navigate('/timeline')
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/email-already-in-use') {
          setError('email', {
            type: 'manual',
            message: 'Email already in use'
          })
        } else {
          console.log('Error signing up with email:', error)
          toast.error('Error signing up with email')
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: SignupFormData) => {
    const { email, password, name } = data
    createUserWithEmail(email, password, name)
  }

  const ErrorMessage = ({ fieldError }: { fieldError: FieldError | undefined }) => {
    if (!fieldError?.message) return null
    return (
      <FieldDescription>{fieldError.message}</FieldDescription>
    )
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field data-invalid={!!errors.name?.message}>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                {...register('name')}
                id="name"
                type="text"
                placeholder="John Doe"
              />
              <ErrorMessage fieldError={errors.name} />
            </Field>
            <Field data-invalid={!!errors.email?.message}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                {...register('email')}
                id="email"
                type="email"
                placeholder="m@example.com"
              />
              <ErrorMessage fieldError={errors.email} />
            </Field>
            <Field data-invalid={!!errors.password?.message}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                {...register('password')}
                id="password"
                type="password"
              />
              <ErrorMessage fieldError={errors.password} />
            </Field>
            <Field data-invalid={!!errors.confirmPassword?.message}>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>
              <Input
                {...register('confirmPassword')}
                id="confirm-password"
                type="password"
              />
              <ErrorMessage fieldError={errors.confirmPassword} />
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit" isDisabled={loading}>
                  {loading ? 'Creating...' : 'Create Account'}
                </Button>
                <Button variant="outline" type="button" onClick={handleGoogleSignup}>
                  Sign up with Google
                </Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account? <Link to="/login">Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
