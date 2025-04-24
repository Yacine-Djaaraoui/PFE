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
import { NavLink, useLocation, useParams } from "react-router-dom";
import { useStudents } from "@/hooks/useStudents";
import { useThemes } from "@/hooks/themes";
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

  const { isTeamsPage, isStudentsPage, isThemePage } = useMemo(
    () => ({
      isTeamsPage: location.pathname.includes("/mon-projet/teams"),
      isStudentsPage: location.pathname.includes("/students"),
      isThemePage: location.pathname.includes("/mon-projet/themes"),
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
  // themes page
  const {
    data: themesData,
    error: themesError,
    isLoading: themesLoading,
    isError: themesIsError,
    isFetching: themesIsFetching,
  } = useThemes(
    useMemo(
      () => ({
        search: DebouncerSearchTerm,
        ordering: "-created_at",
        page_size: 10,
      }),
      [DebouncerSearchTerm]
    ),
    { enabled: isThemePage }
  );

  // Determine which data to use based on current path
  const searchResult = isTeamsPage
    ? teamsData
    : isStudentsPage
    ? studentsData
    : themesData;
  const searchResultError = isTeamsPage
    ? teamsError
    : isStudentsPage
    ? studentsError
    : themesError;
  const searchResultLoading = isTeamsPage
    ? teamsLoading
    : isStudentsPage
    ? studentsLoading
    : themesLoading;
  const searchResultIsError = isTeamsPage
    ? teamsIsError
    : isStudentsPage
    ? studentsIsError
    : themesIsError;
  const searchResultIsFetching = isTeamsPage
    ? teamsIsFetching
    : isStudentsPage
    ? studentsIsFetching
    : themesIsFetching;

  // Dispatch results to Redux only when on relevant pages
  useEffect(() => {
    if (isTeamsPage || isStudentsPage || isThemePage) {
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
    isThemePage,
    dispatch,
  ]);
  const profile = useSelector((state: RootState) => state.auth.profile);

  return (
    <header className="flex items-center justify-between h-20 pt-7 mb-4 bg-white fixed w-[83%] pr-9 mt-0">
      {/* Search Input */}
      <div className="w-[60%] flex items-center justify-between">
        <div className="relative w-[85%] bg-[#DBDBDB] ml-7 h-11 rounded-md flex items-center pl-12">
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
        <div className="flex items-center justify-between">
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
                  {messages?.filter((msg) => msg.type === "notification")
                    .length > 0 &&
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
      </div>
      <NavLink to="/profile" className={`w-fit`}>
        <div className="flex cursor-pointer items-center gap-2 mb-6">
          <div className="flex flex-col items-end space-y-0">
            <p className="text-[#0D062D] text-[16px] font-medium">
              {profile?.first_name + " " + profile?.last_name}
            </p>
            <p className="text-[#787486] text-[16px]">Constantine, Algeria</p>
          </div>
          <div className="w-12 h-12 rounded-xl overflow-hidden">
            <img
              src={profile?.profile_picture_url}
              alt="User"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>
      </NavLink>
    </header>
  );
};

export default Header;
