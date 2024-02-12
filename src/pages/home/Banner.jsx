/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import { colorTheme } from "../../redux/authSlice";

const Banner = ({ banners }) => {
  const [bannersData, setBanners] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    setBanners(
      _.shuffle(banners).filter((res) => {
        return res.name === "Banner";
      })
    );
  }, []);

  return (
    <div className="w-screen lg:min-h-[calc(100vh-80px)] lg:pb-[50px]">
      <Swiper
        modules={[Pagination, Autoplay]}
        className="w-full lg:h-[110vh] pb-[100px]"
        autoplay={{
          delay: 3000,
        }}
        loop={true}
        pagination={{
          clickable: true,
        }}
      >
        {bannersData.map((res, index) => {
          return (
            <SwiperSlide key={index}>
              <img
                onClick={() => {
                  navigate("/food-deatils", {
                    state: { currentCatid: res.productId },
                  });
                }}
                src={_.get(res, "image[0]", "")}
                alt=""
                className="object-cover cursor-pointer lg:h-[620px] h-1/2 w-full"
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default Banner;

{
  /* 260 * 320  --- big banner: Width 1450 Height 750 -- vertical banner: Width 215 Height 285 */
}
