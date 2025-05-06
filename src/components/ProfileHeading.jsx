/* eslint-disable react/prop-types */
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const ProfileHeading = ({ message }) => {
    const navigate = useNavigate();
    return (
        <div className="flex items-center gap-x-2">
            <IoMdArrowBack
                className="block !cursor-pointer"
                onClick={() => {
                    navigate(-1);
                }}
            />
            <div>
                <h1 className="text-dark_color font-medium lg:text-xl  ">
                    {message} &nbsp;
                </h1>
                <img src="/assets/icons/orderborder.png" alt="" />
            </div>
        </div>
    );
};

export default ProfileHeading;
