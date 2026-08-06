import { Controller, useForm } from 'react-hook-form'
import { Field, FieldLabel, FieldLegend, FieldSet } from '../ui/field'
import DatePicker from '../ui/date-picker'
import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { PLATFORMS, PLATFORMS_ICONS } from '@/global/globals'
import { Button } from '../ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { movieSchema } from '@/schemas/zotSchemas'
import type { Movie, MovieFormData } from '@/Types/types'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDownIcon, ChevronLeftIcon } from 'lucide-react'
import { CalendarDate } from '@internationalized/date'
import { useDeleteMovie, useUpdateMovie } from '@/api/apiFirebase'
import { toast } from 'sonner'
import { AlertDeleteButton } from '../ui/delete-button'
import { getPosterUrl, useSearchMoviesMutation, useSearchMultiMutation } from '@/api/apiTMDB'
import type { TMDBMovie, TMDBMulti } from '@/Types/tmdbTypes'
import { AspectRatio } from '../ui/aspect-ratio'
import ReactLenis from 'lenis/react'
import { Tooltip, TooltipTrigger } from '../ui/tooltip'

const MOCKED_MOVIES: TMDBMovie[] = [
  {
    adult: false,
    backdrop_path: '/i5E9H7Ik0u61ylDDTbmUpTL3Yw.jpg',
    genre_ids: [878, 12],
    id: 1170608,
    title: 'Dune: Part Three',
    original_language: 'en',
    original_title: 'Dune: Part Three',
    overview:
      'Emperor Paul Atreides faces the fallout from his ascent to power as political plots and a galaxy-wide holy war endanger the future only he can see.',
    popularity: 14.9892,
    poster_path: '/d43fvHQsIMa4kpyhKXw0haEJIvI.jpg',
    release_date: '2026-12-16',
    video: false,
    vote_average: 0,
    vote_count: 0,
  },
  {
    adult: false,
    backdrop_path: '/rFST4zAaG20VSIxSvYO57nhkkV4.jpg',
    genre_ids: [18, 35],
    id: 1258181,
    title: "A Woman's Life",
    original_language: 'fr',
    original_title: "La vie d'une femme",
    overview:
      'Gabrielle, a dedicated surgeon and head of a hospital department, is stretched thin by the weight of responsibility. There is little time left for her private life: a loving husband and a mother who depends on her care. Yet this is the life she wanted, the life she chose. When a novelist comes to observe her at work for a book, her balance begins to shift.',
    popularity: 1.5389,
    poster_path: '/hakvR1eAbMI4xGFfElR6LZQyq8P.jpg',
    release_date: '2026-09-09',
    video: false,
    vote_average: 0,
    vote_count: 0,
  },
  {
    adult: false,
    backdrop_path: null,
    genre_ids: [99],
    id: 1720561,
    title: "Inceste, le combat d'une vie",
    original_language: 'fr',
    original_title: "Inceste, le combat d'une vie",
    overview: '',
    popularity: 0.8121,
    poster_path: null,
    release_date: '2026-06-15',
    video: false,
    vote_average: 0,
    vote_count: 0,
  },
  {
    adult: false,
    backdrop_path: '/maVfxNUGus0zp91UahYt9GGpZO1.jpg',
    genre_ids: [18],
    id: 1472813,
    title: 'The Diary of a Chambermaid',
    original_language: 'fr',
    original_title: "Le Journal d'une femme de chambre",
    overview:
      'Gianina, a young Romanian, works as a housekeeper for a bourgeois family in Bordeaux. In the evenings, she rehearses the role of a maid with an amateur theater troupe in an adaptation of The Diary of a Chambermaid by Octave Mirbeau. She takes care of Louen, her employers’ son, while her own daughter is growing up far from her, in Romania. The maternal absence deepens into a wound but, as Christmas approaches, the promise of a reunion begins to take shape.',
    popularity: 1.7707,
    poster_path: '/7Q9PLVXTDA1yKLs43OfeukY6W2f.jpg',
    release_date: '2026-10-23',
    video: false,
    vote_average: 0,
    vote_count: 0,
  },
  {
    adult: false,
    backdrop_path: '/dJzuhtmpBYeQEpmSpVlsnI6RJp8.jpg',
    genre_ids: [35, 12, 36, 878],
    id: 1630545,
    title: "Le Temps d'une Tartine 2",
    original_language: 'fr',
    original_title: "Le Temps d'une Tartine 2",
    overview:
      "While Mixel tries the best he can to help along with Martin's parents, Charlène and Martin have escaped the flames and appeared somewhen else, where twists and turns won't end. Why is everything happening? To find that out... they must go Back to the Toaster!",
    popularity: 1.099,
    poster_path: '/an8FGJS0YFbWENUtVrBQiboMMTp.jpg',
    release_date: '2026-07-03',
    video: false,
    vote_average: 10,
    vote_count: 1,
  },
  {
    adult: false,
    backdrop_path: '/iSFhOFUdTFJQZBx9CrgWgQ47Mwm.jpg',
    genre_ids: [18, 36],
    id: 1247662,
    title: 'Villeneuve: The Rise of a Legend',
    original_language: 'fr',
    original_title: "Villeneuve: L'ascension d'une légende",
    overview: 'Showcases the early years of Québec racing driver Gilles Villeneuve.',
    popularity: 1.396,
    poster_path: '/j9jspA0YzOfeVPSzL4Sv17ptL7c.jpg',
    release_date: '2026-11-11',
    video: false,
    vote_average: 0,
    vote_count: 0,
  },
  {
    adult: false,
    backdrop_path: '/zUMpCPqhvLQzPf12OTs8nlRqtqy.jpg',
    genre_ids: [35, 80, 10402],
    id: 1713323,
    title: "Le temps d'une lessive",
    original_language: 'fr',
    original_title: "Le temps d'une lessive",
    overview: '',
    popularity: 0.3495,
    poster_path: '/rkI4yIecAsURKhr7OKeZ0OlG0HB.jpg',
    release_date: '2026-05-10',
    video: false,
    vote_average: 0,
    vote_count: 0,
  },
  {
    adult: false,
    backdrop_path: null,
    genre_ids: [99, 35],
    id: 1739601,
    title: "La traque d'une vie",
    original_language: 'fr',
    original_title: "La traque d'une vie",
    overview: '',
    popularity: 0.6393,
    poster_path: '/m3t9n0okn1cqiYpbVxdYpPSec0n.jpg',
    release_date: '2026-08-01',
    video: false,
    vote_average: 10,
    vote_count: 1,
  },
  {
    adult: false,
    backdrop_path: '/nNpTXH0KfgKjRPTtUByIWKfODLX.jpg',
    genre_ids: [18],
    id: 1736090,
    title: 'Le temps d’une Rose',
    original_language: 'fr',
    original_title: 'Le temps d’une Rose',
    overview: '',
    popularity: 0.0694,
    poster_path: '/f40kODrSOH7CRg2gM3DTJjW1bEx.jpg',
    release_date: '2026-06-09',
    video: true,
    vote_average: 0,
    vote_count: 0,
  },
  {
    adult: false,
    backdrop_path: null,
    genre_ids: [18, 14, 10751],
    id: 1555617,
    title: 'Le temps d’une image',
    original_language: 'fr',
    original_title: 'Le temps d’une image',
    overview: '',
    popularity: 0.2701,
    poster_path: '/d32J8OXRy0H1G1Np3FLIxR739wv.jpg',
    release_date: '2026-05-15',
    video: false,
    vote_average: 0,
    vote_count: 0,
  },
  {
    adult: false,
    backdrop_path: null,
    genre_ids: [],
    id: 1708285,
    title: 'Évocation d’une nuit',
    original_language: 'fr',
    original_title: 'Évocation d’une nuit',
    overview: '',
    popularity: 0.4789,
    poster_path: '/cObfUKc99MwJko5lf2uqSOvJvdN.jpg',
    release_date: '2026-06-05',
    video: false,
    vote_average: 0,
    vote_count: 0,
  },
  {
    adult: false,
    backdrop_path: null,
    genre_ids: [99],
    id: 1623649,
    title: "Amazon, les secrets d'une logistique XXL",
    original_language: 'fr',
    original_title: "Amazon, les secrets d'une logistique XXL",
    overview:
      'Every year, Amazon ships billions of packages around the world. Behind this achievement lies an extraordinary logistics network powered by artificial intelligence.',
    popularity: 0.4583,
    poster_path: '/xIIPwj8HIKudzryPy0zYhVpk2QW.jpg',
    release_date: '2026-01-27',
    video: false,
    vote_average: 8,
    vote_count: 2,
  },
  {
    adult: false,
    backdrop_path: '/wKHfwYgPzFiwto7sK279ZZOXdl7.jpg',
    genre_ids: [99],
    id: 1728575,
    title: "Maroc : les secrets d'une transformation",
    original_language: 'fr',
    original_title: "Maroc : les secrets d'une transformation",
    overview: '',
    popularity: 0.825,
    poster_path: '/b4vAX9BBxKSYJvPSYQrDrOkIVot.jpg',
    release_date: '2026-07-09',
    video: false,
    vote_average: 0,
    vote_count: 0,
  },
  {
    adult: false,
    backdrop_path: '/y2sAOEaAvPXYjMUbT7NJL53b7sD.jpg',
    genre_ids: [99],
    id: 1690811,
    title: "Mossoul, renaissance d'une ville millénaire",
    original_language: 'fr',
    original_title: "Mossoul, renaissance d'une ville millénaire",
    overview: '',
    popularity: 0.7917,
    poster_path: '/ob5U6NIqMsM2b4Jg4JMWRqzs93y.jpg',
    release_date: '2026-05-09',
    video: false,
    vote_average: 8,
    vote_count: 1,
  },
  {
    adult: false,
    backdrop_path: '/eQ5qQP8pNxbFhCAognajXbpEv0u.jpg',
    genre_ids: [99],
    id: 1626370,
    title: "La beauté d'une histoire commune.",
    original_language: 'fr',
    original_title: "La beauté d'une histoire commune.",
    overview:
      'Eden, dancer and composer, embodies a journey through movement, tracing the rises and falls of human history. Above a screen projecting fragments of collective stories, his body expresses a vision of beauty, fragile, fleeting, and everywhere beneath our feet.',
    popularity: 0.1251,
    poster_path: '/ryoOxqPYSEEz6T3iFywhPGpn6A4.jpg',
    release_date: '2026-01-30',
    video: false,
    vote_average: 0,
    vote_count: 0,
  },
  {
    adult: false,
    backdrop_path: '/6K3XwaLOr4NprzgCJUSUznvxOdH.jpg',
    genre_ids: [10749, 35],
    id: 1614791,
    title: "Chronique d'une sirène en détresse",
    original_language: 'fr',
    original_title: "Chronique d'une sirène en détresse",
    overview: '',
    popularity: 1.0591,
    poster_path: '/ypsmldxTwP7GzSo4K2yruPDAOKK.jpg',
    release_date: '2026-01-30',
    video: false,
    vote_average: 0,
    vote_count: 0,
  },
  {
    adult: false,
    backdrop_path: '/zd1HmfKnKOhPsukjNVMpMPM1RFl.jpg',
    genre_ids: [99],
    id: 1301817,
    title: "Entre deux âges, portraits d'une jeunesse",
    original_language: 'fr',
    original_title: "Entre deux âges, portraits d'une jeunesse",
    overview:
      'One late summer afternoon, in a suburb in the far north of France, on the outskirts of Calais and the sea. Children and teenagers kill time at the foot of the tower blocks, between buildings and vacant lots. They talk about love, doubts, and hopes, trying to understand what drives them.',
    popularity: 1.3449,
    poster_path: '/y3BEXrVFgyszFPIGSzGGU7AkIlN.jpg',
    release_date: '2026-04-16',
    video: false,
    vote_average: 0,
    vote_count: 0,
  },
  {
    adult: false,
    backdrop_path: '/42P4Z3UyyvNHLqgvf6GpsO3BR9U.jpg',
    genre_ids: [99],
    id: 1659555,
    title: "Loana : Destin tragique d'une icône brisée",
    original_language: 'fr',
    original_title: "Loana : Destin tragique d'une icône brisée",
    overview: '',
    popularity: 1.8622,
    poster_path: '/k0hvWwyw7TYcGU3hyZSKAg0t6pk.jpg',
    release_date: '2026-03-28',
    video: false,
    vote_average: 0,
    vote_count: 0,
  },
  {
    adult: false,
    backdrop_path: null,
    genre_ids: [99],
    id: 1742466,
    title: "Ligne Rouge - Zidane, la fabrique d'une légende",
    original_language: 'fr',
    original_title: "Ligne Rouge - Zidane, la fabrique d'une légende",
    overview: '',
    popularity: 0.1496,
    poster_path: '/lEYCejQLBdEcMZ76OcWzmX8B8ZM.jpg',
    release_date: '2026-08-03',
    video: true,
    vote_average: 0,
    vote_count: 0,
  },
  {
    adult: false,
    backdrop_path: '/sCLZdaUhWLBFjuekaHZB9MzeNM9.jpg',
    genre_ids: [99],
    id: 1617147,
    title: 'JD Vance: The Revenge of America',
    original_language: 'fr',
    original_title: "J.D. Vance : la revanche d'une Amérique",
    overview:
      'From his chaotic childhood to the White House, JD Vance embodies the MAGA-style revenge of America. To recount the ideological journey of the Vice President of the United States, Thomas Snégaroff and David Thomson met with a dozen people who have been close to him throughout his life. They reveal who Vance truly is: how the man evolved ideologically and how he transformed politically. These encounters and interviews with his closest associates, including his mother Beverly and his mentor, David Frum, uncover the secrets of his ambitions and plans to transform America and Europe.',
    popularity: 0.7374,
    poster_path: '/3a5i0w8VdubdO0pzWtjbX6A6YHl.jpg',
    release_date: '2026-01-15',
    video: false,
    vote_average: 7,
    vote_count: 1,
  },
]

