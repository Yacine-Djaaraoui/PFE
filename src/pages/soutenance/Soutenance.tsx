import Wrapper from "@/hoc/Wrapper";
import React from "react";
import Meetings from "./Meetings";
import SoutenanceDate from "./SoutenanceDate";

const Soutenance = () => {
  return (
    <div className=" h-screen py-10 pl-8 w-full  ">
      <h2 className="text-primaryTitle font-bold text-[20px] font-inter">
        Bienvenue dans l’espace du soutenance !{" "}
      </h2>
      <p className="font-medium text-[16px] mt-2 text-[#092147]/55">
        Gérez efficacement les soutenances grâce à un espace dédié. Consultez le
        calendrier des présentations, évaluez les projets en attribuant des
        notes et déposez les procès-verbaux en toute simplicité.
      </p>
      {/* <p className="bg-[#D9D9D9]/27 text-[15px] text-[#092147]/66 p-5 mt-2 font-inter font-light">
        Attention : Une fois la période de constitution des équipes terminée,
        les équipes seront figées et vous ne pourrez plus en changer sans
        validation de l’administration.
      </p> */}
      <SoutenanceDate />
    </div>
  );
};

export default Wrapper(Soutenance);
