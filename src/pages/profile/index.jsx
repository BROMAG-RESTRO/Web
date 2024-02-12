import {
  Avatar,
  Card,
  Divider,
  Drawer,
  Popconfirm,
  Spin,
  notification,
} from "antd";
import React, { useEffect, useState } from "react";
import { logoutCurrentUser } from "../../helper/api/apiHelper";
import { useHref, useNavigate } from "react-router-dom";
import _ from "lodash";
import OnlineOrders from "./OnlineOrders";
import TakeAwayOrders from "./TakeAwayOrders";
import BookedTables from "./BookedTables";
import DeliveryAddress from "./DeliveryAddress";
import {
  MdOnlinePrediction,
  MdOutlineMenu,
  MdOutlineMenuOpen,
  MdOutlineTableBar,
} from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import { SiWebmoney } from "react-icons/si";
import { TbTruckDelivery } from "react-icons/tb";
import { IoIosCall, IoMdLogOut } from "react-icons/io";
import { MdFeedback } from "react-icons/md";
import YourReview from "./YourReview";
import CallforOrders from "./CallforOrders";
import { GiCardPickup } from "react-icons/gi";
import YourContext from "./YourContext";
import { CgProfile } from "react-icons/cg";
import axios from "axios";
import MyProfile from "./MyProfile";
import ProfileCard from "./ProfileCard";
import { useSelector } from "react-redux";

const Profile = () => {
  const navigate = useNavigate();
  const { thirdColor } = useSelector((state) => state.auth);
  const refPage = useHref();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  let orderTypes = [
    {
      id: 1,
      name: "Your Online Orders",
      component: <OnlineOrders />,
      icon: <SiWebmoney />,
      goto: "/profile-online-order",
    },
    {
      id: 2,
      name: "Your Take Away Orders",
      component: <TakeAwayOrders />,
      icon: <FaShoppingCart />,
      goto: "/profile-take-away-order",
    },
    {
      id: 3,
      name: "Your Call for Orders",
      component: <CallforOrders />,
      icon: <IoIosCall />,
      goto: "/profile-call-for-order",
    },
    // {
    //   id: 4,
    //   name: "Your  Table Bookings",
    //   component: <BookedTables />,
    //   icon: <MdOutlineTableBar />,
    //   goto: "/profile-table-booking",
    // },
    {
      id: 5,
      name: "Your Delivery Address",
      component: <DeliveryAddress />,
      icon: <TbTruckDelivery />,
      goto: "/profile-delivery-address",
    },
    {
      id: 6,
      name: "Your Review",
      component: <YourReview />,
      icon: <MdFeedback />,
      goto: "/profile-my-reviews",
    },
    {
      id: 7,
      name: "Your Contest",
      component: <YourContext />,
      icon: <GiCardPickup />,
      goto: "/profile-my-contest",
    },
    {
      id: 8,
      name: "My Account",
      component: <MyProfile />,
      icon: <CgProfile />,
      goto: "/my-account",
    },
  ];

  const navs = () => {
    return (
      <div className="w-full ">
        <div className="lg:bg-white bg-light_white w-full min-h-[200px] rounded-lg   py-2 lg:px-0">
          {orderTypes.map((res, index) => {
            return (
              <div
                key={index}
                className={`w-full  rounded-lg  hover:lg:bg-primary_color lg:shadow-lg ${
                  refPage === res.goto
                    ? "lg:bg-primary_color lg:!text-white"
                    : "bg-white !text-black"
                }`}
              >
                <div
                  onClick={() => {
                    navigate(res.goto);
                  }}
                  key={index}
                  className={`h-[50px] lg:text-sm text-[12px] !w-full line-clamp-1  flex cursor-pointer font-bold tracking-wider items-center !pl-4  m-1 px-1 rounded `}
                >
                  {res?.icon} &nbsp;&nbsp;
                  <h1 className="!overflow-hidden  line-clamp-1 !text-ellipsis  ">
                    {" "}
                    {res?.name}
                  </h1>
                </div>
                <hr />
              </div>
            );
          })}
        </div>
        {/* <div className="mt-2">
          <Popconfirm
            title={"Are you sure you want to proceed with logging out?"}
            onConfirm={handleLogout}
          >
            <div className="bg-white hover:bg-red-500 group hover:!text-white cursor-pointer min-h-[50px] text-red-500 rounded-lg center_div">
              <IoMdLogOut className="!text-red-500 group-hover:!text-white" />{" "}
              &nbsp; Logout
            </div>
          </Popconfirm>
        </div> */}
      </div>
    );
  };

  return (
    <div className="lg:w-[20vw] lg:bg-white bg-light_white  flex flex-col  min-h-screen lg:pt-0 pt-2 px-2">
      <ProfileCard />
      <div className=" rounded-lg gap-y-10 lg:block "> {navs()}</div>
    </div>
  );
};

export default Profile;
