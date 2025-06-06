import ProfileCard from "./profileCard";
import SettingCard from "./settingCard";
import WrapperByHeaderOnly from "@/hoc/WrapperByHeaderOnly";

const Settings = () => {

  return (
    <div className="flex">

      <ProfileCard />
      <SettingCard />
    </div>
  );
};

export default WrapperByHeaderOnly(Settings);
