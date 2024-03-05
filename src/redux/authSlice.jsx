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
    message: null,
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
    setMessage: (state, action) => {
      state.message = action.payload;
    },
  },
});

export const { triger, colorTheme, updateFoodInstructions, setMessage } =
  authSlice.actions;

export default authSlice.reducer;
