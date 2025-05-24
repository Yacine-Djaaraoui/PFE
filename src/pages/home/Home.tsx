import { useEffect } from "react";
import { useMyProfile } from "@/hooks/profile";
import { setProfile } from "@/redux/reducers/AuthReducer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Sidebar from "./sidebar";
import LanguageSwitcher from "./LanguageSwitcher";
import img1 from "@/assets/5949686980059185414.jpg";
import img2 from "@/assets/Frame 14195 (2).png";
import img3 from "@/assets/Frame 14195 (3).png";
import img4 from "@/assets/Frame 14195 (4).png";
import img5 from "@/assets/Frame 14195 (5).png";
import img8 from "@/assets/494710914_1282653333285340_9042056139837580090_n.jpg";
import img7 from "@/assets/Frame 14196 (2).png";
import img6 from "@/assets/Frame 14196.png";
import img9 from "@/assets/Frame 14197.png";
import img10 from "@/assets/Frame 14197 (1).png";
import img11 from "@/assets/Frame 14197 (2).png";
import img12 from "@/assets/Frame 14197 (3).png";
import img13 from "@/assets/Frame 14198 (1).png";
import img14 from "@/assets/Frame 14198 (2).png";
import img15 from "@/assets/Frame 14198.png";
import img16 from "@/assets/Frame 14199.png";
import { useNavigate } from "react-router-dom";

const images = [
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7,
  img8,
  img9,
  img10,
  img11,
  img12,
  img13,
  img14,
  img15,
];
const Home = () => {
  const { data, error: profileError } = useMyProfile();
  const dispatch = useDispatch();
  const profile = useSelector((state: RootState) => state.auth.profile);
  const isLoggedIn = !!localStorage.getItem("refresh_token");
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn && !profileError) {
      dispatch(setProfile(data));
      // Redirect to dashboard when logged in
      navigate("/dashboard");
    } else if (profileError) {
      console.log(profileError);
    }
  }, [isLoggedIn, profileError, data, dispatch, navigate]);

  return (
    <div className="flex w-full">
      {isLoggedIn ? (
        // This will briefly show before the redirect happens
        <div>Redirecting to dashboard...</div>
      ) : (
        <>
          <div className="bg-secondary w-full h-screen">
            <div className="container  flex items-center h-full justify-between">
              <div className="lg:max-w-[45%] max-md:text-center">
                {/* <LanguageSwitcher /> */}
                <h1 className="text-7xl max-md:text-4xl text-white font-bold mb-4 leading-14 md:leading-20">
                  Collaborez, innovez et réussissez <br />
                  Le futur des PFE à l'ESI
                </h1>
                <p className="text-white/75 max-md:text-lg   text-2xl mb-10 ">
                  Une plateforme unique pour organiser vos projets, collaborer
                  avec votre équipe et réussir votre soutenance
                </p>
                <button
                  onClick={() => navigate("/login")}
                  className="bg-white max-md:text-lg text-2xl font-bold rounded mr-3 hover:bg-white/90 cursor-pointer text-secondary px-6 py-3 "
                >
                  Se connecter
                </button>
                <button
                  onClick={() => navigate("/projects")}
                  className=" max-md:text-lg text-2xl font-bold rounded border-white text-white cursor-pointer border px-6 py-3 "
                >
                  Découvrir
                </button>
              </div>
              <div className="grid grid-cols-5 gap-2 p-2 max-lg:hidden ">
                {images.map((src, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-[40px] shadow-2xl"
                  >
                    <img
                      src={src}
                      alt={`Grid item ${index + 1}`}
                      className="h-[200px] w-[180px] object-cover "
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
