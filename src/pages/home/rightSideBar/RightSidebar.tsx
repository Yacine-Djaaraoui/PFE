import { useTeams } from "@/hooks/teams";
import { useGetMembers } from "@/hooks/useGetMembers";
import { RootState } from "@/redux/store";
import React, { useEffect, useState } from "react";
import { FaPen } from "react-icons/fa";
import { useSelector } from "react-redux";

import { useDeleteTeam } from "@/hooks/useDeleteTeam";
import { useCancelRequest } from "@/api/myRequests";
import { useMyRequests } from "@/hooks/useRequests";
import { NavLink, useNavigate } from "react-router-dom";
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
import Mytheme from "./Mytheme";
import MyTeams from "./MyTeams";

const RightSidebar = () => {
  const profile = useSelector((state: RootState) => state.auth.profile);
  return (
    <div className="bg- w-[20%]  flex py-5 flex-col items-center gap-4 h-screen mt-20 mr-0 fixed right-0 ">
      {/* User Info */}

      {/* Themes Section */}
      {(profile?.user_type === "teacher" ||
        profile?.user_type === "external") && (
        <>
          <ThemesSection profile={profile} />
          <MyTeams />
        </>
      )}

      {profile?.user_type === "student" && <MyTeam />}
      {profile?.user_type === "student" && <Mytheme />}
      {profile?.user_type === "student" && <MyRequests />}
      {profile?.user_type === "student" && <MySupervisorRequests />}
    </div>
  );
};

export default RightSidebar;
