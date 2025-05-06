/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import CustomSwiper from "../../components/CustomSwiper";
import { useSelector } from "react-redux";

const TopFoods = ({ topfoods }) => {
  const [topFoodsData, setTopFoodsData] = useState([]);
  const { fourthColor } = useSelector((state) => state.auth);

  useEffect(() => {
    setTopFoodsData(
      topfoods.filter((res) => {
        return res.name === "Top Notch Banner";
      })
    );
  }, []);

  return (
    <div className="w-screen lg:min-h-[80vh] flex lg:flex-row justify-center items-center flex-nowrap flex-col-reverse lg:pt-0 gap-y-6 lg:px-10">
      <div className="lg:w-[60vw] w-screen relative lg:h-[80vh] center_div  px-4">
        <CustomSwiper data={topFoodsData} pagination={true} />
      </div>
      <div className="lg:w-[50vw]  lg:center_div_col flex-nowrap flex-col gap-y-4">
        <div className="lg:text-5xl font-bold text-light_gray lg:center_div justify-center gap-x-2 lg:px-0 px-4 ">
          <div className="min-w-[10px] lg:h-[40px]  h-[20px] lg:bg-[#DF9300] rounded-2xl  -left-0 top-2"></div>
          <h1 className="ultraSm:text-xl lg:text-4xl font-bold text-black " style={{ color: fourthColor }}>
            Top Notch Food
          </h1>
          <div className="w-[30px] lg:h-[40px]  h-[5px] ultraSm:bg-[#DF9300] lg:hidden xl:hidden 2xl:hidden md:hidden rounded-2xl "></div>
        </div>
        <p className="lg:text-lg !leading-loose text-light_gray pt-4 text-sm px-4 text-start font-light">
          Immerse yourself in the rich tapestry of tastes, where every bite
          tells a story of quality, creativity, and sustainability. Our chefs,
          the architects of this culinary haven, invite you to experience a
          world where gastronomy transcends expectations.
        </p>
      </div>
    </div>
  );
};

export default TopFoods;
