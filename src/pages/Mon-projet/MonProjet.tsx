import Wrapper from "@/hoc/Wrapper";
import React from "react";
import { useParams } from "react-router-dom";
import Teams from "../Student/Teams";

const MonProjet = () => {
  const { idof } = useParams<{ idof: string }>();
  if (idof === "teams") return <Teams />;
};

export default Wrapper(MonProjet);
