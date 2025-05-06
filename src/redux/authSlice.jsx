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
    coupon: null,
    couponPath: null,
    footer: null,
    charges: null,
    orderMode: null,
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
    addCoupon: (state, action) => {
      state.coupon = action.payload?.coupon;
      state.couponPath = action.payload.path;
    },
    addFooter: (state, action) => {
      state.footer = action.payload;
      state.charges = action.payload.charges?.[0];
    },
    setCharges: (state, action) => {
      state.charges = action.payload;
    },
    setMode: (state, action) => {
      state.orderMode = action.payload;
    },
  },
});

export const {
  triger,
  colorTheme,
  addCoupon,
  updateFoodInstructions,
  setMessage,
  addFooter,
  setCharges,
  setMode,
} = authSlice.actions;

export default authSlice.reducer;
