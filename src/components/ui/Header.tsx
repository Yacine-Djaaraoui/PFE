import { Icon } from "@iconify/react";
import searchIcon from "@iconify-icons/mdi/magnify";
import calenderIcon from "../../assets/calendar-2.svg";
import { ReactSVG } from "react-svg";
import MessageQuestionIcon from "../../assets/message-question.svg";
import { useEffect, useMemo, useState } from "react";
import { useMyProfile } from "@/hooks/profile";
import { setProfile } from "@/redux/reducers/AuthReducer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useWebSocket } from "@/hooks/useWebsocket";
import Notification from "./Notification";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Filter } from "lucide-react";
import { measureMemory } from "vm";
import useDebounce from "@/hooks/useDebounce";
import Teams from "@/pages/Student/Teams";
import { useTeams } from "@/hooks/teams";
import { setSearchResult } from "@/redux/reducers/SearchReducer";
import { useLocation, useParams } from "react-router-dom";
import { useStudents } from "@/hooks/useStudents";
const Header = () => {
  const { messages } = useWebSocket();
  const [searchQuery, setSearchQuery] = useState<string>("");

  console.log("new notifications ", messages);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [messages]);
  const toggleNotifications = () => {
    setIsOpen(true);
  };
  const DebouncerSearchTerm = useDebounce(searchQuery, 1000);

  const { isTeamsPage, isStudentsPage } = useMemo(
    () => ({
      isTeamsPage: location.pathname.includes("/mon-projet/teams"),
      isStudentsPage: location.pathname.includes("/students"),
    }),
    [location.pathname]
  );

  // Teams query - only runs when on teams page with proper params
  const {
    data: teamsData,
    error: teamsError,
    isLoading: teamsLoading,
    isError: teamsIsError,
    isFetching: teamsIsFetching,
  } = useTeams(
    useMemo(
      () => ({
        search: DebouncerSearchTerm,
        match_student_profile: true,
        is_member: false,
        ordering: "-last_name",
      }),
      [DebouncerSearchTerm]
    ),
    { enabled: isTeamsPage }
  );

  // Students query - only runs when on students page with proper params
  const {
    data: studentsData,
    error: studentsError,
    isLoading: studentsLoading,
    isError: studentsIsError,
    isFetching: studentsIsFetching,
  } = useStudents(
    useMemo(
      () => ({
        search: DebouncerSearchTerm,
        ordering: "-created_at",
        show_peers_only: true,
        page_size: 10,
        has_team: false,
      }),
      [DebouncerSearchTerm]
    ),
    { enabled: isStudentsPage }
  );

  // Determine which data to use based on current path
  const searchResult = isTeamsPage ? teamsData : studentsData;
  const searchResultError = isTeamsPage ? teamsError : studentsError;
  const searchResultLoading = isTeamsPage ? teamsLoading : studentsLoading;
  const searchResultIsError = isTeamsPage ? teamsIsError : studentsIsError;
  const searchResultIsFetching = isTeamsPage
    ? teamsIsFetching
    : studentsIsFetching;

  // Dispatch results to Redux only when on relevant pages
  useEffect(() => {
    if (isTeamsPage || isStudentsPage) {
      dispatch(
        setSearchResult({
          searchResult,
          searchResultError,
          searchResultLoading,
          searchResultIsError,
          searchResultIsFetching,
          searchTerm: DebouncerSearchTerm,
        })
      );
    }
  }, [
    searchResult,
    searchResultError,
    searchResultLoading,
    searchResultIsError,
    searchResultIsFetching,
    isTeamsPage,
    isStudentsPage,
    dispatch,
  ]);

  return (
    <header className="flex items-center justify-between h-11 mt-7 mb-4 bg-white ">
      {/* Search Input */}
      <div className="relative w-[56%] bg-[#DBDBDB] ml-7 h-full rounded-md flex items-center pl-12">
        <span className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
          <Icon icon={searchIcon} className="text-gray-500 w-8 h-8" />
        </span>
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          type="text"
          placeholder="Recherchez une tâche, un projet ou une échéance..."
          className="pr-4 py-2 bg-transparent w-full text-gray-700 focus:outline-none"
        />
      </div>

      {/* Icons and User Info */}
      <div className="w-[44%] flex items-center justify-between">
        {/* Icons */}
        <div className="flex  items-center gap-4 text-[#787486] ml-8">
          <button aria-label="Calendar" className="hover:text-gray-700">
            <ReactSVG src={calenderIcon} className="w-6 h-6" />
          </button>
          <button aria-label="Help" className="hover:text-gray-700">
            <ReactSVG src={MessageQuestionIcon} className="w-6 h-6" />
          </button>
          <Sheet>
            <SheetTrigger asChild>
              <button
                onClick={toggleNotifications}
                aria-label="Notifications"
                className="relative hover:text-gray-700  text-[#787486] "
              >
                <Icon
                  icon="mdi:notifications-none"
                  width="26"
                  height="26"
                  className=" text-[#787486] hover:text-gray-700 cursor-pointer"
                />
                {messages?.filter((msg) => msg.type === "notification").length >
                  0 &&
                  !isOpen && (
                    <span className="absolute top-0 right-0 w-3 h-3 bg-[#D8727D] rounded-full"></span>
                  )}
              </button>
            </SheetTrigger>
            <SheetContent className="p-5 pt-3 h-fit">
              <SheetTitle className="text-[#1E293B] mb-5  font-inter text-xl">
                Notifications
              </SheetTitle>

              <Notification />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
