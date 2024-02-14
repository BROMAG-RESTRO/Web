/* eslint-disable react/jsx-no-target-blank */
import { GrMapLocation } from "react-icons/gr";
import { FaLocationDot } from "react-icons/fa6";
import "../../../stylesheets/location.css";

const Locations = () => {
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
          <a href="https://www.google.com/maps/place/IFTAR+RESTAURANT/@12.8022319,78.73326,17z/data=!3m1!4b1!4m6!3m5!1s0x3bad09cd45c072cb:0xb79febce2e408e68!8m2!3d12.8022319!4d78.7358349!16s%2Fg%2F11ssczjr38?authuser=0&entry=ttu">
            <div className="gmap_canvas flex justify-center items-center w-full">
              <iframe
                id="gmap_canvas"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3899.7137067881956!2d78.73326!3d12.8022319!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bad09cd45c072cb%3A0xb79febce2e408e68!2sIFTAR%20RESTAURANT!5e0!3m2!1sen!2sin!4v1641397851347!5m2!1sen!2sin"
                className="lg:h-[400px] ultraSm:h-[250px] rounded-2xl mx-5 w-full iframe-gmap"
                allowFullScreen=""
                loading="lazy"
              ></iframe>
              <br />
              <a href="https://www.intimer.net/"></a>
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
};

export default Locations;
