import { Trash2Icon } from 'lucide-react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

type Props = {
  children: React.ReactNode
  title?: string
  description?: string
  onConfirm: () => void
  onCancel?: () => void
}

export function AlertDeleteButton({ children, onConfirm, onCancel, title, description }: Props) {
  return (
    <AlertDialogTrigger>
      <Button variant="destructive">{children}</Button>
      <AlertDialog size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline" onPress={onCancel ?? (() => {})}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction variant="destructive" onPress={onConfirm}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialog>
    </AlertDialogTrigger>
  )
}
