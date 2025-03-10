import { useEffect } from "react";
import { useMyProfile } from "@/hooks/profile";
import { setProfile } from "@/redux/reducers/AuthReducer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store"; 

const Home = () => {
  const { data, error: profileError } = useMyProfile();
  const dispatch = useDispatch();
  const profile = useSelector((state: RootState) => state.auth.profile);
  const isLoggedIn = !!localStorage.getItem("refresh_token");

  useEffect(() => {
    if (isLoggedIn && !profileError) {
      dispatch(setProfile(data));
    } else if (profileError) {
      console.log(profileError);
    }
  }, [isLoggedIn, profileError, data, dispatch]);

  return (
    <div className="p-5 max-w-2xl mx-auto text-center font-sans">
      {isLoggedIn && profile ? (
        <div className="bg-gray-50 p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Welcome, {profile.first_name}!
          </h1>
          <div className="text-left space-y-2">
            <p>
              <strong>Username:</strong> {profile.username}
            </p>
            <p>
              <strong>Email:</strong> {profile.email}
            </p>
            <p>
              <strong>First Name:</strong> {profile.first_name}
            </p>
            <p>
              <strong>Last Name:</strong> {profile.last_name}
            </p>
            <p>
              <strong>User Type:</strong> {profile.user_type}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Home Without Login
          </h1>
          <p className="text-gray-600">
            Please log in to view your profile information.
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
