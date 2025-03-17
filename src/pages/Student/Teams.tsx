import { useTeams } from "@/hooks/teams";
import React from "react";
const Teams = () => {
  const { data } = useTeams();
  console.log(data);
  return (
    <div className=" ml-[17%] h-screen py-10 px-8 w-fit mr-[20%]">
      <h2 className="text-primary font-bold text-[20px] font-inter  ">
        Bienvenue dans l’espace de gestion des équipes !
      </h2>
      <p className="font-medium text-[16px] mt-2  text-[#092147]/55  ">
        Pour poursuivre votre projet de fin d’études, vous devez faire partie
        d’une équipe.
      </p>
      <p className="bg-[#D9D9D9]/27 text-[15px]  text-[#092147]/66 p-5 mt-2  font-inter font-light">
        Attention : Une fois la période de constitution des équipes terminée,
        les équipes seront figées et vous ne pourrez plus en changer sans
        validation de l’administration.
      </p>

      <div className="mt-5 w-full relative">
        <h2 className="font-semibold text-primary inline">
          Les groupes existants{" "}
        </h2>
        <button className="inline mr-0  text-right right-0 absolute bg-secondary text-white rounded-md font-instrument px-3 py-1 hover:bg-secondary/80">
          Créer un groupe
        </button>
        {data?.results && (
          <div className="grid grid-cols-3 gap-2 p-1 mt-4">
            {data.results.map((group) => (
              <div
                key={group.id}
                className="bg-accent/10 font-inter  p-4 rounded-lg  relative w-full"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[12px] bg-white rounded-xl py-1">
                    Groupe n°{group.id}
                  </span>
                  <span className="bg-white">🔒</span>
                </div>
                <h3 className="text-[14px] font-medium mt-2">{group.name}</h3>
                <div className="flex items-center justify-between mt-2 text-[#5A5A5A] text-xs">
                  <button className=" w-fit text-xs bg-secondary text-white rounded-md font-instrument px-2 py-1 hover:bg-secondary/80">
                    rejoindre le groupe
                  </button>
                  <p className=""> {group.member_count} membre</p>
                  {/* <span>👥 {group.members} Membres</span> */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Teams;
