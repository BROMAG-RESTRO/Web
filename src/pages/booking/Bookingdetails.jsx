import  { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import _ from "lodash";
import BookingForm from "./BookingForm";

const Bookingdetails = () => {
  const [currentTable, setCurrentTable] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (_.get(location, "state", "") === null) {
      navigate("/book-my-tables");
    }
    setCurrentTable(_.get(location, "state", ""));
    window.scrollTo(0, 0);
  }, []);



  return (
    <div className="w-screen min-h-screen bg-[url('/assets/images/diningbg.png')] bg-no-repeat bg-cover flex flex-col items-center gap-y-2">
      <div className="flex flex-col gap-y-6">
        <h1 className="lg:text-3xl tracking-wider text-light_white font-semibold pt-14">
          Enter your details to book a table
        </h1>
        <div className="relative lg:w-[350px] w-full h-24 bg-[#F5F5F5] m-auto rounded-2xl center_div justify-start gap-x-2">
          {/* img */}
          <div className="shadow-inner w-fit h-fit px-2">
            <img
              className="w-[80px] h-[80px] rounded-2xl bg-green-500 "
              src={_.get(currentTable, "image", "")}
              alt=""
            />
          </div>
          {/* table details */}
          <div className="w-fit flex flex-col">
            <h1 className="text-[#3F3F3F] font-semibold text-lg">
              Tables&nbsp;{_.get(currentTable, "tableNo", "")}
            </h1>
            <h2 className="text-[#999999] text-sm">
              {_.get(currentTable, "seatsAvailable", "")} seaters
            </h2>
          </div>
          {/* change */}
          <Link
            to="/book-my-tables"
            className="bg-[#FFE5E5] w-fit px-3 py-1 text-red_color rounded-lg absolute right-3 cursor-pointer text-sm"
          >
            Change
          </Link>
        </div>
      </div>
      <BookingForm tableDatas={currentTable} />
    </div>
  );
};

export default Bookingdetails;
