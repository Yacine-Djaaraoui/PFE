import Header from "@/components/ui/Header";
import Wrapper from "@/hoc/Wrapper";
import Timeline from "./TimeLine";
import Sidebar from "../home/sidebar";

const Dashboard = () => {
  return (
    <>
      <Sidebar />

      <div className="ml-[17%]">
        <Header />
        <Timeline />
      </div>
    </>
  );
};

export default Dashboard;
