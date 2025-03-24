import Sidebar from "../home/sidebar";
import Header from "@/components/ui/Header";
import ProfileCard from "./profileCard";
import SettingCard from "./settingCard";

const Settings = () => {
  return (
    <div className="flex justify-start items-start ">
      <Sidebar />
      <div className="ml-[17%] w-full">
        <Header />
        <div className="flex">
          <ProfileCard />
          <SettingCard />
        </div>
      </div>
    </div>
  );
};

export default Settings;
