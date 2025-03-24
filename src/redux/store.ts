import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "@/redux/reducers/AuthReducer";
import SearchRusltReducer from "@/redux/reducers/SearchReducer";
export const store = configureStore({
  reducer: {
    auth: AuthReducer,
    SearchResult: SearchRusltReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
