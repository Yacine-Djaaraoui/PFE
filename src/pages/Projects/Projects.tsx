import React, { useState } from "react";
import { useProjects } from "@/hooks/useProjects";
import { Skeleton } from "@/components/ui/skeleton";
import logo from "@/assets/logowithtitle.png";

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

const fallbackProjects = [
  {
    id: 1,
    theme: {
      academic_year: "2023",
      title: "Gestion intelligente de l'énergie dans les bâtiments",
      description:
        "Un projet visant à réduire la consommation énergétique à travers des capteurs intelligents.",
      tools: ["IoT", "Python"],
    },
    team: {
      id: 7,
      description: "Équipe éco-énergétique",
      member_count: 4,
    },
    uploads: [{}, {}, {}],
  },
  {
    id: 2,
    theme: {
      academic_year: "2022",
      title: "Application de suivi de santé mentale",
      description:
        "Une plateforme pour surveiller et améliorer la santé mentale des étudiants.",
      tools: ["React Native", "Firebase"],
    },
    team: {
      id: 12,
      description: "Équipe bien-être",
      member_count: 3,
    },
    uploads: [{}],
  },
  {
    id: 3,
    theme: {
      academic_year: "2021",
      title: "Système de recommandation pour e-commerce",
      description:
        "Un moteur de recommandation basé sur l'apprentissage automatique pour les boutiques en ligne.",
      tools: ["TensorFlow", "Node.js"],
    },
    team: {
      id: 18,
      description: "Équipe ML Commerce",
      member_count: 5,
    },
    uploads: [{}, {}],
  },
  {
    id: 4,
    theme: {
      academic_year: "2023",
      title: "Plateforme de e-learning interactive",
      description:
        "Une plateforme d'apprentissage en ligne avec des fonctionnalités interactives avancées.",
      tools: ["React", "Node.js"],
    },
    team: {
      id: 15,
      description: "Équipe éducation",
      member_count: 6,
    },
    uploads: [{}, {}, {}, {}],
  },
  {
    id: 5,
    theme: {
      academic_year: "2022",
      title: "Application mobile de gestion des tâches",
      description:
        "Une application mobile pour organiser et gérer efficacement les tâches quotidiennes.",
      tools: ["Flutter", "Firebase"],
    },
    team: {
      id: 9,
      description: "Équipe productivité",
      member_count: 3,
    },
    uploads: [{}, {}],
  },
  {
    id: 6,
    theme: {
      academic_year: "2021",
      title: "Système de reconnaissance faciale",
      description:
        "Un système de sécurité basé sur la reconnaissance faciale utilisant l'intelligence artificielle.",
      tools: ["OpenCV", "Python"],
    },
    team: {
      id: 21,
      description: "Équipe sécurité IA",
      member_count: 4,
    },
    uploads: [{}, {}, {}],
  },
];

