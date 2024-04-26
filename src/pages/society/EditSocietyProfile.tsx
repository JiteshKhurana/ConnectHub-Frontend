import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { editSocietyFormFields, editSocietySchema } from "@/schemas/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { API_ENDPOINT } from "@/lib/constants";
import Cookies from "universal-cookie";
import { useState } from "react";
import { toast } from "sonner";
import { editSociety } from "@/store/societyProfileSlice";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const EditSocietyProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const society = useSelector(
    (store: RootState) => store.society.currentSociety
  );
  const cookies = new Cookies(null, { path: "/" });
  const token = cookies.get("token");
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<editSocietyFormFields>({
    defaultValues: {
      about: society?.about,
      members: society?.members,
    },
    resolver: zodResolver(editSocietySchema),
  });

  if (success) {
    toast("Sucessfully Sent Request to DOSA Office!! 🥳");
    setSuccess(false);
  }

  const onSubmit: SubmitHandler<editSocietyFormFields> = async (
    data: editSocietyFormFields
  ) => {
    await axios
      .post(API_ENDPOINT + "soc/update/" + society?.email, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setSuccess(true);
        dispatch(editSociety(res.data));
      })
      .catch((error) =>
        setError("root", {
          message: error.message,
        })
      );
  };
  const fieldArray1 = useFieldArray({
    name: "members",
    control,
  });
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="flex flex-col">
        <div className="heading flex items-center gap-4 py-2">
          <span className="text-3xl font-semibold">
            Edit your public profile
          </span>
        </div>

        <form
          className="flex flex-col gap-y-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <p className="text-red-500">
            DISCLAIMER: Your Society will not be visible to public until DOSA
            approves your Society Description.
          </p>
          <label>About</label>
          <textarea
            {...register("about")}
            className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Write about your society"
          ></textarea>
          {errors.about && (
            <div className="text-red-500">{errors.about.message}</div>
          )}

          {/* Team Members */}
          <div>
            <Label>Team Members</Label>
            <div className="flex flex-col space-y-5">
              {fieldArray1.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="space-y-5 flex flex-row justify-between space-x-5"
                >
                  <div className="w-full my-3">
                    <Label>Member {index + 1}</Label>
                    <div className="space-y-2">
                      <Input
                        {...register(`members.${index}.name` as const)}
                        type="text"
                        placeholder={`Name of Member ${index + 1}`}
                      />
                      <Input
                        type="email"
                        {...register(`members.${index}.email` as const)}
                        placeholder={`Email of Member ${index + 1}`}
                      />
                      <Input
                        {...register(`members.${index}.position` as const)}
                        type="text"
                        placeholder={`Position of Member ${index + 1}`}
                      />
                      <Input
                        type="text"
                        {...register(`members.${index}.instagram` as const)}
                        placeholder={`Instagram of Member ${index + 1}`}
                      />
                      <Input
                        type="text"
                        {...register(`members.${index}.linkedin` as const)}
                        placeholder={`Linkedin of Member ${index + 1}`}
                      />
                    </div>
                  </div>
                  <Button
                    className="my-auto"
                    type="button"
                    onClick={() => fieldArray1.remove(index)}
                  >
                    Remove Member
                  </Button>
                </div>
              ))}
              <Button
                className="w-1/4"
                type="button"
                onClick={() =>
                  fieldArray1.append({
                    name: "",
                    email: "",
                    position: "",
                    instagram: "",
                    linkedin: "",
                  })
                }
              >
                Add New Member
              </Button>
            </div>
            {errors.members && (
              <div className="text-red-500">{errors.members.message}</div>
            )}
          </div>

          <div className="savechanges w-full flex justify-between items-center px-10 py-5">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="rounded-sm p-6 border-2 hover:bg-gray-300">
                  Cancel
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. Any changes done will be
                    discarded.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => navigate("/society")}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button
              disabled={isSubmitting}
              type="submit"
              className="rounded-sm p-6"
            >
              {isSubmitting ? "Loading..." : "Save Changes"}
            </Button>
            {errors.root && (
              <div className="text-red-500">{errors.root.message}</div>
            )}
          </div>
        </form>
      </div>
    </main>
  );
};

export default EditSocietyProfile;
