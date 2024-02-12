import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth slice",
  initialState: {
    value: false,
    primaryColor: "",
    secondaryColor: "",
    thirdColor: "",
    fourthColor: "",
    foodInstructions: {},
  },
  reducers: {
    triger: (state, action) => {
      state.value = action.payload;
    },
    colorTheme: (state, action) => {
      state.primaryColor = action.payload.primaryColor;
      state.secondaryColor = action.payload.secondaryColor;
      state.thirdColor = action.payload.thirdColor;
      state.fourthColor = action.payload.fourthColor;
    },
    updateFoodInstructions: (state, action) => {
      const { foodId, instructions } = action.payload;
      state.foodInstructions[foodId] = instructions;
    },
  },
});

export const { triger, colorTheme, updateFoodInstructions } = authSlice.actions;

export default authSlice.reducer;
