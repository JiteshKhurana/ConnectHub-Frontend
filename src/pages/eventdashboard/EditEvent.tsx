import { editEventFormFields, editEventSchema } from "@/schemas/schema";
import { SubmitHandler, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const EditEvent = () => {
  const {
    register,
    handleSubmit,
    // setError,
    formState: { errors, isSubmitting },
  } = useForm<editEventFormFields>({
    defaultValues: {
      title: "",
      description: "",
      eligibility: "",
      venue: "",
      event_mode: "offline",
      event_type: "technical",
      visibility: true,
      social_media: {
        Instagram: "",
        Facebook: "",
        X: "",
        OfficialWebsite: "",
      },
    },
    resolver: zodResolver(editEventSchema),
  });
  const onSubmit: SubmitHandler<editEventFormFields> = (data) => {
    console.log(data);
  };
  return (
    <div className="border shadow-2xl flex flex-col w-[90%] px-3 md:w-[70%] rounded-xl pt-5 mt-5">
      <h1 className="font-semibold text-2xl mt-3 flex flex-wrap m-5">
        Edit Event
      </h1>
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label htmlFor="title">Event Title</Label>
          <Input {...register("title")} type="text" placeholder="Event Title" />
          {errors.title && (
            <div className="text-red-500">{errors.title.message}</div>
          )}
        </div>
        <div>
          <Label htmlFor="description">Event Description</Label>
          <Textarea
            {...register("description")}
            placeholder="Description of the event."
          />
          {errors.description && (
            <div className="text-red-500">{errors.description.message}</div>
          )}
        </div>
        <div>
          <Label htmlFor="eligibility">Eligibility</Label>
          <Input
            type="text"
            {...register("eligibility")}
            placeholder="Eligibility criteria for the event."
          />
          {errors.eligibility && (
            <div className="text-red-500">{errors.eligibility.message}</div>
          )}
        </div>
        <div>
          <Label htmlFor="venue">Venue</Label>
          <Input
            type="text"
            {...register("venue")}
            placeholder="Where the event will be held."
          />
          {errors.venue && (
            <div className="text-red-500">{errors.venue.message}</div>
          )}
        </div>
        <div>
          <Label htmlFor="event_mode">Event Mode</Label>
          <select
            {...register("event_mode")}
            className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
          >
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="hybrid">Hybrid</option>
          </select>
          {errors.event_mode && (
            <div className="text-red-500">{errors.event_mode.message}</div>
          )}
        </div>
        <div>
          <Label htmlFor="event_type">Event Type</Label>
          <select
            {...register("event_type")}
            className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
          >
            <option value="technical">Technical</option>
            <option value="cultural">Cultural</option>
            <option value="sports">Sports</option>
            <option value="workshop">Workshop</option>
            <option value="hackathon">Hackathon</option>
            <option value="other">Other</option>
          </select>
          {errors.event_type && (
            <div className="text-red-500">{errors.event_type.message}</div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="visibility" />
          <Label htmlFor="visibility">Visibility</Label>
          {errors.visibility && (
            <div className="text-red-500">{errors.visibility.message}</div>
          )}
        </div>
        <div>
          <Label htmlFor="eligibility">Hashtags</Label>
          <div className="flex flex-row space-x-5">
            <Input
              type="text"
              {...register("hashtags.0")}
              placeholder="Hashtag #1"
            />
            <Input
              type="text"
              {...register("hashtags.1")}
              placeholder="Hashtag #2"
            />
            <Input
              type="text"
              {...register("hashtags.2")}
              placeholder="Hashtag #3"
            />
          </div>
          {errors.hashtags && (
            <div className="text-red-500">{errors.hashtags.message}</div>
          )}
        </div>
        <div>
          <Label htmlFor="social_media">Social Media Handles</Label>
          <div className="flex flex-row space-x-5">
            <Input
              type="text"
              {...register("social_media.Instagram")}
              placeholder="Instagram"
            />
            <Input
              type="text"
              {...register("social_media.Facebook")}
              placeholder="Facebook"
            />
            <Input
              type="text"
              {...register("social_media.X")}
              placeholder="X"
            />
            <Input
              type="text"
              {...register("social_media.OfficialWebsite")}
              placeholder="Official Website"
            />
          </div>
          {errors.social_media && (
            <div className="text-red-500">{errors.social_media.message}</div>
          )}
        </div>
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Loading..." : "Submit"}
        </Button>
        {errors.root && (
          <div className="text-red-500">{errors.root.message}</div>
        )}
      </form>
    </div>
  );
};

export default EditEvent;
