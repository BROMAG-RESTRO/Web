/* eslint-disable no-empty */
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css";
import "swiper/css/navigation";
import { Modal } from "antd";
import { Autoplay, Navigation } from "swiper/modules";
import { getAllVideos } from "../../helper/api/apiHelper";
import _ from "lodash";
import { IoMdClose } from "react-icons/io";

function TopVideos() {
    const [openVideo, setOpenVideo] = useState(false);
    const [currentVideo, setcurrentVideo] = useState("");
    const [currentVideos, setcurrentVideos] = useState("");
    const [allVideos, setAllVideos] = useState([]);

    const fetchData = async () => {
        try {
            const result = await getAllVideos();
            let intro = _.get(result, "data.data", []).filter((res) => {
                return res.name === "BroMag";
            });
            let rest = _.get(result, "data.data", []).filter((res) => {
                return res.name !== "BroMag";
            });
            setAllVideos(rest);
            setcurrentVideos(intro);
        } catch (err) {}
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <div className="w-screen min-h-[50vh] py-10 lg:!min-h-screen text-white bg-[url('/assets/images/video.png')] bg-cover justify-around gap-y-4 center_div_col pb-10 ">
                <div className="center_div justify-evenly lg:py-10  px-10 items-center">
                    <div className="lg:text-7xl text-xl md:text-5xl text-light_white lg:py-0 ">
                        Lookout our <br className="lg:block hidden text-lg" />
                        videos
                    </div>
                    <div className="relative lg:block hidden">
                        <video
                            controls={false}
                            src={_.get(currentVideos, "[0].video", "")}
                            className=" lg:w-[35vw] h-[40vh] rounded-[50px] object-cover relative border-2 border-white"
                        ></video>
                        <div className="absolute w-full lg:w-[35vw] h-[40vh] top-0 center_div">
                            <div
                                className="absolute w-[50px] h-[50px]  rounded-full  border center_div cursor-pointer z-50"
                                onClick={() => {
                                    setOpenVideo(true);
                                    setcurrentVideo(
                                        _.get(currentVideos, "[0].video", "")
                                    );
                                }}
                            >
                                <img
                                    src="/assets/videos/paly_vector.png"
                                    alt=""
                                    className="absolute w-[10px] h-[10px] "
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="center_div">
                    <Swiper
                        // navigation={true}
                        slidesPerView={1}
                        modules={[Navigation, Autoplay]}
                        autoplay={true}
                        loop={true}
                        spaceBetween={80}
                        breakpoints={{
                            320: {
                                slidesPerView: 2,
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
                        className="mySwiper px-10 w-[90vw] lg:w-[80vw]  center_div"
                    >
                        {allVideos.map((res, index) => {
                            return (
                                <SwiperSlide key={index} className="center_div">
                                    <div className="center_div">
                                        <video
                                            controls={false}
                                            src={res.video}
                                            className="md:h-[200px] ultraSm:h-[200px] rounded-2xl"
                                        ></video>
                                        <div className="absolute w-[25vw] h-[200px] top-0 center_div">
                                            <div
                                                className="absolute w-[50px] h-[50px]  rounded-full  bg-black center_div cursor-pointer z-50"
                                                onClick={() => {
                                                    setOpenVideo(true);
                                                    setcurrentVideo(res.video);
                                                }}
                                            >
                                                <img
                                                    src="/assets/videos/paly_vector.png"
                                                    alt=""
                                                    className="absolute w-[10px] h-[10px] "
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </div>
            </div>
            <Modal
                centered
                open={openVideo}
                closable={false}
                footer={false}
                destroyOnClose
                className="!w-screen"
            >
                <div className="center_div bg-white lg:w-[50%] w-[100%] m-auto p-2 rounded-xl relative">
                    <video
                        muted
                        autoPlay
                        loop
                        controls
                        className="w-full h-auto object-cover "
                    >
                        <source src={currentVideo} />
                    </video>
                    <span
                        onClick={() => {
                            setOpenVideo(false);
                            setOpenVideo("");
                        }}
                        className="bg-primary_color  text-white absolute -right-2 -top-2 shadow-2xl cursor-pointer rounded-full w-[25px] h-[25px] center_div"
                    >
                        <IoMdClose />
                    </span>
                </div>
            </Modal>
        </>
    );
}

export default TopVideos;
