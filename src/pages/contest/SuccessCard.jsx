import { IoMdCloseCircleOutline } from "react-icons/io";

const SuccessCard = () => {
  return (
    <div className="lg:w-[350px] w-full min-h-[400px]  relative">
      <img
        src="/assets/images/success.png"
        alt=""
        className="lg:w-[350px] w-full h-auto absolute z-20"
      />
      <div className="absolute z-30 lg:w-[350px] w-full flex flex-col lg:pt-28 items-center justify-center lg:min-h-full h-[400px]">
      <IoMdCloseCircleOutline className="text-lg" />
        <div className="font-black context_success text-3xl text-white     tracking-wider">
          Congrats
        </div>
        <div className="flex flex-col items-center absolute bottom-0">
          <div>Dail out toll free number on</div>
          <div>1800 3099 835</div>
          <div className="pt-10">For you surprise gifts</div>
        </div>
      </div>
    </div>
  );
};

export default SuccessCard;
