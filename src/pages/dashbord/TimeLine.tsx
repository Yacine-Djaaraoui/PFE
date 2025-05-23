import React, { useState } from "react";
import { useTimeLine, useTimeLines } from "@/hooks/timeLine"; // Adjust the import path
import TimeLeftPopup from "./TimeLeftPopup";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface Timeline {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
}

interface CardProps {
  startDate: string;
  endDate :string;
  title: string;
  description: string;
  isOpen: boolean;
  start_date: string;
}

const InfoCard: React.FC<CardProps> = ({
  startDate,
  endDate,
  title,
  description,
  isOpen,
  start_date,
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
  });
  const navigte = useNavigate();
  const handleClick = () => {
    const now = new Date();
    const startDate = new Date(start_date);

    if (now < startDate) {
      const diff = startDate.getTime() - now.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        .toString()
        .padStart(2, "0");
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      )
        .toString()
        .padStart(2, "0");
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        .toString()
        .padStart(2, "0");

      setTimeLeft({ days, hours, minutes });
      setShowPopup(true);
    } else {
      navigte("/mon-projet/teams");
    }
  };

  return (
    <>
      <div
        className="w-1/4 hover:bg-gray-100 hover:cursor-pointer"
        onClick={handleClick}
      >
        <div
          className={`relative w-full h-1.5 mb-7 bg-[#19488E] before:content-[''] before:absolute before:top-0 before:-translate-y-1/2 before:-left-0.5 before:h-7 before:w-7 before:border-[6px] before:border-[#19488E] before:rounded-full ${
            isOpen ? "before:bg-[#19488E]" : "before:bg-white"
          }`}
        ></div>
        <p className="text-[#19488E] font-bold text-[16px] pb-5 pl-2">
          {startDate + " ---> " +  endDate}
          
        </p>
        <p className="font-semibold text-[#092147] text-[18px] pl-2">{title}</p>
        <p className="text-[#092147] text-[15px] pr-[40%] pl-2">
          -{description}
        </p>
      </div>

      {showPopup && (
        <TimeLeftPopup
          timeLeft={timeLeft}
          onClose={() => setShowPopup(false)}
        />
      )}
    </>
  );
};

const AcademicLevelSelector = ({ onSelect }: { onSelect: (academicYear: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("2ème année CP");
  
  const academicLevels = [
    { label: "2ème année CP", value: "2" },
    { label: "1ère année CS", value: "3" },
    { label: "2ème année CS ISI", value: "4isi" },
    { label: "2ème année CS IASD", value: "4iasd" },
    { label: "2ème année CS SIW", value: "4siw" },
    { label: "3ème année CS ISI", value: "5isi" },
    { label: "3ème année CS IASD", value: "5iasd" },
    { label: "3ème année CS SIW", value: "5siw" }
  ];

  return (
    <div className="relative mt-12 w-64">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 text-white text-left bg-secondary border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#19488E]"
      >
        <span>{selectedLevel}</span>
        <svg
          className={`w-5 h-5 transition-transform ${isOpen ? "transform rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          {academicLevels.map((level, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedLevel(level.label);
                setIsOpen(false);
                onSelect(level.value);
              }}
              className={`block w-full px-4 py-2 text-left ${
                selectedLevel === level.label ? "bg-[#19488E] text-white" : ""
              }`}
            >
              {level.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const TimeLine = () => {
  const [academicYear, setAcademicYear] = useState<string>("2"); // Default to 2ème année CP
  const { data: timelineData, isLoading, isError, error } = useTimeLine();
  const { data: timeline, isLoading: isLoadingA, isError: isErrorA, error: errorA } = useTimeLines(academicYear);

  const profile = useSelector((state: RootState) => state.auth.profile);
  const userType = profile?.user_type;

  const SelectedTimeLine = userType === "student" ? timelineData : timeline;


  const cards = SelectedTimeLine?.results?.map((timeline: Timeline) => ({
    startDate: new Date(timeline.start_date).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    endDate: new Date(timeline?.end_date).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    title: timeline.name,
    description: timeline.description,
    isOpen: timeline.is_current,
    start_date: timeline.start_date,
  }));

  return (
    <section className="bg-white pb-10 pt-5 ml-7 mr-7 font-roboto ">
      <div className="flex pb-7">
        <div className="text-start w-2/3">
          <p className="text-3xl md:text-[32px] font-semibold text-[#01050B]">
            Suivez l'évolution de votre projet PFE
          </p>
          <p className="text-[#092147] font-normal text-[17px] pt-1">
            Notre plateforme vous permet de structurer votre projet, suivre son
            avancement et collaborer efficacement{" "}
            <br className="hidden md:block" /> avec votre encadrant et votre
            équipe.
          </p>
          {userType === "student" ? "" : 
            <AcademicLevelSelector onSelect={(value) => setAcademicYear(value)} />
          }
        </div>
        <img
          src="../../../src/assets/timeLinePic.png"
          alt="timeLine picture"
          className="mx-auto"
        />
      </div>

      {/* Timeline Section with Loading and Error States */}
      <div className="flex justify-center mt-2">
        {(isLoading && userType === "student") || (userType !== "student" && isLoadingA) ? (
          <div>Loading timeline...</div>
        ) : (isError && userType === "student") || (userType !== "student" && isErrorA) ? (
          <div className="text-red-500">
            error
          </div>
        ) : (
          cards?.map((card: CardProps, index: number) => (
            <InfoCard
              key={index}
              startDate={card.startDate}
              endDate={card.endDate}
              title={card.title}
              description={card.description}
              isOpen={card.isOpen}
              start_date={card.start_date}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default TimeLine;
