/* eslint-disable no-empty */
import { useEffect, useState } from "react";
import { useHref, useLocation, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { HashLink } from "react-router-hash-link";
import _ from "lodash";
import { Breadcrumb } from "antd";
import CustomSwiper from "./CustomSwiper";
import { getSpecificBanner } from "../helper/api/apiHelper";

const ExploreAdd = () => {
  const location = useLocation();

  const [adds, setAdds] = useState([]);
  const [current, setCurrent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const path = useHref();

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleRedirect = () => {
    try {
      window.scrollTo(0, 0);
      if (_.get(location, "state.path", "") === "/") {
        navigate(`/#advertisement`);
      } else {
        navigate(`${_.get(location, "state.path", "")}/#advertisement`);
      }
    } catch (err) {}
  };

  const fetchData = async () => {
    try {
      const allBanners = await getSpecificBanner("Advertisement_Banner");
      const selectedAd = _.get(allBanners, "data.data", []).find(
        (res) => res._id === (currentId || _.get(location, "state.id._id", ""))
      );
      setAdds(
        _.get(allBanners, "data.data", []).filter(
          (res) =>
            res._id !== (currentId || _.get(location, "state.id._id", ""))
        )
      );
      setCurrent(selectedAd ? [selectedAd] : []);
      // eslint-disable-next-line no-empty
    } catch (err) {
    } finally {
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentId]);

  return (
    <div className="bg-white w-screen min-h-screen  flex flex-col gap-y-2 lg:px-4 px-4 lg:py-4 py-4">
      <Breadcrumb
        className="!px-2"
        separator="<"
        items={[
          {
            title: (
              <HashLink to="/">
                <div className="text-black lg:text-sm text-[10px]">Home</div>
              </HashLink>
            ),
          },
          // {
          //   title: (
          //     <HashLink
          //       to={`${_.get(location, "state.path", "")}/#advertisement`}
          //     >
          //       <div className="text-black lg:text-sm text-[10px]">Back</div>
          //     </HashLink>
          //   ),
          //   onClick: () => {
          //     handleRedirect();
          //   },
          // },
          // {
          //     title: (
          //         <span className="text-slate-400 lg:text-sm text-[10px]">
          //             Advertisement Details
          //         </span>
          //     ),
          // },
        ]}
      />
      <Swiper
        modules={[Pagination, Autoplay]}
        className="w-full"
        autoplay={{
          delay: 5000,
        }}
        loop={true}
        pagination={{
          clickable: true,
        }}
      >
        {_.get(current, "[0].image", []).map((res, index) => {
          return (
            <SwiperSlide
              key={index}
              className={`w-[100%] h-auto  !bg-cover !object-cover bg-no-repeat !rounded-lg !cursor-pointer   }`}
            >
              <img
                src={res}
                className=" w-screen  object-fill  md:h-[150vh]   h-[50vh] shadow-black pb-10 rounded-b-[50px]"
              />
            </SwiperSlide>
          );
        })}
      </Swiper>

      <div className="lg:pb-[50vh] pb-10  ">
        <div className="flex items-center gap-x-2">
          <div>
            <h1 className="ultraSm:text-xl lg:text-4xl font-bold text-black ">
              Description &nbsp;
            </h1>
            <img src="/assets/icons/orderborder.png" alt="" />
          </div>
        </div>

        <p className="lg:text-lg !leading-loose text-light_gray pt-4 text-sm px-4 text-start font-light">
          {_.get(current, "[0].content", "")}
        </p>
        <div className="flex items-center gap-x-2 pt-10 pb-10">
          <div>
            <h1 className="ultraSm:text-xl lg:text-4xl font-bold text-black ">
              More Advertisement &nbsp;
            </h1>
            <img src="/assets/icons/orderborder.png" alt="" />
          </div>
        </div>
        <CustomSwiper
          data={adds}
          scroll={true}
          width={98}
          path={path}
          setCurrentId={setCurrentId}
          same={true}
          setLoading={setLoading}
        />
      </div>
    </div>
  );
};

export default ExploreAdd;
