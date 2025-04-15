import { useTeams } from "@/hooks/teams";
import { useGetMembers } from "@/hooks/useGetMembers";
import { RootState } from "@/redux/store";
import React, { useEffect, useState } from "react";
import { FaPen } from "react-icons/fa";
import { useSelector } from "react-redux";

import { useDeleteTeam } from "@/hooks/useDeleteTeam";
import { useCancelRequest } from "@/api/myRequests";
import { useMyRequests } from "@/hooks/useRequests";
import { useNavigate } from "react-router-dom";
import { ThemesSection } from "./ThemesSection";
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
import MyTeam from "./MyTeam";
import MyRequests from "./MyRequests";
import MySupervisorRequests from "./MySupervisorRequest";

const RightSidebar = () => {
  const profile = useSelector((state: RootState) => state.auth.profile);
  console.log(profile);
  return (
    <div className="bg-white w-[20%] flex py-5 flex-col items-center gap-4 h-screen    mr-0 ">
      {/* User Info */}
      <div className="flex items-center gap-2 mb-6">
        <div className="flex flex-col items-end space-y-0">
          <p className="text-[#0D062D] text-[16px] font-medium">
            {profile?.first_name + " " + profile?.last_name}
          </p>
          <p className="text-[#787486] text-[16px]">Constantine, Algeria</p>
        </div>
        <div className="w-12 h-12 rounded-xl overflow-hidden">
          <img
            src={profile?.profile_picture_url}
            alt="User"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      </div>
      {/* Themes Section */}
      {profile?.user_type === "teacher" && <ThemesSection profile={profile} />}

      {profile?.user_type === "student" && <MyTeam />}
      {profile?.user_type === "student" && <MyRequests />}
      {profile?.user_type === "student" && <MySupervisorRequests />}
    </div>
  );
};

export default RightSidebar;
