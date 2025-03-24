import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Search } from "lucide-react";

// Define the type for your object

// Define the initial state
const initialState: any = {
};

// Create a slice
const SerachResult = createSlice({
  name: "SearchResult",
  initialState,
  reducers: {
    // Define a reducer to update the object
    setSearchResult: (state, action: PayloadAction<any>) => {
      return action.payload;
    },
  },
});

// Export the action
export const { setSearchResult } = SerachResult.actions;

// Export the reducer
export default SerachResult.reducer;
