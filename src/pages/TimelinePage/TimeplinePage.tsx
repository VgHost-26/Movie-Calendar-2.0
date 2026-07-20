import { AspectRatio } from '@/components/ui/aspect-ratio'
import { ScrollArea } from '@/components/ui/scroll-area'

const RandomImages = () => [
  { id: 1, src: 'https://static.posters.cz/image/1300/133030.jpg' },
  { id: 2, src: 'https://static.posters.cz/image/1300/133031.jpg' },
  { id: 3, src: 'https://static.posters.cz/image/1300/133032.jpg' },
  { id: 4, src: 'https://static.posters.cz/image/1300/133033.jpg' },
  { id: 5, src: 'https://static.posters.cz/image/1300/133034.jpg' },
  { id: 6, src: 'https://static.posters.cz/image/1300/133035.jpg' },
  { id: 7, src: 'https://static.posters.cz/image/1300/133036.jpg' },
  { id: 8, src: 'https://static.posters.cz/image/1300/133037.jpg' },
]

const TimelinePage = () => {
  return (
    <ScrollArea className="flex">
      <div className="flex w-max items-center gap-20 pl-20">
        {RandomImages().map((image) => (
          <AspectRatio key={image.id} ratio={2 / 3} className="h-[80dvh] max-w-[90dvw]">
            <img src={image.src} alt={`Image ${image.id}`} className="h-full object-cover" />
          </AspectRatio>
        ))}
      </div>
    </ScrollArea>
  )
}

export default TimelinePage
