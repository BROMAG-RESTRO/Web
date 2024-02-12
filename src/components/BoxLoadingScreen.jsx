/* eslint-disable react/prop-types */
import { Skeleton } from "antd";

const BoxLoadingScreen = ({ loading }) => {
  return (
    <div className="grid xl:grid-cols-3  md:grid-cols-2 lg:grid-cols-2  gap-x-3 gap-y-3 pt-4 ">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((res, index) => {
        return (
          <Skeleton
            loading={loading}
            active
            avatar
            key={index}
            className="md:!w-[320px] min-h-[100px]  !w-[90vw]  !pt-4 border shadow p-4 rounded-lg"
          ></Skeleton>
        );
      })}
    </div>
  );
};

export default BoxLoadingScreen;
