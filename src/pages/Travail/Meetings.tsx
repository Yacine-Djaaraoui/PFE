import { useEffect, useMemo, useState } from "react";
import { useCreateMeeting, useMeetings } from "@/hooks/useMeetings";
import { date } from "yup";
import { ReactSVG } from "react-svg";
import plus from "@/assets/Plus.svg";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTeams } from "@/hooks/teams";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface MeetingsProps {
  teamId: number;
}
const Meetings = ({ teamId }: MeetingsProps) => {
  const [isAddThemeOpen, setIsAddThemeOpen] = useState(false);

  const {
    data: Meetings,
    error: getMeeginsError,
    isLoading: getError,
    isError: getIsError,
    isFetching: getIsFetching,
  } = useMeetings({
    ordering: "-created_at",
  });

  const {
    mutate: createMeeting,
    isPending,
    isError,
    error,
    isSuccess,
  } = useCreateMeeting();

  const {
    data,
    error: teamsError,
    isLoading,
    isFetching,
  } = useTeams({
    ordering: "-created_at",
  });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    team: "",
    scheduled_at: "",
    duration_minutes: 30,
    location_type: "online" as "online" | "physical",
    location_details: "",
    meeting_link: "",
  });

  useEffect(() => {
    if (isSuccess) {
      setIsAddThemeOpen(false);
      setFormData({
        title: "",
        description: "",
        team: "",
        scheduled_at: "",
        duration_minutes: 30,
        location_type: "online",
        location_details: "",
        meeting_link: "",
      });
    }
  }, [isSuccess]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "team" || name === "duration_minutes" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMeeting({
      title: formData.title,
      description: formData.description,
      team: Number(formData.team),
      scheduled_at: formData.scheduled_at,
      duration_minutes: formData.duration_minutes,
      location_type: formData.location_type,
      location_details: formData.location_details,
      meeting_link:
        formData.location_type === "online" ? formData.meeting_link : undefined,
    });
  };

  const splitDateTime = (dateTimeString: string) => {
    const dateObj = new Date(dateTimeString);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const date = `${year}-${month}-${day}`;
    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    const time = `${hours}:${minutes}`;
    return { date, time };
  };

  const getFormattedDayMonth = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const monthName = monthNames[monthIndex];
    return { day, monthName };
  };

  const profile = useSelector((state: RootState) => state.auth.profile);

  return (
    <div className="mt-10">
      {isSuccess && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
          Meeting created successfully!
        </div>
      )}

      {isError && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">
          Error: {error.message}
        </div>
      )}

      {Meetings?.results?.filter(
        (meeting: any) => meeting.status === "scheduled"
      ) &&
        Meetings?.results?.filter(
          (meeting: any) =>
            meeting.status === "scheduled" &&
            (profile?.user_type === "teacher" ? meeting.team === teamId : true)
        ).length > 0 && (
          <div className="rounded-[8px] p-[22px] border flex items-start relative justify-start gap-8 border-[#E3E6EA]">
            <div className="w-[76px] h-[76px] rounded-[32px] flex flex-col">
              <p className="w-full h-[30%] rounded-t-[8px] text-white bg-secondary text-md text-center flex items-center justify-center p-1">
                {
                  getFormattedDayMonth(
                    Meetings?.results?.filter(
                      (meeting: any) => meeting.status === "scheduled"
                    )[0]?.scheduled_at
                  ).monthName
                }
              </p>
              <p className="w-full h-[70%] text-black text-lg text-center flex items-center justify-center p-1 shadow">
                {
                  getFormattedDayMonth(
                    Meetings?.results?.filter(
                      (meeting: any) => meeting.status === "scheduled"
                    )[0]?.scheduled_at
                  ).day
                }
              </p>
            </div>
            <div>
              <h2 className="font-inter text-[16px] font-medium">
                Prochaine réunion
              </h2>
              <p className="font-inter text-[14px] text-[#666F8D] mt-2">
                {
                  Meetings?.results?.filter(
                    (meeting: any) => meeting.status === "scheduled"
                  )[0]?.title
                }{" "}
                {
                  Meetings?.results?.filter(
                    (meeting: any) => meeting.status === "scheduled"
                  )[0]?.description
                }
              </p>
            </div>
            {profile?.user_type === "teacher" && (
              <button
                className="hover:bg-gray-300 absolute right-5 top-5"
                onClick={() => setIsAddThemeOpen(true)}
              >
                <ReactSVG src={plus} className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

      {Meetings?.results?.filter(
        (meeting: any) => meeting.status === "scheduled"
      ).length === 0 &&
        profile?.user_type === "teacher" && (
          <div className="flex items-center gap-2 text-gray-700">
            <span>Ajouter un réunion</span>
            <button
              className="hover:bg-gray-300 right-5 top-5"
              onClick={() => setIsAddThemeOpen(true)}
            >
              <ReactSVG src={plus} className="w-5 h-5" />
            </button>
          </div>
        )}

      <Dialog open={isAddThemeOpen} onOpenChange={setIsAddThemeOpen}>
        <DialogContent className="max-w-lg bg-white p-6 rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-secondary">
              Ajouter un réunion
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="mb-4 flex items-start">
              <label className="inline text-gray-700 mb-0" htmlFor="title">
                Title*
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-[300px] mr-4 ml-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength={1}
                maxLength={200}
              />
            </div>

            <div className="mb-4 flex items-start">
              <label
                className="inline text-gray-700 mb-0"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-[300px] mr-4 ml-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <div className="mb-4 flex items-start">
              <label className="inline text-gray-700 mb-0" htmlFor="team">
                Team ID*
              </label>
              <input
                type="number"
                id="team"
                name="team"
                value={formData.team}
                onChange={handleChange}
                className="w-[300px] mr-4 ml-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4 flex items-start">
              <label
                className="inline text-gray-700 mb-0"
                htmlFor="scheduled_at"
              >
                Scheduled At*
              </label>
              <input
                type="datetime-local"
                id="scheduled_at"
                name="scheduled_at"
                value={formData.scheduled_at}
                onChange={handleChange}
                className="w-[300px] mr-4 ml-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4 flex items-start">
              <label
                className="inline text-gray-700 mb-0"
                htmlFor="duration_minutes"
              >
                Duration (minutes)
              </label>
              <input
                type="number"
                id="duration_minutes"
                name="duration_minutes"
                value={formData.duration_minutes}
                onChange={handleChange}
                className="w-[300px] mr-4 ml-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min={0}
              />
            </div>

            <div className="mb-4 flex items-start">
              <label
                className="inline text-gray-700 mb-0"
                htmlFor="location_type"
              >
                Location Type
              </label>
              <select
                id="location_type"
                name="location_type"
                value={formData.location_type}
                onChange={handleChange}
                className="w-[300px] mr-4 ml-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="online">Online</option>
                <option value="physical">Physical</option>
              </select>
            </div>

            {formData.location_type === "physical" && (
              <div className="mb-4 flex items-start">
                <label
                  className="inline text-gray-700 mb-0"
                  htmlFor="location_details"
                >
                  Location Details
                </label>
                <input
                  type="text"
                  id="location_details"
                  name="location_details"
                  value={formData.location_details}
                  onChange={handleChange}
                  className="w-[300px] mr-4 ml-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={255}
                />
              </div>
            )}

            {formData.location_type === "online" && (
              <div className="mb-4 flex items-start">
                <label
                  className="inline text-gray-700 mb-0"
                  htmlFor="meeting_link"
                >
                  Meeting Link*
                </label>
                <input
                  type="url"
                  id="meeting_link"
                  name="meeting_link"
                  value={formData.meeting_link}
                  onChange={handleChange}
                  className="w-[300px] mr-4 ml-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={formData.location_type === "online"}
                  maxLength={200}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-secondary text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50"
            >
              {isPending ? "Creating..." : "Create Meeting"}
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Meetings;
