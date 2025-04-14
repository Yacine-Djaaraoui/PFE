import Wrapper from "@/hoc/Wrapper";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Teams from "../Student/Teams";
import Themes from "../Student/Themes";

const MonProjet = () => {
  const { idof } = useParams<{ idof: string }>();
  const navigate = useNavigate();
  if (idof === "teams") return <Teams />;
  if (idof === "themes") return <Themes />;
  navigate("/dashboard");
};

export default Wrapper(MonProjet);