type Props = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  movieData: Movie
  setPosterPreview: (poster: string) => void
}
const TimelineMovieEditor = ({ isOpen, onOpenChange, movieData, setPosterPreview }: Props) => {
  const { title, platform, poster, date, trailerURL } = movieData
  const dateObj = new Date(date)
  const calendarDate = new CalendarDate(
    dateObj.getFullYear(),
    dateObj.getMonth() + 1,
    dateObj.getDate(),
  )

  const [morePostersOpen, setMorePostersOpen] = useState(false)
  const [morePosters, setMorePosters] = useState<TMDBMulti[]>([])
  const [selectedDate, setSelectedDate] = useState<CalendarDate | null>(calendarDate)

  const { deleteMovie } = useDeleteMovie()
  const { updateMovie } = useUpdateMovie()
  const { mutateAsync, data, isPending } = useSearchMultiMutation()
  const {
    reset,
    setValue,
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm<MovieFormData>({
    resolver: zodResolver(movieSchema),
    defaultValues: {
      title,
      date,
      platform,
      poster,
      trailerURL,
    },
  })

  const handleCancel = () => {
    onOpenChange(false)
    setMorePostersOpen(false)
    setPosterPreview(movieData.poster || '')
    reset()
  }

  const onSubmit = async (data: MovieFormData) => {
    console.log('editing movie:', data)
    setPosterPreview(data.poster || '')
    updateMovie(movieData.id, data)
  }

  const handleDelete = () => {
    deleteMovie(movieData.id)
    onOpenChange(false)
    toast.success('Movie deleted successfully!')
  }

  const handleSearchPoster = async () => {
    const title = watch('title').trim()

    try {
      const response = await mutateAsync({ query: title })
      if (response && response.results.length > 0) {
        if (response.results.length > 1) {
          setMorePosters(response.results)
        }
        const firstResult = response.results[0]
        if (!firstResult) {
          console.log('No results found for the movie:', title, 'year:', dateObj.getFullYear())
          return
        }
        const posterUrl = getPosterUrl(firstResult)
        console.log('Poster URL found:', posterUrl)
        setValue('poster', posterUrl)
        setPosterPreview(posterUrl)
      }
    } catch (error) {
      console.error('Error searching for poster:', error)
      toast.error('Failed to search for poster. Please try again.')
    }
  }

  const handleShowMorePosters = () => {
    setMorePostersOpen((prev) => !prev)
  }

  const handleSwitchPoster = (posterUrl: string) => {
    setValue('poster', posterUrl)
    setPosterPreview(posterUrl)
    // setMorePostersOpen(false)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ translateX: '-100%', marginRight: 'calc(var(--width-timeline-card) * -1)' }}

          animate={{ translateX: 0, marginRight: '0' }}

          exit={{ translateX: '-100%', marginRight: 'calc(var(--width-timeline-card) * -1)' }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}

          className={`z-10 w-timeline-card max-w-window-no-sidebar-icon-no-card-with-padding overflow-hidden bg-background`}
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex w-timeline-card flex-col gap-4 p-4"
          >
            <FieldSet>
              <FieldLegend className="flex items-center gap-2">
                <Button size="icon-xs" type="button" variant="secondary" onPress={handleCancel}>
                  <ChevronLeftIcon />
                </Button>
                Edit Movie
              </FieldLegend>
              <Field>
                <FieldLabel htmlFor="title">Title</FieldLabel>
                <input
                  {...register('title')}
                  type="text"
                  id="title"
                  name="title"
                  required
                  placeholder="Movie title"
                  className="px-2 py-1"
                />
              </Field>
              <div className="flex gap-8">
                <Field>
                  <FieldLabel htmlFor="date">Date</FieldLabel>
                  <Controller
                    name="date"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        selectedDate={selectedDate}
                        onDateChange={(date) => {
                          setSelectedDate(date)
                          field.onChange(date ? date.toString() : '')
                        }}
                      />
                    )}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="platform">Platform</FieldLabel>
                  <Controller
                    name="platform"
                    control={control}
                    render={({ field }) => (
                      <Select
                        placeholder="Select platform"
                        id="platform"
                        value={field.value}
                        onChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PLATFORMS.map((platform) => (
                            <SelectItem id={platform} key={platform} value={platform}>
                              <img
                                src={PLATFORMS_ICONS[platform]}
                                alt={`${platform} icon`}
                                className="mr-2 size-4"
                              />
                              {platform}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="poster">Poster</FieldLabel>
                <div className="flex gap-4">
                  <input
                    {...register('poster')}
                    type="url"
                    id="poster"
                    name="poster"
                    placeholder="https://example.com/poster"
                    className="grow px-2 py-1"
                  />
                  <div className="flex">
                    <Button type="button" variant="secondary" onPress={handleSearchPoster}>
                      Autodetect
                    </Button>
                    {morePosters.length > 1 && (
                      <TooltipTrigger>
                        <Button
                          type="button"
                          variant="secondary"
                          size="icon"
                          onPress={handleShowMorePosters}
                        >
                          <ChevronDownIcon className={`${morePostersOpen ? 'rotate-180' : ''}`} />
                        </Button>
                        <Tooltip placement="top end">
                          <p>Show More Posters</p>
                        </Tooltip>
                      </TooltipTrigger>
                    )}
                  </div>
                </div>
              </Field>
              <AnimatePresence>
                {morePostersOpen && morePosters.length > 0 && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="max-w-[calc(var(--max-width-timeline-card)-2rem)] overflow-hidden"
                  >
                    <ReactLenis
                      data-lenis-prevent
                      options={{
                        orientation: 'horizontal',
                        gestureOrientation: 'vertical',
                        smoothWheel: true,
                      }}
                      className="overflow-hidden"
                    >
                      <div className="flex gap-2">
                        {morePosters.map((movie) => {
                          const posterUrl = getPosterUrl(movie)
                          if (!posterUrl) return
                          return (
                            <TooltipTrigger>
                              <AspectRatio
                                ratio={2 / 3}
                                className="w-[calc(var(--width-timeline-card)/6)] shrink-0 cursor-pointer"
                                key={movie.id}
                              >
                                <img
                                  src={posterUrl}
                                  alt={movie.title}
                                  className="w-full object-cover"
                                  onClick={() => handleSwitchPoster(posterUrl)}
                                />
                              </AspectRatio>
                              <Tooltip>
                                <p>
                                  {movie.title}{' '}
                                  {movie.release_date
                                    ? `(${movie.release_date.split('-')[0]})`
                                    : ''}
                                </p>
                              </Tooltip>
                            </TooltipTrigger>
                          )
                        })}
                      </div>
                    </ReactLenis>
                  </motion.div>
                )}
              </AnimatePresence>
              <Field>
                <FieldLabel htmlFor="trailerURL">Trailer URL</FieldLabel>
                <input
                  {...register('trailerURL')}
                  type="url"
                  id="trailerURL"
                  name="trailerURL"
                  placeholder="https://example.com/trailer"
                  className="px-2 py-1"
                />
              </Field>
              <div className="flex justify-end gap-4">
                <AlertDeleteButton
                  title="Delete Movie"
                  description="Are you sure you want to delete this movie?"
                  onConfirm={handleDelete}
                >
                  Delete
                </AlertDeleteButton>
                <Button type="button" variant="secondary" onPress={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit" variant="default">
                  Save
                </Button>
              </div>
            </FieldSet>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default TimelineMovieEditor
