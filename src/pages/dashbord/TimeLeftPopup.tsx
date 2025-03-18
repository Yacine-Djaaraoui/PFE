import React from "react";

interface TimeLeftPopupProps {
  timeLeft: { days: number; hours: number; minutes: number };
  onClose: () => void;
}

const TimeLeftPopup: React.FC<TimeLeftPopupProps> = ({ timeLeft, onClose }) => {
  return (
    <>
      {/* Semi-transparent overlay */}
      <div className="fixed inset-0 bg-gray-100 opacity-60 z-40"></div>

      {/* Popup */}
      <div className="fixed inset-0 flex items-center justify-center z-50 font-roboto">
        <div className="bg-secondary text-white h-[521px] w-[954px] pt-12 rounded-lg shadow-lg text-center">
          <p className="text-4xl font-extrabold mb-3">🚧Phase non encore ouverte</p>
          <p className="font-medium text-xl mb-4">
            Cette phase ne peut pas être accédée pour le moment.
          </p>
          <div className="flex justify-center space-x-32 my-20">
            <div>
              <span className="text-9xl font-bold">{timeLeft.days}</span>
              <span className="block text-3xl">DAYS</span>
            </div>
            <div>
              <span className="text-9xl font-bold">{timeLeft.hours}</span>
              <span className="block text-3xl">HOURS</span>
            </div>
            <div>
              <span className="text-9xl font-bold">{timeLeft.minutes}</span>
              <span className="block text-3xl">MINUTES</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-primary text-white px-4 py-2 rounded-md hover:opacity-80"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    </>
  );
};

export default TimeLeftPopup;