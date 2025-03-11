import Colleuges from "@/pages/Colleuges/Colleuges";
import Dashboard from "@/pages/dashbord/Dashboard";
import Home from "@/pages/home/Home";
import PortailEnseignantLogin from "@/pages/login/PortailEnseignantLogin";
import PortailEtudiantLogin from "@/pages/login/PortailEtudiantLogin";
import PortailPartenaireLogin from "@/pages/login/PortailPartenaireLogin";
import Messagerie from "@/pages/Messagerie/Messagerie";
import MonProjet from "@/pages/Mon-projet/MonProjet";
import Profile from "@/pages/Profile/Profile";

interface RouteConfig {
  path: string;
  element: React.ReactNode;
  children?: RouteConfig[];
}

export const pferoutes: RouteConfig[] = [
  { path: "/", element: <Home /> },
  { path: "/portail-enseignant", element: <PortailEnseignantLogin /> },
  { path: "/portail-etudiant", element: <PortailEtudiantLogin /> },
  { path: "/portail-partenaire", element: <PortailPartenaireLogin /> },
  { path: "/profile", element: <Profile /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/colleagues", element: <Colleuges /> },
  { path: "/messaging", element: <Messagerie /> },
  { path: "/mon-projet", element: <MonProjet /> },
];
