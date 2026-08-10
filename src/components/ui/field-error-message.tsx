import type { FieldError } from 'react-hook-form'
import { FieldDescription } from './field'

export default function FieldErrorMessage({ fieldError }: { fieldError: FieldError | undefined }) {
    if (!fieldError?.message) return null
    return (
        <FieldDescription>{fieldError.message}</FieldDescription>
    )
}
