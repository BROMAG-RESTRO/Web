import { useEffect, useState } from "react";
import { gettAllBanners } from "../../helper/api/apiHelper";
import { notification } from "antd";
import _ from "lodash";
import LoadingScreen from "../../components/LoadingScreen";
import CustomSwiper from "../../components/CustomSwiper";
import { useHref } from "react-router-dom";
import { getFooterData } from "../../helper/api/apiHelper";

const CallForOrder = () => {
  const [adds, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [footerData, setFooterData] = useState(null);

  const path = useHref();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const allBanners = await gettAllBanners();
        const result_data = _.get(allBanners, "data.data", []).filter((res) => {
          return res.name === "Advertisement Banner";
        });
        setBanners(result_data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
        notification.error({ message: "Something went wrong" });
      }
    };

    const fetchFooter = async () => {
      try {
        const response = await getFooterData();
        setFooterData(response.data);
      } catch (error) {
        console.error("Error fetching footer data:", error);
      }
    };

    fetchData();
    fetchFooter();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (footerData === null) {
    return null;
  }

  const firstFooterData = footerData[0];

  return loading ? (
    <LoadingScreen />
  ) : (
    <div className="w-screen min-h-screen lg:px-20 px-4 flex items-center justify-start flex-col">
      <div className="font-semibold lg:pt-20 pt-10 lg:text-4xl tracking-wider text-dark3a_color">
        Welcome to {firstFooterData?.name} call for order
      </div>
      <div className="flex flex-col items-center lg:pt-20 pt-10">
        <img
          src="/assets/images/ordernow.png"
          alt=""
          className="lg:pb-2 pb-1 px-4"
        />
        <div className="lg:w-[600px] lg:h-[150px] w-[98%] rounded-2xl lg:shadow-2xl shadow shadow-[#5D5D5D40] flex items-center justify-center flex-col gap-y-4 bg-white py-5">
          <a
            href={`tel:${firstFooterData?.contactNumber}`}
            className="flex gap-x-10 items-center text-dark3a_color lg:!text-3xl"
          >
            <img
              src="/assets/icons/calldark.png"
              alt=""
              className="lg:w-[30px] w-[20px]"
            />
            <div className="pr-3">{firstFooterData?.contactNumber}</div>
          </a>
        </div>
      </div>

      <div className="font-bold lg:pt-32 pt-10 lg:w-fit w-screen px-4 lg:text-4xl tracking-wider text-[#494949] ">
        BROMAG Advertisement
        <img
          src="/assets/icons/orderborder.png"
          alt=""
          className="w-[100px] h-[5px]"
        />
      </div>

      <div className="w-screen py-10 lg:px-10 px-4">
        <CustomSwiper
          data={adds}
          scroll={true}
          setLoading={setLoading}
          width={98}
          path={path}
        />
      </div>
    </div>
  );
};

export default CallForOrder;
