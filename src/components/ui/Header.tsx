import { Icon } from "@iconify/react";
import searchIcon from "@iconify-icons/mdi/magnify";
import calenderIcon from "../../assets/calendar-2.svg";
import { ReactSVG } from "react-svg";
import MessageQuestionIcon from "../../assets/message-question.svg";
import { useEffect } from "react";
import { useMyProfile } from "@/hooks/profile";
import { setProfile } from "@/redux/reducers/AuthReducer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store"; 

const Header = () => {
  const { data, error: profileError } = useMyProfile();
  const dispatch = useDispatch();
  const profile = useSelector((state: RootState) => state.auth.profile);
  const isLoggedIn = !!localStorage.getItem("refresh_token");

  useEffect(() => {
    if (isLoggedIn && !profileError) {
      dispatch(setProfile(data));
    } else if (profileError) {
      console.log(profileError);
    }
  }, [isLoggedIn, profileError, data, dispatch]);

  return (
    <header className="flex items-center justify-between h-11 mt-7 mb-4 bg-white">
      {/* Search Input */}
      <div className="relative w-[56%] bg-[#DBDBDB] ml-7 h-full rounded-md flex items-center pl-12">
        <span className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
          <Icon icon={searchIcon} className="text-gray-500 w-8 h-8" />
        </span>
        <input
          type="text"
          placeholder="Recherchez une tâche, un projet ou une échéance..."
          className="pr-4 py-2 bg-transparent w-full text-gray-700 focus:outline-none"
        />
      </div>

      {/* Icons and User Info */}
      <div className="w-[44%] flex items-center justify-between">
        {/* Icons */}
        <div className="flex items-center gap-4 text-[#787486] ml-8">
          <button aria-label="Calendar" className="hover:text-gray-700">
            <ReactSVG src={calenderIcon} className="w-6 h-6" />
          </button>
          <button aria-label="Help" className="hover:text-gray-700">
            <ReactSVG src={MessageQuestionIcon} className="w-6 h-6" />
          </button>
          <button
            aria-label="Notifications"
            className="relative hover:text-gray-700"
          >
            <Icon icon="mdi:notifications-none" width="24" height="24" />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#D8727D] rounded-full"></span>
          </button>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-2 mr-11">
          <div className="flex flex-col items-end space-y-0">
            <p className="text-[#0D062D] text-[16px] font-medium">
              {profile?.first_name + " " + profile?.last_name}
            </p>
            <p className="text-[#787486] text-[16px]">Constantine, Algeria</p>
          </div>
          <div className="w-12 h-12 rounded-xl overflow-hidden">
            <img
              src="../../../src/assets/logowithouttitle.png"
              alt="User"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
