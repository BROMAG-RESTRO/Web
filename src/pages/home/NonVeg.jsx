/* eslint-disable react/prop-types */
import _ from "lodash";
import { useEffect, useState } from "react";
import CustomSwiper from "../../components/CustomSwiper";
import { useSelector } from "react-redux";

const NonVeg = ({ nonVegFoods }) => {
  const [nonvegFoods, setNonvegFoods] = useState([]);
  const { fourthColor } = useSelector((state) => state.auth);

  useEffect(() => {
    setNonvegFoods(
      _.shuffle(nonVegFoods).filter((res) => {
        return res.name === "Non Vegetarian Banner";
      })
    );
  }, []);

  return (
    <div className="w-screen lg:min-h-[90vh] flex lg:flex-row justify-center items-center flex-nowrap flex-col pt-4 gap-y-6">
      <div className="lg:w-[30vw] lg:center_div_col flex-nowrap flex-col gap-y-4">
        <div className="lg:text-6xl font-bold gap-y-20 text-light_gray lg:center_div justify-center gap-x-2 lg:px-0 px-4">
          <div className="w-[10px] lg:h-[40px]  h-[20px] lg:bg-[#DF9300] rounded-2xl "></div>
          <h1 className="ultraSm:text-xl lg:text-4xl font-bold text-black" style={{ color: fourthColor }}>
            Non-Veg
          </h1>
          <div className="w-[30px] lg:h-[40px]  h-[5px] ultraSm:bg-[#DF9300] lg:hidden xl:hidden 2xl:hidden md:hidden rounded-2xl "></div>
        </div>
        <p className="lg:text-lg !leading-loose text-light_gray font-light pt-4 text-sm px-4 text-start">
          Dare to indulge in the fiery allure of our spicy chicken wings, glazed
          in a secret house-made hot sauce. Accompanied by cool cucumber raita
          for the perfect balance.
        </p>
      </div>
      <div className="lg:w-[60vw] w-screen relative lg:h-[80vh] center_div">
        <img
          className="w-[300px] absolute top-10 right-0 lg:block hidden"
          src="https://gallery.yopriceville.com/var/albums/Free-Clipart-Pictures/Vegetables-PNG/Red_Chili_Pepper_Transparent_PNG_Clip_Art_Image.png?m=1456458901"
          alt=""
        />
        <img
          className="w-[300px] absolute h-[200px] bottom-20 left-0 lg:block hidden"
          src="https://static.vecteezy.com/system/resources/previews/027/214/961/original/red-chili-red-chili-transparent-background-ai-generated-free-png.png"
          alt=""
        />
        <CustomSwiper data={nonvegFoods} pagination={true} />
      </div>
    </div>
  );
};

export default NonVeg;
