import Wrapper from "@/hoc/Wrapper";
import { useParams } from "react-router-dom";
import Teams from "../Student/Teams";
import Themes from "../Student/Themes";

const MonProjet = () => {
  const { idof } = useParams<{ idof: string }>();
  if (idof === "teams") return <Teams />;
  if (idof === "themes") return <Themes />;


};

export default Wrapper(MonProjet);
