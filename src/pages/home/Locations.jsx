/* eslint-disable react/jsx-no-target-blank */
import { GrMapLocation } from "react-icons/gr";
import { FaLocationDot } from "react-icons/fa6";
import "../../../stylesheets/location.css";

import { useSelector } from "react-redux";
const Locations = () => {
  const footer = useSelector((state) => state.auth.footer);
  console.log("location", footer);
  let location = footer?.data?.[0]?.location;
  if (location?.map_link || location?.embedUrl) {
    return (
      <div className="flex lg:pt-2 pt-0 flex-col items-center justify-center pb-20">
        <div className="my-1 flex justify-center items-center  w-full">
          <div>
            <FaLocationDot className="ultraSm:text-2xl lg:text-4xl  " />
          </div>
          <div className=" p-2">
            <img
              src="/assets/icons/certificate of.png"
              alt=""
              className="ultraSm:w-[200px] lg:w-[250px]"
            />
          </div>
        </div>
        <a href="" target="_blank">
          {/* <img
          src={"/assets/images/map.png"}
          className="mt-[-25px] sm:mt-[-55px] md:mt-[-70px] lg:!mt-[-80px] px-2"
        /> */}
          <div className="mapouter w-full overflow-hidden flex justify-center items-center">
            <a href={location?.map_link} target="_blank">
              <div className="gmap_canvas flex justify-center items-center w-full">
                <iframe
                  id="gmap_canvas"
                  src={location?.embedUrl}
                  className="lg:h-[400px] ultraSm:h-[250px] rounded-2xl mx-5 w-full iframe-gmap"
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
                <br />
                {/* <a href="https://www.intimer.net/"></a> */}
              </div>
            </a>
          </div>
        </a>
        <div className="flex flex-col lg:gap-y-20 gap-y-10 items-center pt-14">
          <img src="/assets/logo/footer.png" alt="" className="lg:px-0 px-6" />

          <div className="flex items-center lg:gap-y-2 flex-col">
            <div className="flex items-center gap-x-2">
              <div className="text-[#494949] lg:text-3xl font-bold">
                Connect us with
              </div>
              <img src="/assets/icons/locationflove.png" alt="" />
            </div>
            <div className="text-[#494949] lg:text-2xl font-medium tracking-wider">
              D & D in Chennai, Tamilnadu
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Locations;
