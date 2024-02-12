/* eslint-disable no-empty */
import {
  Avatar,
  Badge,
  Card,
  Divider,
  Drawer,
  Skeleton,
  notification,
  message,
  Tag,
} from "antd";
import { useEffect, useState } from "react";
import { getMyTakeAwayOrder, cancelMyOrder } from "../../helper/api/apiHelper";

import _ from "lodash";
import moment from "moment";
import EmptyScreen from "../../components/EmptyScreen";
import ProfileHeading from "../../components/ProfileHeading";

import BoxLoadingScreen from "../../components/BoxLoadingScreen";
import {
  disabledDate,
  tenMinDisabledDates,
  thirtyMinDisabledDates,
  twantyMinDisabledDates,
} from "../../helper/validation";
import { IoFastFoodOutline } from "react-icons/io5";
import CountdownTimer from "../../components/CountdownTimer";

const TakeAwayOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentSelected, setCurrentSelected] = useState([]);
  const [dummy, setDummy] = useState(false);
  const [instructions, setInstructions] = useState({});

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await getMyTakeAwayOrder();
      setOrders(_.get(result, "data.data", []));
    } catch (err) {
      notification.error({ message: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleCancelOrder = async (value) => {
    try {
      let formData = {
        order_type: "takeaway",
      };
      await cancelMyOrder(_.get(value, "_id", ""), formData);
      message.success("Order cancelled");
      fetchData();
    } catch (err) {}
  };

  const getStatus = (data) => {
    switch (data.status) {
      case "Cancelled":
        return (
          <div className="text-red-500 font-bold  lg:text-[15px] text-[12px]">
            Order Cancelled
          </div>
        );
      case "Order accepted":
        return (
          <div className="flex justify-evenly">
            <div
              onClick={() => {
                handleCancelOrder(data);
              }}
              className="font-bold  text-red-500 lg:text-[15px] text-[12px]"
            >
              Cancel
            </div>
            <Divider type="vertical" />
            <div className="text-green-500 font-bold  lg:text-[15px] text-[12px]">
              Order Accepted
            </div>
          </div>
        );
      case "Order placed":
        return (
          <div className="flex justify-evenly">
            <div
              onClick={() => {
                handleCancelOrder(data);
              }}
              className="font-bold  text-red-500 lg:text-[15px] text-[12px]"
            >
              Cancel
            </div>
            <Divider type="vertical" />
            <div className="text-green-500 font-bold  lg:text-[15px] text-[12px]">
              Order placed
            </div>
          </div>
        );
      case "Delivered":
        return (
          <div className="flex justify-center">
            <div className="text-green-500 font-bold  lg:text-[15px] text-[12px]">
              Order Delivered
            </div>
          </div>
        );
      case "Order moved to KDS":
        return (
          <div
            className={`flex ${
              new Date(disabledDate(data.updatedAt)) > new Date()
                ? "justify-evenly"
                : "justify-center"
            } `}
          >
            <div className="text-dark_color  font-bold  lg:text-[15px] text-[12px]">
              {new Date(disabledDate(data.updatedAt)) > new Date() && (
                <div
                  className="text-red-500"
                  onClick={() => {
                    handleCancelOrder(data);
                  }}
                >
                  cancel
                </div>
              )}
            </div>
            {new Date(disabledDate(data.updatedAt)) > new Date() && (
              <Divider type="vertical" />
            )}
            <div className="text-green-400 font-bold  lg:text-[15px] text-[12px]">
              Order moved to Kitchen
            </div>
          </div>
        );
      case "Order ready to preparing":
        return (
          <div>
            {new Date(disabledDate(data?.updatedAt)) > new Date() && (
              <Divider type="vertical" />
            )}
            <div className="text-green-400 font-bold  lg:text-[15px] text-[12px]">
              Preparing
            </div>
          </div>
        );
      case "Order ready to pack":
        return (
          <div className="flex justify-evenly">
            <div
              className="text-dark_color font-bold  lg:text-[15px] text-[12px]"
              onClick={() => {
                setCurrentSelected(data);
              }}
            >
              View Menu
            </div>
            <div className="text-green-400 font-bold  lg:text-[15px] text-[12px]">
              Order ready to pack
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <div className="profile_head">
        <div className="w-full">
          <ProfileHeading message={" Your Take Away Orders"} />
        </div>
        {loading ? (
          <BoxLoadingScreen loading={loading} />
        ) : _.isEmpty(orders) ? (
          <div className="center_div lg:w-[80vw] w-full lg:px-2 min-h-[50vh] items-center ">
            <EmptyScreen
              message={
                <div>
                  You currently have no take away orders
                  <br /> add a new one by clicking
                </div>
              }
              links={"/take-away"}
            />
          </div>
        ) : (
          <div className="profile_cards_grid">
            {orders.map((res, index) => {
              return (
                <div className=" !w-[98%] m-auto" key={index}>
                  <Badge.Ribbon
                    className="w-fit"
                    placement="start"
                    color="#DF9300"
                    text={` ₹ ${_.get(res, "billAmount", "")}`}
                    key={index}
                  >
                    <Card
                      hoverable
                      key={index}
                      className="lg:w-[350px] xl:!w-[320px]  min-h-[100px] shadow-lg bg-white !pt-4 !cursor-default relative"
                      actions={[
                        [
                          "Cancelled",
                          "Delivered",
                          "Order moved to KDS",
                          "Order accepted",
                          "Order placed",
                          "Order ready to preparing",
                          "Order ready to pack",
                        ].includes(res.status) ? (
                          getStatus(res)
                        ) : (
                          <div className="flex justify-evenly">
                            <div
                              className="text-dark_color  font-bold lg:text-[15px] text-[12px]"
                              onClick={() => {
                                setCurrentSelected(res);
                              }}
                            >
                              View Menu
                            </div>
                            <Divider type="vertical" />
                            <div className="text-green-400 !font-bold lg:text-[15px] text-[12px]">
                              {_.get(res, "status", "")}
                            </div>
                          </div>
                        ),
                      ]}
                    >
                      <Skeleton loading={loading}>
                        <Card.Meta
                          avatar={
                            <Avatar
                              src={_.get(res, "orderedFood[0].pic", "")}
                              className="!w-[50px] !h-[50px] !rounded-lg !shadow-inner"
                            />
                          }
                          title={
                            <p className="text-ellipsis overflow-hidden">
                              {_.get(res, "orderedFood[0].foodName", "")}
                            </p>
                          }
                          description={
                            <div className="text-[12px]">
                              {moment(res.createdAt).format("llll")}
                            </div>
                          }
                        />
                      </Skeleton>
                      <Tag
                        className="absolute top-1 right-1 px-2 py-1 flex items-center gap-x-1 cursor-pointer"
                        color="green"
                        onClick={() => {
                          setCurrentSelected(res);
                          setInstructions(res.instructionsTakeaway);
                        }}
                      >
                        <IoFastFoodOutline />
                        <span className="!text-[10px]">View Menus</span>
                      </Tag>
                      {_.get(res, "status", "") ===
                        "Order ready to preparing" && (
                        <div className="absolute bottom-12 left-6 bg-white">
                          {res.timePicked === "600" && (
                            <CountdownTimer
                              setDummy={setDummy}
                              dummy={dummy}
                              endDate={tenMinDisabledDates(res.updatedAt)}
                              title={"Your food is preparing... "}
                            />
                          )}
                          {res.timePicked === "1200" && (
                            <CountdownTimer
                              setDummy={setDummy}
                              dummy={dummy}
                              endDate={twantyMinDisabledDates(res.updatedAt)}
                              title={"Your food is preparing... "}
                            />
                          )}
                          {res.timePicked === "1800" && (
                            <CountdownTimer
                              setDummy={setDummy}
                              dummy={dummy}
                              endDate={thirtyMinDisabledDates(res.updatedAt)}
                              title={"Your food is preparing... "}
                            />
                          )}
                        </div>
                      )}
                      {new Date(disabledDate(res.updatedAt)) > new Date() &&
                        _.get(res, "status", "") === "Order moved to KDS" && (
                          <div className="absolute bottom-12  left-6">
                            <CountdownTimer
                              setDummy={setDummy}
                              dummy={dummy}
                              endDate={new Date(disabledDate(res.updatedAt))}
                              title={"Time remaining to cancel the order"}
                            />
                          </div>
                        )}
                    </Card>
                  </Badge.Ribbon>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Drawer
        title={
          <div className="flex text-sm lg:text-lg">{`OrderId ${_.get(
            currentSelected,
            "orderId",
            ""
          )}`}</div>
        }
        open={!_.isEmpty(currentSelected)}
        onClose={() => {
          setCurrentSelected([]);
        }}
        placement="left"
      >
        <div className="px-2 text-black">
          <div className="rounded-lg  relative ">
            <p className="text-dark3a_color text-lg font-bold">Order Summary</p>
            <br />
            <div className="bg-[#F2F2F2] px-4 py-4 flex flex-col gap-y-5">
              <div className="flex items-center justify-between border-b-2">
                <p>Total Items</p>{" "}
                {_.get(currentSelected, "orderedFood", []).length}
              </div>
              <div className="flex items-center justify-between border-b-2">
                <p>Items Price</p> &#8377;{" "}
                {_.get(currentSelected, "item_price", [])}
              </div>
              <div className="flex items-center justify-between border-b-2">
                <p>Total GST</p> &#8377; {_.get(currentSelected, "gst", [])}
              </div>
              <div className="flex items-center justify-between border-b-2">
                <p>Packing Charage</p> &#8377;{" "}
                {_.get(currentSelected, "packing_charge", [])}
              </div>
              <div className="flex items-center justify-between border-b-2">
                <p>Transaction Charage</p> &#8377;{" "}
                {_.get(currentSelected, "transaction_charge", [])}
              </div>
              <div className="flex items-center justify-end gap-x-2">
                <p>Total :</p> &#8377;{" "}
                {_.get(currentSelected, "billAmount", [])}
              </div>
            </div>
          </div>
        </div>
        <br />
        <div className="flex flex-col gap-y-2 px-2 text-black">
          <p className="text-dark3a_color text-lg font-bold">Menus</p>
          {_.get(currentSelected, "orderedFood", []).map((res, index) => {
            return (
              <Card loading={loading} key={index}>
                <Card.Meta
                  avatar={
                    <Avatar
                      src={_.get(res, "pic", "")}
                      className="!w-[80px] !h-[80px] !rounded-lg"
                    />
                  }
                  title={
                    <div className="capitalize">
                      {_.get(res, "foodName", "")}
                    </div>
                  }
                  description={
                    <div>
                      {_.get(res, "foodQuantity", "")} &times; ₹
                      {_.get(res, "originalPrice", "")} -{res.type}
                    </div>
                  }
                />
                <div className="mt-3 rounded-md bg-slate-100 px-2 h-[100px] overflow-y-auto">
                  <p className="py-1 font-bold">Instructions*</p>
                  {currentSelected?.instructionsTakeaway?.map(
                    (takeaway, idx) => (
                      <div key={idx}>
                        {Object.entries(takeaway).map(([id, instructions]) => (
                          <div key={id}>
                            {instructions?.map((instruction, index) => (
                              <p key={index} className="text-sm">
                                - {instruction}
                              </p>
                            ))}
                          </div>
                        ))}
                      </div>
                    )
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </Drawer>
    </>
  );
};

export default TakeAwayOrders;
