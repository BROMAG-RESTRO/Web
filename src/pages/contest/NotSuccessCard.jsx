const NotSuccessCard = () => {
  return (
    <div className="lg:w-[350px] w-full min-h-[400px]  relative bg-[url('/assets/images/notsuccessbg.png')] bg-cover bg-no-repeat rounded-b-2xl">
      <div className="absolute z-30 w-[350px] flex flex-col pt-10 items-center justify-start min-h-full">
        <img
          src="/assets/images/notsuccessimg.png"
          alt=""
          className="!select-none"
        />
        <div className="flex flex-col items-center gap-y-6">
          <div className="flex flex-col gap-y-1 items-center">
            <div className="font-black context_success text-2xl text-white     tracking-wider">
              BELIEVE
            </div>
            <div className="font-medium text-white text-sm tracking-wider">
              Hope you will succeed
            </div>
          </div>
          <div className="flex flex-col gap-y-1 items-center">
            <div className="font-medium text-white text-sm tracking-wider">
              When you try next time
            </div>
            <div className="text-white font-bold">1800 3099 835</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotSuccessCard;
