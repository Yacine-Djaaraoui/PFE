import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface UserProfile {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  user_type: string;
  profile: Record<string, any>; 
}

interface AuthState {
  token: string | null;
  profile: UserProfile | null; 
  isAuthenticated: boolean;
}


const storedToken = localStorage.getItem("access_token");

const initialState: AuthState = {
  token: storedToken || null,
  profile: null,
  isAuthenticated: !!storedToken,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    setProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload; 
    },
    logoutR: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.profile = null;
    },
  },
});

// Export actions and reducer
export const { loginSuccess, logoutR, setProfile } = authSlice.actions;
export default authSlice.reducer;