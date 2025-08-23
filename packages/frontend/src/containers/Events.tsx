import { Skeleton } from "@/components/ui/skeleton";
import { useGetPostsQuery as getEvents } from '@/store/apis/opportunitiesApi';
import { ScrollArea } from "@/components/ui/scroll-area";
import { EventsComponent } from "@/components/eventsFeed/EventsComponent";

export default function Events() {
  const { data: events, isLoading } = getEvents();
  console.log(events)
  function renderEventsList(events: any[] | undefined ) {
    return (
      <div className="grid xl:grid-cols-2 grid-cols-1 gap-4 w-full">
        {events?.map(({pk, title,  createdAt, attachment }) => (
          <div key={pk} >
            {isLoading
              ? 
              <div className="flex flex-col mb-10 space-y-3">
                <Skeleton className="h-[125px] rounded-xl" />
                <div className="space-y-2 mb-10">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div> 
              : 
              <EventsComponent imageSrc={attachment}
                datetime={""}
                title={title}
                location={""}
                date={createdAt}
                month={""}   
              />
            }
          </div>
        ))}
      </div>
    );
  }

  if (isLoading) return (
    <div className="flex w-full md:max-w-5xl container mx-auto">
      <div className="flex flex-col space-y-3 md:w-1/3">
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="space-y-2 ">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-100 w-full" />
        </div>

      </div>
      <div className="flex flex-col space-y-3 md:w-1/3">
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    </div>
  );
 
  function renderPosts() {
    return (
      <ScrollArea className="flex flex-col col-span-12 md:flex-row w-full container mx-auto">
        <h1 className="text-2xl font-bold my-5">Upcoming Event</h1>
        {!isLoading && renderEventsList(events)}
      </ScrollArea>
    );
  }

  return (
    <>
      {renderPosts()}
    </>
  );
}