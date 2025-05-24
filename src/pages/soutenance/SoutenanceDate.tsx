import { useMemo, useState } from "react";
import {
  useCreateMeeting,
  useMeetings,
  useSoutenance,
} from "@/hooks/useMeetings";
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
const SoutenanceDate = () => {
  const [isAddThemeOpen, setIsAddThemeOpen] = useState(false);

  const {
    data: Meetings,
    error: getMeeginsError,
    isLoading: getError,
    isError: getIsError,
    isFetching: getIsFetching,
  } = useSoutenance({
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

    // Get date components (YYYY-MM-DD)
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const date = `${year}-${month}-${day}`;

    // Get time components (HH:MM)
    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    const time = `${hours}:${minutes}`;

    return { date, time };
  };
  const getFormattedDayMonth = (dateTimeString: string) => {
    const date = new Date(dateTimeString);

    // Check if the date is valid
    // if (isNaN(date.getTime())) {
    //   throw new Error("Invalid date string");
    // }

    // Array of month abbreviations
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

    const day = date.getDate(); // Get day of the month (1-31)
    const monthIndex = date.getMonth(); // Get month index (0-11)
    const monthName = monthNames[monthIndex]; // Get month abbreviation

    return { day, monthName }; // Returns format like "30 Apr"
  };
  const profile = useSelector((state: RootState) => state.auth.profile);
  const formatMeetingDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);

    // Month abbreviations in French
    const monthAbbreviations = [
      "Jan",
      "Fév",
      "Mar",
      "Avr",
      "Mai",
      "Juin",
      "Juil",
      "Août",
      "Sep",
      "Oct",
      "Nov",
      "Déc",
    ];

    const day = date.getDate();
    const monthIndex = date.getMonth();
    const monthAbbr = monthAbbreviations[monthIndex];
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return {
      dateDisplay: `${day} ${monthAbbr}`,
      timeDisplay: `${hours}:${minutes}`,
    };
  };

  // Function to get the appropriate icon based on meeting title
  const getMeetingIcon = (title: string) => {
    if (
      title.toLowerCase().includes("rendu") ||
      title.toLowerCase().includes("soumettre")
    ) {
      return "🔔";
    } else if (
      title.toLowerCase().includes("réunion") ||
      title.toLowerCase().includes("encadrant")
    ) {
      return "🔔";
    } else if (
      title.toLowerCase().includes("annonce") ||
      title.toLowerCase().includes("soutenance")
    ) {
      return "🔔";
    }
    return "🔔"; // Default icon
  };
  return (
    <>
      <div className=" mt-10">
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
            (meeting: any) => meeting.status === "scheduled"
          ).length > 0 && (
            <div className=" rounded-[8px] p-[22px] border flex items-start relative  justify-start gap-8 border-[#E3E6EA] ">
              <div className="w-[80px]   h-[80px] rounded-[32px] flex flex-col  ">
                <p className="w-full h-[30%] rounded-t-[8px] text-white bg-secondary text-md text-center flex items-center justify-center p-1">
                  {
                    getFormattedDayMonth(
                      Meetings?.results?.filter(
                        (meeting: any) => meeting.status === "scheduled"
                      )[0]?.date
                    ).monthName
                  }
                </p>
                <p className="w-full  text-black  text-lg text-center flex items-center justify-center pt-3  ">
                  {
                    getFormattedDayMonth(
                      Meetings?.results?.filter(
                        (meeting: any) => meeting.status === "scheduled"
                      )[0]?.date
                    ).day
                  }
                </p>
                <p className="text-xs font-medium text-gray-500 text-center shadow pb-1">
                  {
                    Meetings?.results?.filter(
                      (meeting: any) => meeting.status === "scheduled"
                    )[0]?.start_time
                  }
                </p>
              </div>
              <div>
                <h2 className="font-inter text-[16px] font-medium">
                  prochaine soutenance{" "}
                  {" (" +
                    Meetings?.results?.filter(
                      (meeting: any) => meeting.status === "scheduled"
                    )[0]?.title +
                    ")"}
                </h2>
                <p className="font-inter text-[14px] text-[#666F8D] mt-2 ">
                  {" Présentation du groupe N°"}
                  {
                    Meetings?.results?.filter(
                      (meeting: any) => meeting.status === "scheduled"
                    )[0]?.theme_assignment
                  }{" "}
                  {"à "}
                  {
                    Meetings?.results?.filter(
                      (meeting: any) => meeting.status === "scheduled"
                    )[0]?.location
                  }
                  {". "}
                  Soyez présent(e) au moins 15 minutes avant l’heure indiquée.
                </p>
              </div>
              {/* {profile?.user_type === "teacher" && (
              <button
                className=" hover:bg-gray-300 absolute right-5 top-5"
                onClick={() => setIsAddThemeOpen(true)}
              >
                <ReactSVG src={plus} className="w-5 h-5" />
              </button>
            )} */}
            </div>
          )}
        {/* {Meetings?.results?.filter(
        (meeting: any) => meeting.status === "scheduled"
      ).length === 0 &&
        profile?.user_type === "teacher" && (
          <div className="flex items-center gap-2 text-gray-700">
            <span> Ajouter un réunion</span>
            <button
              className=" hover:bg-gray-300  right-5 top-5"
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
            <div className="mb-4 flex items-start  ">
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

            <div className="mb-4 flex items-start  ">
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

            <div className="mb-4 flex items-start  ">
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
            <div className="mb-4 flex items-start  ">
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

            <div className="mb-4 flex items-start  ">
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

            <div className="mb-4 flex items-start  ">
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
              <div className="mb-4 flex items-start  ">
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
              <div className="mb-4 flex items-start  ">
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
              className="w-full bg-secondary text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2  focus:ring-offset-2 disabled:opacity-50"
            >
              {isPending ? "Creating..." : "Create Meeting"}
            </button>
          </form>
        </DialogContent>
      </Dialog> */}
      </div>
      {profile?.user_type === "teacher" && (
        <div className=" w-full mt-8 ">
          {Meetings?.results?.length > 0 && (
            <h2 className="text-black font-medium mb-3 text-xl">
              Mes soutenances
            </h2>
          )}
          {Meetings?.results
            ?.filter((meeting: any) => meeting.status === "scheduled") // Filter only scheduled meetings
            ?.slice(0, 3) // Take first 3 scheduled meetings
            ?.map((meeting: any) => {
              const { dateDisplay, timeDisplay } = formatMeetingDateTime(
                meeting.date
              );
              const icon = getMeetingIcon(meeting.title);

              return (
                <div key={meeting.id} className=" rounded overflow-hidden ">
                  <div className="flex items-center mb-3 ">
                    {/* Date/Time column */}
                    <div className="flex flex-col items-start w-16 ">
                      <div className="text-sm font-medium text-gray-900 w-full">
                        {dateDisplay}
                      </div>
                      <div className="text-xs font-medium text-gray-500">
                        {
                          Meetings?.results?.filter(
                            (meeting: any) => meeting.status === "scheduled"
                          )[0]?.start_time
                        }
                      </div>
                    </div>

                    {/* Meeting title with icon */}
                    <div className="  flex items-center w-[70%] rounded-md justify-between py-5 px-4  bg-[#F6F6F5]">
                      <div className="flex-1 ">
                        <div className="flex items-center">
                          <span className="mr-2">{icon}</span>
                          <span className="text-md text-black ">
                            {" Présentation du groupe N°"}
                            {meeting.theme_assignment} {"à "}
                            {meeting.location}
                          </span>
                        </div>
                      </div>
                      {/* Checkbox/Completed status */}

                      <div className="ml-2">
                        <div className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center bg-white">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-gray-500"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </>
  );
};

export default SoutenanceDate;
