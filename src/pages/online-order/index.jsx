import { useEffect } from "react";
import AllCusines from "./AllCusines";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setMode } from "../../redux/authSlice";

const Online = () => {
  const location = useLocation();
  const path = location.pathname;

  const dispatch = useDispatch();
  // console.log({ path });
  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(setMode("online"));
  }, []);
  return (
    <div className="min-h-screen">
      <AllCusines />
    </div>
  );
};

export default Online;
