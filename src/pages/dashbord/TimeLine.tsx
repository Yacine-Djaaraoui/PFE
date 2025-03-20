import React, { useState } from "react";
import { useTimeLine } from "@/hooks/timeLine"; // Adjust the import path
import TimeLeftPopup from "./TimeLeftPopup";

interface Timeline {
  id: number;
  name: string;
  description: string;
  start_date: string;
  is_current: boolean;
}

interface CardProps {
  month: string;
  title: string;
  description: string;
  isOpen: boolean;
  start_date: string;
}

const InfoCard: React.FC<CardProps> = ({ month, title, description, isOpen, start_date }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: "00", hours: "00", minutes: "00" });

  const handleClick = () => {
    const now = new Date();
    const startDate = new Date(start_date);
    console.log("Now:", now);
    console.log("Start Date:", startDate);

    if (now < startDate) {
      // Calculate time left
      const diff = startDate.getTime() - now.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24)).toString().padStart(2, "0");
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, "0");
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, "0");

      setTimeLeft({ days, hours, minutes });
      setShowPopup(true);
    }
  };

  return (
    <>
      <div className="w-1/4 hover:bg-gray-100 hover:cursor-pointer" onClick={handleClick}>
        <div
          className={`relative w-full h-1.5 mb-7 bg-[#19488E] before:content-[''] before:absolute before:top-0 before:-translate-y-1/2 before:-left-0.5 before:h-8 before:w-8 before:border-[6px] before:border-[#19488E] before:rounded-full ${
            isOpen ? "before:bg-[#19488E]" : "before:bg-white"
          }`}
        ></div>
        <p className="text-[#19488E] font-bold text-[16px] pb-5 pl-2">{month}</p>
        <p className="font-semibold text-[#092147] text-[18px] pl-2">{title}</p>
        <p className="text-[#092147] text-[15px] pr-[40%] pl-2">-{description}</p>
      </div>

      {showPopup && (
        <TimeLeftPopup timeLeft={timeLeft} onClose={() => setShowPopup(false)} />
      )}
    </>
  );
};



const TimeLine = () => {
  const {
    data: timelineData,
    isLoading,
    isError,
    error
  } = useTimeLine();

  const cards = timelineData?.results?.map((timeline: Timeline) => ({
    month: new Date(timeline.start_date).toLocaleString("default", { month: "short" }),
    title: timeline.name,
    description: timeline.description,
    isOpen: timeline.is_current,
    start_date : timeline.start_date,
  }));

  return (
    <section className="bg-white py-10 ml-7 mr-7 font-roboto ">
      <div className="flex pb-7">
        <div className="text-start w-2/3">
          <p className="text-3xl md:text-[32px] font-semibold text-[#01050B]">
            Suivez l'évolution de votre projet PFE
          </p>
          <p className="text-[#092147] font-normal text-[17px] pt-3">
            Notre plateforme vous permet de structurer votre projet, suivre son
            avancement et collaborer efficacement{" "}
            <br className="hidden md:block" /> avec votre encadrant et votre
            équipe.
          </p>
          <div className="flex mt-12 space-x-4">
            <span className="px-4 py-2 h-8 w-28 bg-[#19488E] text-white rounded-md flex items-center justify-center">
              Idéation
            </span>
            <span className="px-4 py-2 h-8 w-28 bg-gray-300 rounded-md flex items-center justify-center opacity-60">
              Validation
            </span>
            <span className="px-4 py-2 h-8 w-28 bg-gray-300 rounded-md flex items-center justify-center opacity-60">
              Finalisation
            </span>
          </div>
        </div>
        <img
          src="../../../src/assets/timeLinePic.png"
          alt="timeLine picture"
          className="mx-auto"
        />
      </div>

      {/* Timeline Section with Loading and Error States */}
      <div className="flex justify-center mt-2">
        {isLoading ? (
          <div>Loading timeline...</div>
        ) : isError ? (
          <div className="text-red-500">{error}</div>
        ) : (
          cards?.map((card:CardProps, index:number) => (
            <InfoCard
              key={index}
              month={card.month}
              title={card.title}
              description={card.description}
              isOpen={card.isOpen}
              start_date={card.start_date} // Pass start_date to InfoCard
            />
          ))
        )}
      </div>
    </section>
  );
};

export default TimeLine;