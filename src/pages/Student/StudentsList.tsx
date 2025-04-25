import Wrapper from "@/hoc/Wrapper";
import { useStudents } from "@/hooks/useStudents";
import { RootState } from "@/redux/store";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Pagination1 from "./pagination";
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
import { useInvitations } from "@/hooks/useInvitaions";
import { useTeams } from "@/hooks/teams";
interface Student {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  academic_year: string;
  academic_program: string;
  speciality: string;
  profile_picture: string;
}

const students: Student[] = [
  {
    id: "85736733",
    email: "olivia.rhye@univ.edu",
    username: "orhye",
    first_name: "Olivia",
    last_name: "Rhye",
    academic_year: "3",
    academic_program: "Computer Science",
    speciality: "ISI",
    profile_picture: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    id: "85736734",
    email: "phoenix.baker@univ.edu",
    username: "pbaker",
    first_name: "Phoenix",
    last_name: "Baker",
    academic_year: "2",
    academic_program: "Software Engineering",
    speciality: "ISI",
    profile_picture: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: "85736735",
    email: "demi.wilkinson@univ.edu",
    username: "dwilkinson",
    first_name: "Demi",
    last_name: "Wilkinson",
    academic_year: "4",
    academic_program: "Data Science",
    speciality: "IASD",
    profile_picture: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: "85736736",
    email: "lana.steiner@univ.edu",
    username: "lsteiner",
    first_name: "Lana",
    last_name: "Steiner",
    academic_year: "3",
    academic_program: "Web Development",
    speciality: "SIW",
    profile_picture: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    id: "85736737",
    email: "alex.chen@univ.edu",
    username: "achen",
    first_name: "Alex",
    last_name: "Chen",
    academic_year: "2",
    academic_program: "Artificial Intelligence",
    speciality: "ISI",
    profile_picture: "https://randomuser.me/api/portraits/men/2.jpg",
  },
];
const StudentsList = () => {
  const searchResults = useSelector((state: RootState) => state.SearchResult);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(1); // Sorting state
  const [data, setData] = useState(searchResults.searchResult); // Sorting state
  const [message, setMessage] = useState("");
   const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
  const CreateInvitaion = useInvitations();
  const {
    data: studentsdata,
    error : studenterror,
    isLoading,
    isFetching,
    isError,
  } = useStudents(
    {
      ordering: "-last_name",
      show_peers_only: true,
      page_size: 10,
      page: currentPage,
      search: searchResults.searchTerm,
      has_team : false,
    },
    {
      enabled: true,
    }
  );
  const { data: teamsData, error: teamsError } = useTeams({
    is_owner: true,
    match_student_profile: true,
  });
  useEffect(() => {
    console.log("students", data);
    setTotalPages(data?.total_pages);
  }, [data, studentsdata]);
  useEffect(() => {
    setData(studentsdata);
  }, [currentPage, studentsdata]);
  useEffect(() => {
    setData(searchResults.searchResult);
  }, [searchResults.searchResult]);
  useEffect(() => {}, [searchResults]);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 350, behavior: "smooth" }); // Scrolls to top
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };
  const handleCreateInvitation = (teamId: string, username: string) => {
    CreateInvitaion.mutate(
      { teamId, username },
      {
        onSuccess: () => {
           setError(""); // Clear any previous errors
           setSuccess(`sending invitaion successfully`);
        },
        onError: (error) => {
         setError(error.name[0]);

          //   setError(error?.non_field_errors);
        },
      }
    );
  };
  return (
    <div className=" h-screen py-10 pl-8 w-full  ">
      <h2 className="text-primaryTitle font-bold text-[20px] font-inter">
        Bienvenue dans l’espace Liste des Étudiants !{" "}
      </h2>
      <p className="font-medium text-[16px] mt-2 text-[#092147]/55">
        Retrouvez tous les étudiants inscrits sur la plateforme, explorez leurs
        profils et découvrez leurs compétences.
      </p>
      {success && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <p> {success}</p>
        </div>
      )}

      {/* Display errors from the join request */}
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}
      <div className="p-6 border border-[#EAECF0] mt-8 bg-white rounded-lg shadow-md relative">
        <div className="flex items-center">
          <h1 className="text-xl font-bold    inline  mr-2">
            Liste des étudiants
          </h1>
          <span className=" px-2  py-1  font-instrument text-xs  bg-secondary text-white rounded   ">
            {data?.count} Total
          </span>
        </div>

        <div className="mt-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 pr-8 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
                  Nom et prénom
                </th>

                {/* <th className="px-3 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
                  Academic Year
                </th> */}

                {(data?.results[0]?.profile?.current_year == 2 ||
                  data?.results[0]?.profile?.current_year == 3) &&
                  data?.results[0]?.profile?.academic_program ===
                    "superior" && (
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
                      Spécialité
                    </th>
                  )}
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
                  Compétence{" "}
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
                  Status
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
                  Ajouter
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.results?.map((student) => (
                <tr key={student.id} className="relative">
                  <td className="px-2 pr-8  py-4 whitespace-nowrap w-fit">
                    <div className="flex gap-2 h-10 w-10">
                      <img
                        className="h-10 w-10 rounded-xl"
                        src={student.profile_picture_url}
                        alt={`${student.first_name} ${student.last_name}`}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://via.placeholder.com/150";
                        }}
                      />
                      <div className="flex flex-col ">
                        <td className=" text-sm text-black">
                          {`${student.first_name} ${student.last_name}`}
                        </td>
                        <td className=" text-sm text-gray-500">
                          @{student.username}
                        </td>{" "}
                      </div>
                    </div>
                  </td>

                  {/* <td className="px-2 py-4 w-fit whitespace-nowrap text-sm text-gray-500">
                    {`${student.profile.current_year}  ${student.profile.academic_program}`}
                  </td> */}

                  {(data?.results[0]?.profile?.current_year == 2 ||
                    data?.results[0]?.profile?.current_year == 3) &&
                    data?.results[0]?.profile?.academic_program ===
                      "superior" && (
                      <td className="px-2 w-fit py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.profile.speciality}
                      </td>
                    )}

                  <td className="px-2 py-4 w-fit whitespace-nowrap text-sm text-gray-500">
                    Front-end developer{" "}
                  </td>
                  <td className="px-2 py-4 w-fit whitespace-nowrap text-sm text-secondary">
                    Non assigné{" "}
                  </td>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className=" absolute top-1/2 right-0 -translate-y-1/2 cursor-pointer   bg-secondary text-white rounded-[3px] font-instrument px-2 py-1 hover:bg-secondary/80">
                        Inviter
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {" "}
                          Inviter ce membre de rejoindre à votre groupe
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {/* Une fois inscrit, vous devrez demander à l’administration pour
                                      changer de groupe. */}
                          {/* <label className="font-medium block mt-2 mb-2">
                            Ajouter un message a l'equipe
                          </label>
                          <input
                            type="text"
                            value={message}
                            onChange={handleChange}
                            className="border block border-gray-300 rounded-lg mb-3 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={`message`}
                          /> */}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="hover:bg-secondary cursor-pointer hover:text-white">
                          Annuler
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            handleCreateInvitation(
                              teamsData?.results[0]?.id,
                              student.username
                            );
                          }}
                        >
                          Inviter
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination1
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Wrapper(StudentsList);
