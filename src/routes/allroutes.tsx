import Colleuges from "@/pages/Colleuges/Colleuges";
import Dashboard from "@/pages/dashbord/Dashboard";
import Help from "@/pages/help/Help";
import Home from "@/pages/home/Home";
import Login from "@/pages/login/Login";
import Messagerie from "@/pages/Travail/Travail";
import MonProjet from "@/pages/Mon-projet/MonProjet";
import Profile from "@/pages/Profile/Profile";
import Settings from "@/pages/settings/Settings";
import StudentsList from "@/pages/Student/StudentsList";
import Travail from "@/pages/Travail/Travail";
import WebSocket from "@/pages/home/reseauxProject/WebSocket";

interface RouteConfig {
  path: string;
  element: React.ReactNode;
  children?: RouteConfig[];
}

export const pferoutes: RouteConfig[] = [
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/profile", element: <Profile /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/colleagues", element: <Colleuges /> },
  { path: "/travail", element: <Travail /> },
  { path: "/mon-projet/:idof", element: <MonProjet /> },
  { path: "/help", element: <Help /> },
  { path: "/settings", element: <Settings /> },
  { path: "/students", element: <StudentsList /> },
  { path: "/websocket", element: <WebSocket /> },
];
