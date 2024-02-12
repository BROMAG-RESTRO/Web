/* eslint-disable react/prop-types */
import _ from "lodash";
import { useEffect, useState } from "react";
import CustomSwiper from "../../components/CustomSwiper";
import { useSelector } from "react-redux";

const VegFoods = ({ veg }) => {
  const [vegFoods, setVegFoods] = useState([]);
  const { fourthColor } = useSelector((state) => state.auth);

  useEffect(() => {
    setVegFoods(
      _.shuffle(veg).filter((res) => {
        return res.name === "Vegetarian Banner";
      })
    );
  }, []);

  return (
    <div className="w-screen lg:min-h-[90vh] flex lg:flex-row justify-center items-center flex-nowrap flex-col-reverse lg:pt-0 pt-2 gap-y-6">
      <div className="lg:w-[60vw] w-screen relative lg:h-[80vh] center_div ">
        <img
          className="w-[200px] absolute top-4 right-10 lg:block hidden"
          src="/assets/images/leaf.jpg"
          alt=""
        />
        <img
          className="w-[300px] absolute h-[200px] bottom-20 left-0  lg:block hidden"
          src="/assets/images/leaf2.jpg"
          alt=""
        />
        <img className="/assets/images/leaf.jpg" alt="" />
        <img
          className="w-[200px] absolute h-[130px]   top-20 left-20  lg:block hidden"
          src="/assets/images/leaf3.jpg"
          alt=""
        />
        <CustomSwiper data={vegFoods} pagination={true} />
      </div>
      <div className="lg:w-[30vw] lg:center_div_col flex-nowrap flex-col gap-y-4">
        <div className="lg:text-5xl font-bold gap-y-20 text-light_gray lg:center_div justify-center gap-x-2 px-4 lg:px-0">
          <div className="w-[10px] lg:h-[40px]  h-[20px] lg:bg-[#DF9300] rounded-2xl "></div>
          <h1 className="ultraSm:text-xl lg:text-4xl font-bold text-black" style={{ color: fourthColor }}>
            Vegetarian
          </h1>
          <div className="w-[30px] lg:h-[40px]  h-[5px] ultraSm:bg-[#DF9300] lg:hidden xl:hidden 2xl:hidden md:hidden rounded-2xl "></div>
        </div>
        <p className="lg:text-lg !leading-loose text-light_gray font-light pt-4 px-4 text-sm text-start">
          At Green Garden Bistro, vegetarians are in for a treat with a menu
          that elevates plant-based cuisine to a whole new level. The restaurant
          not only caters to vegetarians
        </p>
      </div>
    </div>
  );
};

export default VegFoods;
