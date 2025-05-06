import  { useEffect } from "react";
import AllTables from "./AllTables";
import { HashLink } from "react-router-hash-link";

const Booking = () => {
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-screen min-h-screen pb-10 ">
      <div className="relative h-[calc(100vh-140px)] bg-[url('/assets/images/diningbg.png')] bg-no-repeat bg-cover flex flex-col items-center justify-center">
        <h1 className="text-light_white lg:text-5xl tracking-wider font-semibold !leading-normal pb-20 text-center px-2">
          Where every reservation <br className="lg:block hidden" /> unfolds a memorable stories
        </h1>
        <h1 className="text-light_white lg:text-3xl text-center tracking-wider leading-normal">
          Your table awaits !
        </h1>
        <HashLink
          to="#tables"
          className="flex flex-col items-center gap-y-1 absolute bottom-10 animate-bounce cursor-pointer"
        >
          <img src={`/assets/icons/diningarrow1.png`} alt="" className="w-6" />
          <img src={`/assets/icons/diningarrow2.png`} alt="" className="w-4" />
          <img src={`/assets/icons/diningarrow3.png`} alt="" className="w-3" />
        </HashLink>
      </div>
      <div id="tables">
        <AllTables />
      </div>
    </div>
  );
};

export default Booking;
