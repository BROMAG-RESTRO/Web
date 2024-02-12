/* eslint-disable react/prop-types */
import { Empty } from "antd";
import { useNavigate } from "react-router-dom";

const EmptyScreen = ({ message, links }) => {
  const navigate = useNavigate();
  return (
    <Empty
      description={
        <span>
          {message}
          <span
            onClick={() => {
              navigate(links);
            }}
            className="text-blue-500 cursor-pointer"
          >
            &nbsp;here
          </span>
        </span>
      }
    />
  );
};

export default EmptyScreen;
