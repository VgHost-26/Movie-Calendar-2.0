import { PlusIcon } from "lucide-react"

import { useTimelineStore } from "@/stores/timelineStore"

import { Button } from "../ui/button"

const TimelineNoMovies = () => {
    const setIsAddMovieDialogOpen = useTimelineStore((state) => state.setIsAddMovieDialogOpen)

    return (
        <div className="">
            <div className="flex flex-col items-center justify-center gap-4 text-center">
                <h2 className="text-2xl font-bold">No movies yet</h2>
                <p className="text-muted-foreground">Add your first movie to the timeline</p>
                <Button variant="default" onPress={() => setIsAddMovieDialogOpen(true)}>
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Add your first movie
                </Button>
            </div>
        </div>
    )
}
export default TimelineNoMovies