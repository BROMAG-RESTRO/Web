import React, { useEffect } from "react";
import AllCusines from "../online-order/AllCusines";

const TakeAway = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <AllCusines />
    </div>
  );
};

export default TakeAway;
