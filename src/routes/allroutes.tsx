import Home from "@/pages/home/Home";
import PortailEnseignantLogin from "@/pages/login/PortailEnseignantLogin";
import PortailEtudiantLogin from "@/pages/login/PortailEtudiantLogin";
import PortailPartenaireLogin from "@/pages/login/PortailPartenaireLogin";

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
];
