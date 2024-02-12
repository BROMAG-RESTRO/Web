import  { useEffect } from "react";
import AllCusines from "./AllCusines";

const Online = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen">
      <AllCusines />
    </div>
  );
};

export default Online;
