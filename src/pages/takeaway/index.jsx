import React, { useEffect } from "react";
import AllCusines from "../online-order/AllCusines";
import { useDispatch } from "react-redux";
import { setMode } from "../../redux/authSlice";

const TakeAway = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(setMode("takeaway"));
  }, []);

  return (
    <div className="min-h-screen">
      <AllCusines />
    </div>
  );
};

export default TakeAway;
