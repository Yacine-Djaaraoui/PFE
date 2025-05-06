import Wrapper from "@/hoc/Wrapper";
import Timeline from "./TimeLine";
import Sidebar from "../home/sidebar";
import Header from "@/components/ui/Header";
import WrapperByHeaderOnly from "@/hoc/WrapperByHeaderOnly";
import MeetingsDashboard from "./MeetingsDashboard";

const Dashboard = () => {
  return (
    <>
      <Timeline />
      <MeetingsDashboard />
    </>
  );
};

export default WrapperByHeaderOnly(Dashboard);
