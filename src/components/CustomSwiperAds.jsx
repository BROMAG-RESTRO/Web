/* eslint-disable no-empty */
/* eslint-disable react/prop-types */
import _ from "lodash";
import {
  Autoplay,
  EffectCoverflow,
  Keyboard,
  Pagination,
  Scrollbar,
} from "swiper/modules";
import { SwiperSlide, Swiper } from "swiper/react";
import "swiper/css";
import "swiper/css/scrollbar";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import { useNavigate } from "react-router-dom";
import { updateAdvertisementBanner } from "../helper/api/apiHelper";
import { Modal } from "antd";

const CustomSwiper = ({
  data,
  pagination = false,
  scroll = false,
  width = 50,
  setLoading,
  path,
  setCurrentId,
  same,
}) => {
  const navigate = useNavigate();
  const [modal, contextHolder] = Modal.useModal();

  const handleClick = async (res) => {
    try {
      if (scroll) {
        if (
          !localStorage.getItem(
            "chgi5kjieaoyaiackaiw_bbcqgy4akacsaiq_bbcqgyyaq"
          )
        ) {
          return modal.confirm({
            title: "This is a confirmation message",
            content: `Login is necessary to proceed further.`,
            cancelText: "Not Now",
            okText: "Login",
            style: { background: "white", borderRadius: "10px" },
            onOk: () => {
              navigate("/login", {
                state: { backLocation: path },
              });
            },
          });
        }
        setLoading(true);
        window.scrollTo(0, 0);
        let formData = {
          id: res._id,
        };
        await updateAdvertisementBanner(formData);
        if (same) {
          setCurrentId(res._id);
        } else {
          navigate("/explore-advertisement", {
            state: { id: res, path: path },
          });
        }
      } else {
        navigate("/food-deatils", {
          state: { currentCatid: res.productId },
        });
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Swiper
        slidesPerView={3}
        centeredSlides={false}
        slidesPerGroupSkip={3}
        grabCursor={true}
        keyboard={scroll}
        autoplay={{
          delay: 1000,
        }}
        loop={true}
        modules={[EffectCoverflow, Autoplay, Pagination, Keyboard, Scrollbar]}
        effect={"coverflow"}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 90,
          modifier: 2.5,
        }}
        breakpoints={{
          320: {
            slidesPerView: scroll ? 1 : 2,
            spaceBetween: 10,
          },
          480: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 40,
          },
        }}
        pagination={pagination}
        scrollbar={scroll}
        spaceBetween={30}
        className={`mySwiper w-[98%] lg:w-[${width}vw] lg:px-[100px] center_div px-10`}
      >
        {data.map((res, index) => {
          return (
            <SwiperSlide
              key={index}
              onClick={() => {
                handleClick(res);
              }}
              className={`w-[96%] ultraSm:!h-[50vh]  lg:!h-[50vh] bg-cover object-center !rounded-lg !cursor-pointer}`}
              style={{
                backgroundImage: `url('${_.get(res, "image[0]", "")}')`,
                borderRadius: 10,
              }}
            />
          );
        })}
      </Swiper>
      {contextHolder}
    </>
  );
};

export default CustomSwiper;