const Projects = () => {
  const [search, setSearch] = useState("");
  const [academicYear, setAcademicYear] = useState<string | undefined>(
    undefined
  );

  const { data, isLoading, error } = useProjects({
    search,
    academic_year: academicYear,
    ordering: "-created_at",
  });

  const projects = data?.results?.length ? data.results : fallbackProjects;

  const uniqueYears = Array.from(
    new Set(projects.map((p) => p.theme.academic_year))
  ).sort((a, b) => parseInt(b) - parseInt(a));

  const getProjectColor = (index: number) => {
    const colors = [
      "bg-orange-500",
      "bg-blue-500",
      "bg-purple-500",
      "bg-green-500",
      "bg-red-500",
      "bg-indigo-500",
    ];
    return colors[index % colors.length];
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      search === "" ||
      project.theme?.title.toLowerCase().includes(search.toLowerCase()) ||
      project.theme?.description.toLowerCase().includes(search.toLowerCase());

    const matchesYear =
      !academicYear || project.theme?.academic_year === academicYear;

    return matchesSearch && matchesYear;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 px-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <a href="/">
            <img src={logo} alt="#" className="w-[200px]" />
          </a>
          <a href="/login">
            <button className="bg-secondary text-white px-4 py-2 rounded text-sm font-medium hover:bg-secondary/90">
              Se connecter
            </button>
          </a>
        </div>
      </div>

      <div className="px-6 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Découvrez les projets des années précédentes
        </h1>

        {/* Filter Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setAcademicYear(undefined)}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              !academicYear
                ? "bg-secondary text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Tous
          </button>
          {uniqueYears.map((year) => (
            <button
              key={year}
              onClick={() => setAcademicYear(year)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                academicYear === year
                  ? "bg-secondary text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {year}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="mb-6 flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-lg" />
            ))}
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-8">
            Erreur lors du chargement des projets.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project: any, index: number) => (
              <AlertDialog key={project.id}>
                <AlertDialogTrigger asChild>
                  <div className="bg-white rounded-lg  shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                    {/* Project Image Placeholder */}
                    <div className={`h-32 ${getProjectColor(index)}`}></div>

                    <div className="p-4">
                      {/* Category Badge */}
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium text-white mb-3 ${getProjectColor(
                          index
                        )}`}
                      >
                        {project.team?.description}
                      </span>

                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {project.theme?.title}
                      </h3>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                        {project.theme?.description}
                      </p>

                      {/* Team Info */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="flex -space-x-1">
                            {[
                              ...Array(
                                Math.min(3, project.team?.member_count || 0)
                              ),
                            ].map((_, i) => (
                              <div
                                key={i}
                                className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center"
                              >
                                <span className="text-xs text-gray-600">
                                  {String.fromCharCode(65 + i)}
                                </span>
                              </div>
                            ))}
                            {(project.team?.member_count || 0) > 3 && (
                              <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                                <span className="text-xs text-gray-500">
                                  +{(project.team?.member_count || 0) - 3}
                                </span>
                              </div>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">
                            {project.team?.member_count || 0} membres
                          </span>
                        </div>

                        <div className="flex items-center space-x-3 text-sm text-gray-500">
                          <div className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-3.774-.829L3 21l1.172-5.226A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z"
                              />
                            </svg>
                            {Math.floor(Math.random() * 10)} commentaires
                          </div>
                          <div className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            {project.uploads?.length || 0} documents
                          </div>
                        </div>
                      </div>

                      {/* Footer with year and team info */}
                      <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                        Année {project.theme?.academic_year} • Groupe n°
                        {project.team?.id}
                      </div>
                    </div>
                  </div>
                </AlertDialogTrigger>

                <AlertDialogContent className=" max-w-[800px] max-h-[90vh] overflow-y-auto">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl font-bold text-gray-900">
                      {project.theme?.title || project.theme_title}
                    </AlertDialogTitle>
                    <AlertDialogDescription asChild>
                      <div className="space-y-6">
                        {/* Project Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                              Informations du projet
                            </h3>
                            <div className="space-y-2 text-sm">
                              <p>
                                <span className="font-medium">
                                  Année académique:
                                </span>{" "}
                                {project.academic_year ||
                                  project.theme?.academic_year}
                              </p>
                              <p>
                                <span className="font-medium">Équipe:</span>{" "}
                                {project.team?.name || project.team_name}
                              </p>
                              <p>
                                <span className="font-medium">
                                  Nombre de membres:
                                </span>{" "}
                                {project.team?.member_count}
                              </p>
                              <p>
                                <span className="font-medium">
                                  Description de l'équipe:
                                </span>{" "}
                                {project.team?.description}
                              </p>
                              {project.theme?.tools && (
                                <p>
                                  <span className="font-medium">Outils:</span>{" "}
                                  {project.theme.tools.join(", ")}
                                </p>
                              )}
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                              Description
                            </h3>
                            <p className="text-sm text-gray-600">
                              {project.theme?.description}
                            </p>
                          </div>
                        </div>

                        {/* Supervisors */}
                        {project.supervisors && (
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                              Encadrement
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Main Supervisor */}
                              {(project.supervisors.proposer ||
                                project.theme?.proposed_by) && (
                                <div className="bg-gray-50 p-4 rounded-lg">
                                  <h4 className="font-medium text-gray-900 mb-2">
                                    Encadreur principal
                                  </h4>
                                  {(() => {
                                    const supervisor =
                                      project.supervisors.proposer ||
                                      project.theme?.proposed_by;
                                    return (
                                      <div className="flex items-center space-x-3">
                                        <img
                                          src={supervisor.profile_picture_url}
                                          alt="Profil"
                                          className="w-10 h-10 rounded-full"
                                        />
                                        <div>
                                          <p className="font-medium">
                                            {supervisor.first_name}{" "}
                                            {supervisor.last_name}
                                          </p>
                                          <p className="text-sm text-gray-500">
                                            {supervisor.email}
                                          </p>
                                          <p className="text-sm text-gray-500">
                                            {supervisor.profile?.department}
                                          </p>
                                        </div>
                                      </div>
                                    );
                                  })()}
                                </div>
                              )}

                              {/* Co-supervisors */}
                              {project.supervisors.co_supervisors &&
                                project.supervisors.co_supervisors.length >
                                  0 && (
                                  <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-medium text-gray-900 mb-2">
                                      Co-encadreurs
                                    </h4>
                                    <div className="space-y-2">
                                      {project.supervisors.co_supervisors.map(
                                        (coSupervisor: any) => (
                                          <div
                                            key={coSupervisor.id}
                                            className="flex items-center space-x-3"
                                          >
                                            <img
                                              src={
                                                coSupervisor.profile_picture_url
                                              }
                                              alt="Profil"
                                              className="w-8 h-8 rounded-full"
                                            />
                                            <div>
                                              <p className="text-sm font-medium">
                                                {coSupervisor.first_name}{" "}
                                                {coSupervisor.last_name}
                                              </p>
                                              <p className="text-xs text-gray-500">
                                                {
                                                  coSupervisor.profile
                                                    ?.department
                                                }
                                              </p>
                                            </div>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}
                            </div>
                          </div>
                        )}

                        {/* Team Members */}
                        {project.team_members &&
                          project.team_members.length > 0 && (
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                Membres de l'équipe
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {project.team_members.map((member: any) => (
                                  <div
                                    key={member.id}
                                    className="bg-gray-50 p-4 rounded-lg"
                                  >
                                    <div className="flex items-center space-x-3">
                                      <img
                                        src={member.user.profile_picture_url}
                                        alt="Profil"
                                        className="w-10 h-10 rounded-full"
                                      />
                                      <div className="flex-1">
                                        <div className="flex items-center space-x-2">
                                          <p className="font-medium">
                                            {member.user.first_name}{" "}
                                            {member.user.last_name}
                                          </p>
                                          {member.role === "owner" && (
                                            <span className="bg-secondary text-white text-xs px-2 py-1 rounded">
                                              Chef d'équipe
                                            </span>
                                          )}
                                        </div>
                                        <p className="text-sm text-gray-500">
                                          {member.user.email}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                          Matricule:{" "}
                                          {member.user.profile?.matricule}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                          Rejoint le{" "}
                                          {formatDate(member.joined_at)}
                                        </p>
                                      </div>
                                    </div>

                                    {/* Skills */}
                                    {member.user.profile?.skills &&
                                      member.user.profile.skills.length > 0 && (
                                        <div className="mt-3">
                                          <p className="text-sm font-medium text-gray-700 mb-1">
                                            Compétences:
                                          </p>
                                          <div className="flex flex-wrap gap-1">
                                            {member.user.profile.skills.map(
                                              (skill: any) => (
                                                <span
                                                  key={skill.id}
                                                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                                                >
                                                  {skill.name}
                                                </span>
                                              )
                                            )}
                                          </div>
                                        </div>
                                      )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                        {/* Documents */}
                        {project.theme?.documents &&
                          project.theme.documents.length > 0 && (
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                Documents
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {project.theme.documents.map((doc: any) => (
                                  <div
                                    key={doc.id}
                                    className="bg-gray-50 p-3 rounded-lg flex items-center space-x-3"
                                  >
                                    <svg
                                      className="w-8 h-8 text-red-500"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                      />
                                    </svg>
                                    <div className="flex-1">
                                      <p className="font-medium text-sm">
                                        {doc.title}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        Type: {doc.document_type}
                                      </p>
                                      <p className="text-xs text-gray-400">
                                        Ajouté le {formatDate(doc.created_at)}
                                      </p>
                                    </div>
                                    <a
                                      href={doc.file}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="bg-secondary text-white px-3 py-1 rounded text-xs hover:bg-secondary/90"
                                    >
                                      Télécharger
                                    </a>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                        {/* Meetings */}
                        {project.meetings && project.meetings.length > 0 && (
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                              Réunions
                            </h3>
                            <div className="space-y-3">
                              {project.meetings.map((meeting: any) => (
                                <div
                                  key={meeting.id}
                                  className="bg-gray-50 p-4 rounded-lg"
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-medium">
                                      {meeting.title}
                                    </h4>
                                    <span
                                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        meeting.status === "scheduled"
                                          ? "bg-green-100 text-green-800"
                                          : meeting.status === "cancelled"
                                          ? "bg-red-100 text-red-800"
                                          : "bg-gray-100 text-gray-800"
                                      }`}
                                    >
                                      {meeting.status === "scheduled"
                                        ? "Programmée"
                                        : meeting.status === "cancelled"
                                        ? "Annulée"
                                        : meeting.status}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">
                                    {meeting.description}
                                  </p>
                                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                                    <p>
                                      <span className="font-medium">Date:</span>{" "}
                                      {formatDate(meeting.scheduled_at)}
                                    </p>
                                    <p>
                                      <span className="font-medium">
                                        Durée:
                                      </span>{" "}
                                      {meeting.duration_minutes} minutes
                                    </p>
                                    <p>
                                      <span className="font-medium">Type:</span>{" "}
                                      {meeting.location_type === "physical"
                                        ? "Physique"
                                        : "En ligne"}
                                    </p>
                                    <p>
                                      <span className="font-medium">Lieu:</span>{" "}
                                      {meeting.location_details}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Project Dates */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            Dates importantes
                          </h3>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <p>
                              <span className="font-medium">Créé le:</span>{" "}
                              {formatDate(project.created_at)}
                            </p>
                            <p>
                              <span className="font-medium">
                                Mis à jour le:
                              </span>{" "}
                              {formatDate(project.updated_at)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="hover:bg-gray-400 cursor-pointer hover:text-white">
                      Fermer
                    </AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ))}
          </div>
        )}

        {filteredProjects.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-2">Aucun projet trouvé</div>
            <div className="text-sm text-gray-400">
              Essayez de modifier vos critères de recherche
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
