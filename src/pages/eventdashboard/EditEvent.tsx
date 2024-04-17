import { editEventFormFields, editEventSchema } from "@/schemas/schema";
import { SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { API_ENDPOINT } from "@/lib/constants";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Cookies from "universal-cookie";

const EditEvent = () => {
  const {
    register,
    handleSubmit,
    control,
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
      visibility: "false",
      social_media: {
        Instagram: "",
        Facebook: "",
        X: "",
        OfficialWebsite: "",
      },
      rounds: [
        {
          name: "",
          description: "",
        },
      ],

      prizes: [
        {
          name: "",
          description: "",
        },
      ],
      deadlines: [
        {
          date: new Date(),
          title: "",
          description: "",
        },
      ],
      parameters: [
        {
          name: "",
          description: "",
        },
      ],
    },
    resolver: zodResolver(editEventSchema),
  });

  const { fields, append, remove } = useFieldArray({
    name: "rounds",
    control,
  });
  const fieldArray2 = useFieldArray({
    name: "prizes",
    control,
  });
  const fieldArray3 = useFieldArray({
    name: "deadlines",
    control,
  });
  const fieldArray4 = useFieldArray({
    name: "parameters",
    control,
  });

  const event = useSelector(
    (store: RootState) => store.eventDashboard.currentEvent
  );
  const cookies = new Cookies(null, { path: "/" });
  const token = cookies.get("token");
  if (!event) return <div>Loading...</div>;
  const onSubmit: SubmitHandler<editEventFormFields> = async (data) => {
    // Convert start_date and end_date to Unix timestamps
    const startTimestamp = Math.floor(data.start_date.getTime() / 1000);
    const endTimestamp = Math.floor(data.end_date.getTime() / 1000);

    // Convert each date in the deadlines array to Unix timestamps
    const updatedDeadlines = data.deadlines?.map((deadline) => {
      if (deadline.date) {
        return {
          ...deadline,
          date: Math.floor(deadline.date.getTime() / 1000),
        };
      }
      return deadline;
    });

    // Update the data object with Unix timestamps
    const updatedData = {
      ...data,
      start_date: startTimestamp,
      end_date: endTimestamp,
      deadlines: updatedDeadlines,
    };

    console.log(updatedData);
    await axios
      .post(API_ENDPOINT + "event/update/" + event._Eid, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log(res.data);
      });
  };
  return (
    <div className="border shadow-2xl flex flex-col w-[90%] px-3 md:w-[70%] rounded-xl py-5 my-5">
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
        <div className="flex flex-row space-x-5 justify-between">
          <div>
            <Label htmlFor="description">Start Date</Label>
            <Input
              {...register("start_date", { valueAsDate: true })}
              type="datetime-local"
            />
          </div>

          <div>
            <Label htmlFor="description">End Date</Label>
            <Input
              {...register("end_date", { valueAsDate: true })}
              type="datetime-local"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="visibility" />
            <Label htmlFor="visibility">Visibility</Label>
            {errors.visibility && (
              <div className="text-red-500">{errors.visibility.message}</div>
            )}
          </div>
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
        <div className="flex flex-row space-x-5">
          <div className="w-1/2">
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
          <div className="w-1/2">
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
          <div className="w-1/2">
            <Label htmlFor="visibility">Event Visibility</Label>
            <select
              {...register("visibility")}
              className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
            >
              <option value="true">Public</option>
              <option value="false">Private</option>
            </select>
            {errors.visibility && (
              <div className="text-red-500">{errors.visibility.message}</div>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="eligibility">Hashtags</Label>
          <div className="flex flex-row flex-wrap gap-2">
            <Input
              className="w-full max-w-[400px]"
              type="text"
              {...register("hashtags.0")}
              placeholder="Hashtag #1"
            />
            <Input
              className="w-full max-w-[400px]"
              type="text"
              {...register("hashtags.1")}
              placeholder="Hashtag #2"
            />
            <Input
              className="w-full max-w-[400px]"
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
          <div className="flex flex-wrap gap-2">
            <Input
              className="w-full max-w-[400px]"
              type="text"
              {...register("social_media.Instagram")}
              placeholder="Instagram"
            />
            <Input
              className="w-full max-w-[400px]"
              type="text"
              {...register("social_media.Facebook")}
              placeholder="Facebook"
            />
            <Input
              className="w-full max-w-[400px]"
              type="text"
              {...register("social_media.X")}
              placeholder="X"
            />
            <Input
              className="w-full max-w-[400px]"
              type="text"
              {...register("social_media.OfficialWebsite")}
              placeholder="Official Website"
            />
          </div>
          {errors.social_media && (
            <div className="text-red-500">{errors.social_media.message}</div>
          )}
        </div>

        {/* ---------------------Rounds Container ----------------------------------*/}
        <div>
          <Label>Rounds</Label>
          <div className="flex flex-col space-y-5">
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-12 space-x-5">
                <div className="col-span-10 space-y-2">
                  <span className="font-semibold">Round {index + 1}</span>
                  <Input
                    {...register(`rounds.${index}.name` as const)}
                    type="text"
                    placeholder={`Round ${index + 1} Name`}
                  />
                  <Textarea
                    {...register(`rounds.${index}.description` as const)}
                    placeholder={`Description of Round ${index + 1}`}
                  />
                </div>

                <Button
                  className="col-span-2 my-auto"
                  type="button"
                  onClick={() => remove(index)}
                >
                  Remove Round
                </Button>
              </div>
            ))}
            <Button
              className="w-1/4"
              type="button"
              onClick={() =>
                append({
                  name: "",
                  description: "",
                })
              }
            >
              Add New Round
            </Button>
          </div>
        </div>

        {/* ---------------------Prizes Container ----------------------------------*/}
        <div>
          <Label>Prizes</Label>
          <div className="flex flex-col space-y-5">
            {fieldArray2.fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-12 space-x-5">
                <div className="col-span-10 space-y-2">
                  <Input
                    {...register(`prizes.${index}.name` as const)}
                    type="text"
                    placeholder={`Prize ${index + 1} Name`}
                  />
                  <Textarea
                    {...register(`prizes.${index}.description` as const)}
                    placeholder={`Description of Prize ${index + 1}`}
                  />
                </div>

                <Button
                  className="col-span-2 my-auto"
                  type="button"
                  onClick={() => fieldArray2.remove(index)}
                >
                  Remove Prize
                </Button>
              </div>
            ))}
            <Button
              className="w-1/4"
              type="button"
              onClick={() =>
                fieldArray2.append({
                  name: "",
                  description: "",
                })
              }
            >
              Add New Prize
            </Button>
          </div>
        </div>

        {/* --------------------- Deadlines Container ----------------------------------*/}

        <div>
          <Label>Deadlines</Label>
          <div className="flex flex-col space-y-5">
            {fieldArray3.fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-12 space-x-5">
                <div className="col-span-10 space-y-2">
                  <Input
                    {...register(`deadlines.${index}.date`, {
                      valueAsDate: true,
                    })}
                    type="datetime-local"
                  />
                  <Input
                    {...register(`deadlines.${index}.title` as const)}
                    type="text"
                    placeholder={`Deadline ${index + 1} Name`}
                  />
                  <Textarea
                    {...register(`deadlines.${index}.description` as const)}
                    placeholder={`Description of Deadline ${index + 1}`}
                  />
                </div>
                <Button
                  className="col-span-2 my-auto"
                  type="button"
                  onClick={() => fieldArray3.remove(index)}
                >
                  Remove Deadline
                </Button>
              </div>
            ))}
            <Button
              className="w-1/4"
              type="button"
              onClick={() =>
                fieldArray3.append({
                  date: new Date(),
                  title: "",
                  description: "",
                })
              }
            >
              Add New Deadline
            </Button>
          </div>
          {errors.deadlines && (
            <div className="text-red-500">{errors.deadlines.message}</div>
          )}
        </div>

        {/* --------------------- Parameters Container ----------------------------------*/}

        <div>
          <Label>Extra Paramaters</Label>
          <div className="flex flex-col space-y-5">
            {fieldArray4.fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-12 space-x-5">
                <div className="col-span-10 space-y-2">
                  <Input
                    {...register(`parameters.${index}.name` as const)}
                    type="text"
                    placeholder={`Extra Parameter Name e.g-height`}
                  />
                  <Textarea
                    {...register(`parameters.${index}.description` as const)}
                    placeholder={`Description of Extra Parameter e.g-Height of the participant in cm.`}
                  />
                </div>
                <Button
                  className="col-span-2 my-auto"
                  type="button"
                  onClick={() => fieldArray4.remove(index)}
                >
                  Remove Parameter
                </Button>
              </div>
            ))}
            <Button
              className="w-1/4"
              type="button"
              onClick={() =>
                fieldArray4.append({
                  name: "",
                  description: "",
                })
              }
            >
              Add New Parameter
            </Button>
          </div>
          {errors.deadlines && (
            <div className="text-red-500">{errors.deadlines.message}</div>
          )}
        </div>

        <Button
          disabled={isSubmitting}
          type="submit"
          className="py-3 px-10 w-full"
        >
          {isSubmitting ? "Loading..." : "Save Changes"}
        </Button>
        {errors.root && (
          <div className="text-red-500">{errors.root.message}</div>
        )}
      </form>
    </div>
  );
};

export default EditEvent;
