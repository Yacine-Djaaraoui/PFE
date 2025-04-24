import Wrapper from "@/hoc/Wrapper";
import Timeline from "./TimeLine";
import Sidebar from "../home/sidebar";
import Header from "@/components/ui/Header";
import WrapperByHeaderOnly from "@/hoc/WrapperByHeaderOnly";

const Dashboard = () => {
  return <Timeline />;
};

export default WrapperByHeaderOnly(Dashboard);
