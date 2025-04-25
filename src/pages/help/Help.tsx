import Wrapper from "@/hoc/Wrapper";
import Sidebar from "../home/sidebar";
import Header from "@/components/ui/Header";
import logo from "@/assets/faqIcon.png";
import WrapperByHeaderOnly from "@/hoc/WrapperByHeaderOnly";

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  return (
    <div className="grid gap-1">
      {/* Icon */}
      <img src={logo} alt="#" className="w-12" />

      {/* Content */}

      <h3 className="text-[16px] font-semibold text-[#141B34]">{question}</h3>
      <p className="text-[#141B34] text-sm font-normal">{answer}</p>
    </div>
  );
};

const faqData = [
  {
    question: "Comment créer / rejoindre une équipe ?",
    answer:
      'Allez dans l’onglet "Gestion des équipes", puis créez une équipe ou entrez un code d’invitation pour en rejoindre une.',
  },
  {
    question: "Puis-je modifier mon équipe après l’avoir créée ?",
    answer:
      "Une fois la période de formation des équipes terminée, les modifications nécessitent une validation de l’administration.",
  },
  {
    question: "Comment soumettre un livrable ?",
    answer:
      'Rendez-vous dans "Espace de Travail", cliquez sur "Déposer un livrable", puis téléchargez votre fichier avant la deadline.',
  },
  {
    question: "Comment contacter mon encadrant ?",
    answer:
      'Utilisez la messagerie intégrée dans "Espace de Travail", ou planifiez une réunion via l’onglet "Calendrier".',
  },
  {
    question: "Que se passe-t-il si je dépasse une deadline ?",
    answer:
      "Un retard peut affecter votre notation. Contactez rapidement votre encadrant pour discuter d’une éventuelle extension.",
  },
  {
    question: "Puis-je accéder aux projets des années précédentes ?",
    answer:
      'Oui, consultez la section "Projets Archivés", où vous trouverez des exemples de PFE validés par l’école.',
  },
];

const FAQSection: React.FC = () => {
  return (
    <div className="bg-[#97B2DF]/10 py-10 text-center mx-[2%] h-48 font-inter mt-4 ">
      <div className="max-w-3xl mx-auto px-4">
        <p className="text-[#092147] text-sm font-semibold">FAQs</p>
        <h2 className="text-4xl font-semibold text-secondary mt-2">
          Foire Aux Questions (FAQ)
        </h2>
        <p className="text-[#141B34] mt-4 font-normal text-[15px]">
          Retrouvez ici les réponses aux questions les plus fréquentes sur notre
          plateforme.
        </p>
      </div>
    </div>
  );
};

const FAQContact: React.FC = () => {
  return (
    <div className="bg-[#97B2DF]/10 p-6 h-28 mx-[2%] rounded-lg flex flex-col md:flex-row justify-between items-center gap-4 mt-2 mb-6">
      <div>
        <h3 className="text-lg font-semibold text-secondary">
          Vous avez encore des questions ?
        </h3>
        <p className="text-[#141B34] text-sm">
          Vous ne trouvez pas la réponse que vous cherchez ? Contactez notre
          équipe,
          <br /> nous sommes là pour vous aider !
        </p>
      </div>
      <button className="bg-secondary text-white px-4 py-2 rounded-md hover:opacity-80 transition">
        Contact
      </button>
    </div>
  );
};

const Help = () => {
  return (
    <div className="">
      <FAQSection />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-15 gap-y-8 px-28 py-6">
        {faqData.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
      <FAQContact />
    </div>
  );
};

export default WrapperByHeaderOnly(Help);
