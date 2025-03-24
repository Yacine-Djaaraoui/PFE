import Wrapper from "@/hoc/Wrapper";

const Themes = () => {
  return (
    <div className=" h-screen py-10 pl-8 w-fit ">
      <h2 className="text-primaryTitle font-bold text-[20px] font-inter">
        Bienvenue dans l’espace de choix des thèmes de PFE !
      </h2>
      <p className="font-medium text-[16px] mt-2 text-[#092147]/55">
        vous devez consulter les thèmes proposés par les enseignants et les
        partenaires de l’école, puis soumettre votre fiche de vœux en classant
        vos préférences.
      </p>
      <p className="bg-[#D9D9D9]/27 text-[15px] text-[#092147]/66 p-5 mt-2 font-inter font-light">
        Attention :️ Une fois votre fiche de vœux soumise, vous ne pourrez plus
        la modifier sans validation de l’administration.
      </p>

      <div className="mt-5 w-full relative">
        <h2 className="font-semibold text-primaryTitle inline">
          Liste des thèmes disponibles{" "}
        </h2>
      </div>
    </div>
  );
};

export default Themes;
