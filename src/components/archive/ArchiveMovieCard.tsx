import { zodResolver } from '@hookform/resolvers/zod'
import { CheckIcon, EyeOffIcon, ExternalLinkIcon, XIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import type { Movie, MovieFormData } from '@/Types/types'

import { useDeleteMovie, useUpdateMovie } from '@/api/apiFirebase'
import posterPlaceholder from '@/assets/images/poster-placeholder.png'
import { Button } from '@/components/ui/button'
import DatePicker from '@/components/ui/date-picker'
import { Field, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PLATFORMS, PLATFORMS_ICONS } from '@/global/globals'
import { useAnimatedCardExit } from '@/hooks/useAnimatedCardExit'
import { movieSchema } from '@/schemas/zotSchemas'
import { formatMovieDateLabel, getReleaseYear, parseMovieDate } from '@/utils/movieDate'

import WatchedButton from '../timeline/WatchedButton'
import { AspectRatio } from '../ui/aspect-ratio'

type Props = {
  movie: Movie
}

const ArchiveMovieCard = ({ movie }: Props) => {
  const [isFlipped, setIsFlipped] = useState(false)

  const releaseYear = getReleaseYear(movie.date)

  return (
    <AspectRatio
      ratio={2 / 3}
      className={`group overflow-hidden bg-card ${isFlipped ? '' : 'cursor-pointer transition-transform duration-200 hover:scale-[1.03] hover:shadow-xl'}`}
      onClick={isFlipped ? undefined : () => setIsFlipped(true)}
    >
      {isFlipped ? (
        <ArchiveMovieBack movie={movie} onClose={() => setIsFlipped(false)} />
      ) : (
        <>
          <img
            loading="lazy"
            src={movie.poster || posterPlaceholder}
            alt={movie.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 flex flex-1 flex-col justify-between bg-linear-0 from-black/80 from-0% to-transparent to-35% p-2">
            {/* Top badges row */}
            <div className="flex items-start justify-between gap-1">
              <WatchedButton movie={movie} />
              <img
                title={movie.platform}
                src={PLATFORMS_ICONS[movie.platform]}
                alt={movie.platform}
                className="ml-auto size-6 shrink-0 bg-accent p-1"
              />
            </div>
            <div className="flex flex-col gap-1">
              {/* Reserved slot for future use (e.g. scoring, "watched at" date).
                  Intentionally empty — keeps spacing stable once filled. */}
              <div data-archive-meta-reserved className="min-h-5" />
              <h2 className="line-clamp-2 text-base leading-tight font-semibold text-white">
                {movie.title}
              </h2>
              {releaseYear && <p className="text-xs font-medium text-white/70">{releaseYear}</p>}
            </div>
          </div>
        </>
      )}
    </AspectRatio>
  )
}

type BackProps = {
  movie: Movie
  onClose: () => void
}

/**
 * Reverse side of the card, rendered in place of the front (same grid cell,
 * no animation): greyed-out poster as background, details + compact editor
 * on top of it.
 */
const ArchiveMovieBack = ({ movie, onClose }: BackProps) => {
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  const { deleteMovie } = useDeleteMovie()
  const { updateMovie, isLoading: isUpdating } = useUpdateMovie()
  const { leavingCardIds, removeWithExit } = useAnimatedCardExit()
  const isLeaving = leavingCardIds.includes(movie.id)

  const { reset, register, handleSubmit, control, watch } = useForm<MovieFormData>({
    resolver: zodResolver(movieSchema),
    defaultValues: {
      title: movie.title,
      date: movie.date,
      platform: movie.platform,
      poster: movie.poster,
      trailerURL: movie.trailerURL,
    },
  })
  const posterField = watch('poster')

  // Second tap window for the two-tap delete confirm.
  useEffect(() => {
    if (!confirmingDelete) return
    const t = setTimeout(() => setConfirmingDelete(false), 3000)
    return () => clearTimeout(t)
  }, [confirmingDelete])

  // Escape flips back to the front.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleCancel = () => {
    reset()
    onClose()
  }

  const onSubmit = async (data: MovieFormData) => {
    await updateMovie(movie.id, data)
    onClose()
  }

  const handleUnwatch = async () => {
    try {
      await removeWithExit(movie.id, () => updateMovie(movie.id, { watched: false }))
      toast.success('Moved back to timeline!')
    } catch {
      // error toast is handled inside updateMovie
    }
  }

  const handleDeletePress = async () => {
    if (!confirmingDelete) {
      setConfirmingDelete(true)
      return
    }
    try {
      await removeWithExit(movie.id, () => deleteMovie(movie.id))
    } catch {
      // error toast is handled inside deleteMovie
    }
  }

  const formattedDate = parseMovieDate(movie.date) ? formatMovieDateLabel(movie.date) : null

  return (
    <div className="absolute inset-0">
      {/* Greyed-out poster as the "reverse" background */}
      <img
        src={posterField || movie.poster || posterPlaceholder}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover opacity-25 grayscale"
      />
      <div className="scrollbar-hide relative flex h-full flex-col gap-2 overflow-y-auto bg-black/40 p-2">
        <div className="flex items-center justify-between gap-1">
          <img
            title={movie.platform}
            src={PLATFORMS_ICONS[movie.platform]}
            alt={movie.platform}
            className="size-5 shrink-0 bg-accent p-0.5"
          />
          <Button
            size="icon-xs"
            variant="secondary"
            onPress={handleCancel}
            aria-label="Close details"
          >
            <XIcon />
          </Button>
        </div>

        <div>
          <h2 className="line-clamp-2 text-sm leading-tight font-bold text-white">{movie.title}</h2>
          <p className="text-[11px] text-white/70">
            {[formattedDate, movie.platform].filter(Boolean).join(' • ')}
          </p>
          {movie.trailerURL && (
            <a
              href={movie.trailerURL}
              target="_blank"
              rel="noreferrer"
              onClick={e => e.stopPropagation()}
              className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
            >
              <ExternalLinkIcon className="size-3" />
              Trailer
            </a>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <Field>
            <FieldLabel htmlFor={`archive-title-${movie.id}`}>Title</FieldLabel>
            <input
              {...register('title')}
              type="text"
              id={`archive-title-${movie.id}`}
              required
              placeholder="Movie title"
              className="w-full bg-background/90 px-1.5 py-1 text-xs text-foreground"
            />
          </Field>
          <Field>
            <FieldLabel>Date</FieldLabel>
            {/* DatePicker trigger is fixed w-[212px]; force it to the card width.
                The calendar popover itself portals to body, so it stays usable. */}
            <div className="[&_[data-slot=button]]:w-full">
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <DatePicker value={field.value ?? ''} onChange={field.onChange} />
                )}
              />
            </div>
          </Field>
          <Field>
            <FieldLabel>Platform</FieldLabel>
            <Controller
              name="platform"
              control={control}
              render={({ field }) => (
                <Select placeholder="Select platform" value={field.value} onChange={field.onChange}>
                  <SelectTrigger size="sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PLATFORMS.map(p => (
                      <SelectItem id={p} key={p} value={p}>
                        <img src={PLATFORMS_ICONS[p]} alt={`${p} icon`} className="mr-2 size-4" />
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor={`archive-poster-${movie.id}`}>Poster URL</FieldLabel>
            <input
              {...register('poster')}
              type="url"
              id={`archive-poster-${movie.id}`}
              placeholder="https://…"
              className="w-full bg-background/90 px-1.5 py-1 text-xs text-foreground"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor={`archive-trailer-${movie.id}`}>Trailer URL</FieldLabel>
            <input
              {...register('trailerURL')}
              type="url"
              id={`archive-trailer-${movie.id}`}
              placeholder="https://…"
              className="w-full bg-background/90 px-1.5 py-1 text-xs text-foreground"
            />
          </Field>
          <div className="grid grid-cols-2 gap-1 pt-1">
            <Button
              type="button"
              size="xs"
              variant="secondary"
              onPress={handleUnwatch}
              isDisabled={isUpdating || isLeaving}
            >
              <EyeOffIcon data-icon="inline-start" />
              Unwatch
            </Button>
            <Button
              type="button"
              size="xs"
              variant={confirmingDelete ? 'destructive' : 'secondary'}
              onPress={handleDeletePress}
              isDisabled={isLeaving}
            >
              {confirmingDelete ? 'Confirm?' : 'Delete'}
            </Button>
            <Button type="button" size="xs" variant="secondary" onPress={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" size="xs" variant="default" isDisabled={isUpdating || isLeaving}>
              <CheckIcon data-icon="inline-start" />
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ArchiveMovieCard
