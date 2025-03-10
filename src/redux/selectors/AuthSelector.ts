import { RootState } from "../store";

export const selectAuthState = (state: RootState) => state.auth.token;
export const selectAuthentication = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthProfile = (state: RootState) => state.auth.profile;