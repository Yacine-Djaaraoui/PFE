import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useMyRequests } from "@/hooks/useRequests";
import editSquare from "@/assets/Edit-Square.svg";

import { useNavigate } from "react-router-dom";
import { useCancelRequest } from "@/api/myRequests";
import { FaChevronDown, FaChevronUp, FaPen, FaPencilAlt } from "react-icons/fa";
import { ReactSVG } from "react-svg";
const MyRequests = () => {
  const { data: requests } = useMyRequests();
  const [openrequests, setopenrequests] = useState(false);

  const cancelRequest = useCancelRequest();
  return (
    <>
      {requests?.results?.length > 0 && (
        <div className="flex cursor-pointer justify-between items-center mb-1">
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => setopenrequests((prev) => !prev)}
          >
            <ReactSVG src={editSquare} className="w-5 h-5" />
            <h2 className="text-[16px] font-medium text-[#092147] border-b border-black">
              Mon Requets
            </h2>
            {openrequests ? (
              <FaChevronUp className="text-gray-600 text-sm" />
            ) : (
              <FaChevronDown className="text-gray-600 text-sm" />
            )}
            {/* Chevron icon that rotates based on state */}
          </div>
        </div>
        //     <div
        //       className="flex items-center gap-2 font-medium text-lg underline cursor-pointer "
        //       onClick={() => setopenrequests((prev) => !prev)}
        //     >
        //       <FaPen className="text-sm" />
        //       <h2>Mon requets</h2>
        //     </div>
      )}
      {openrequests && (
        <ul className="space-y-2">
          {requests?.results?.map((request: any) => (
            <li
              className="bg-white shadow-md rounded-xl p-4 w-[90%] mx-auto border border-[#E6E4F0] flex flex-col items-center "
              key={request.id}
            >
              <p className="text-gray-400 mb-3 ">
                {" "}
                vous avez envoyé une demande d'adhésion à{" "}
                <span className="font-bold">{request.team.name} </span>
              </p>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    disabled={cancelRequest.isPending}
                    className="ml-2 bg-red-500 text-white px-2 py-1 rounded cursor-pointer hover:bg-red-400 "
                  >
                    Annuler le demande
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle> Anuuler le demande</AlertDialogTitle>
                    <AlertDialogDescription>
                      {" "}
                      êtes-vous sûr d'annuler la demande
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="hover:bg-secondary hover:text-white">
                      Annuler
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => cancelRequest.mutate(request.id)}
                    >
                      Annuler le demande{" "}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default MyRequests;
