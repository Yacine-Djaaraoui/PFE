import { useDispatch } from "react-redux";
import "./App.css";
import Routing from "./routes";
import { useMyProfile } from "./hooks/profile";
import { useEffect } from "react";
import { setProfile } from "./redux/reducers/AuthReducer";


function App() {
  const dispatch = useDispatch();
  const { data: profileData, error: profileError } = useMyProfile();
  const isLoggedIn = localStorage.getItem("refresh_token");
  useEffect(() => {
      if (profileData && isLoggedIn) {
        dispatch(setProfile(profileData));;
      }
      if (profileError) {
        console.error("Profile fetch error:", profileError);
      }
    }, [profileData, profileError, dispatch]);
  return <>
    <Routing />
  </>;
}

export default App;
