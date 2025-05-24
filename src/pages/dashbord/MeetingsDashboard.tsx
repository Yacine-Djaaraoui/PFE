import { useMeetings } from "@/hooks/useMeetings";
import React from "react";
import { FaBell, FaRegBell } from "react-icons/fa";
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
import { useCanceMetting } from "@/api/meetings";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
interface teamIdProps {
  teamId: number;
}
const MeetingsDashboard = ({ teamId }: teamIdProps) => {
  const cancelMeeting = useCanceMetting();
  const profile = useSelector((state: RootState) => state.auth.profile);

  const {
    data: Meetings,
    error: getMeetingsError,
    isLoading: MeetingLoading,
    isError: getIsError,
    isFetching: getIsFetching,
  } = useMeetings({
    ordering: "created_at",
  });

  // Function to format date and time
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

  if (MeetingLoading) return <div>Loading meetings...</div>;
  if (getIsError) return <div>Error loading meetings</div>;

  return (
    <div className=" w-full left-0 right-auto px-12">
      {Meetings?.results
        ?.filter((meeting: any) => meeting.status === "scheduled") // Filter only scheduled meetings
        ?.slice(0, 3) // Take first 3 scheduled meetings
        ?.map((meeting: any) => {
          const { dateDisplay, timeDisplay } = formatMeetingDateTime(
            meeting.scheduled_at
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
                    {timeDisplay}
                  </div>
                </div>

                {/* Meeting title with icon */}
                <div className="  flex items-center w-[70%] rounded-md justify-between py-5 px-4  bg-[#F6F6F5]">
                  <div className="flex-1 ">
                    <div className="flex items-center">
                      <span className="mr-2">{icon}</span>
                      <span className="text-md text-black ">
                        {meeting.title} {meeting.description}
                        {profile?.user_type === "teacher" &&
                          `( groupe N°${meeting.team})`}
                      </span>
                    </div>
                  </div>
                  {/* Checkbox/Completed status */}
                  {profile?.user_type === "teacher" && (
                    <AlertDialog>
                      {}
                      <AlertDialogTrigger asChild>
                        <button className="  cursor-pointer   bg-secondary text-white rounded-[3px] font-instrument px-2 py-1 hover:bg-secondary/80">
                          Cancel
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle> Cancel ce runion</AlertDialogTitle>
                          <AlertDialogDescription>
                            {/* Une fois inscrit, vous devrez demander à l’administration pour
                                                      changer de groupe. */}
                            {/* <label className="font-medium block mt-2 mb-2">
                                            Ajouter un message a l'equipe
                                          </label>
                                          <input
                                            type="text"
                                            value={message}
                                            onChange={handleChange}
                                            className="border block border-gray-300 rounded-lg mb-3 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder={`message`}
                                          /> */}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="hover:bg-secondary cursor-pointer hover:text-white">
                            Annuler
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => cancelMeeting.mutate(meeting.id)}
                          >
                            Cancel Meeting
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
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
  );
};

export default MeetingsDashboard;
