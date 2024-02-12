import  { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import _ from "lodash";
import {
  Avatar,
  Button,
  Card,
  Divider,
  Modal,
  Radio,
  Tag,
  notification,
} from "antd";
import {
  getFilteredDiningOrders,
  updateBoockings,
} from "../../helper/api/apiHelper";
import { IoMdArrowBack } from "react-icons/io";

const DiningPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [allOrders, setAllOrders] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [loadingPlaceOrder, setLoadingPlaceOrder] = useState(false);
  const [modal, contextHolder] = Modal.useModal();

  const fetchData = async () => {
    try {
      let booking_id = _.get(location, "state.bookingId._id", "");
      const result = await getFilteredDiningOrders(booking_id);
      setAllOrders(_.get(result, "data.data", ""));
    } catch (err) {
      notification.error({ message: "Something went wrong" });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClick = () => {
    modal.confirm({
      title: "This is a confirmation message",
      content: `If you proceed to checkout, you won't be able to place more orders.`,
      style: { background: "white", borderRadius: "10px" },
      cancelText : "Cancel",
      onOk: () => {
        setViewModal(true);
      },
    });
  };

  const handlePlaceOrder = async () => {
    try {
      setLoadingPlaceOrder(true);
      let formdata = {
        booking_id: _.get(location, "state.bookingId._id", ""),
        table_id: _.get(location, "state.bookingId.tableId", ""),
      };
      await updateBoockings(formdata);
      notification.success({ message: "Thank you" });
      navigate("/dining");
    } catch (err) {
      notification.error({ message: "Something went wrong" });
    } finally {
      setLoadingPlaceOrder(false);
    }
  };

  return (
    <div className="min-h-screen lg:px-20 px-4 pb-20">
      {/* table details */}
      <div className="lg:pt-20 pt-10 flex justify-between items-center">
        <div className="flex items-center gap-x-2">
          <IoMdArrowBack
            className="cursor-pointer"
            onClick={() => {
              navigate(-1);
            }}
          />
          <div>
            <h1 className="text-dark_color font-medium lg:text-xl ">
              Your Bill
            </h1>
            <img src="/assets/icons/orderborder.png" alt="" />
          </div>
        </div>
        <div className="flex items-center gap-x-4 ">
          <h1 className="text-dark3a_color font-bold text-sm lg:text-lg">
            Table {_.get(location, "state.bookingId.tableNo", "")}
          </h1>
          <div className="lg:block hidden">
            {_.get(location, "state.bookingId.booking", "") !== "Checkout" && (
              <Tag
                onClick={handleClick}
                color="green"
                className="cursor-pointer px-2 py-1"
              >
                Checkout and pay amount
              </Tag>
            )}
          </div>
        </div>
      </div>
      <Divider />
      <div className="pt-10 flex flex-col gap-y-10">
        {allOrders.map((res, index) => {
          return (
            <div key={index}>
              <h1 className="font-bold lg:text-lg text-sm">
                order: {index + 1}
              </h1>
              <div className="flex justify-between lg:pt-10 pt-4 lg:flex-row w-full flex-col gap-y-4">
                <div className="w-full">
                  <div className="flex flex-wrap gap-x-10 gap-y-10 w-full">
                    {_.get(res, "orderedFood", []).map((res, index) => {
                      return (
                        <div key={index}>
                          <Card className="lg:min-w-[300px] w-full items-center shadow-inner">
                            <Card.Meta
                              avatar={
                                <Avatar
                                  src={res.pic}
                                  className="w-[80px] h-[80px]"
                                />
                              }
                              title={res.foodName}
                              description={<div>&times;{res.foodQuantity}</div>}
                            />
                          </Card>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <div className="bg-[#F2F2F2] lg:w-[500px] min-h-[100px]  rounded-2xl lg:p-10 p-5 relative">
                    <div className="flex  justify-between pt-4 border-b border-[#C1C1C1]">
                      <div className="flex gap-x-2">
                        <div className="text-[#3F3F3F] font-normal text-sm lg:text-lg">
                          Item price
                        </div>{" "}
                      </div>
                      <div className="lg:text-lg text-sm text-[#3A3A3A]">
                        &#8377; {_.get(res, "item_price", 0)}
                      </div>
                    </div>
                    {/* gst */}
                    <div className="flex  justify-between pt-4 border-b border-[#C1C1C1] text-sm lg:text-lg">
                      <div className="flex gap-x-2">
                        <div className="text-[#3F3F3F] font-normal">Gst</div>{" "}
                      </div>
                      <div className=" text-[#3A3A3A]">
                        &#8377; {_.get(res, "gst", 0)}
                      </div>
                    </div>
                    {/* total amount */}
                    <div className="flex  justify-between pt-6 text-sm lg:text-lg">
                      <div className="flex gap-x-2">
                        <div className="text-[#3F3F3F] font-normal">
                          Total Amount
                        </div>
                      </div>
                      <div className=" text-[#3A3A3A] font-medium">
                        &nbsp; &#8377; {_.get(res, "billAmount", 0)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <br />
      <Divider />
      <div className="flex items-center lg:justify-end  justify-center h-[100px] px-10">
        <h1 className="font-bold">Total Amount : &nbsp;</h1>
        <h1 className="font-bold">
          &#8377;
          {_.sum(
            allOrders.map((res) => {
              return res.billAmount;
            })
          ).toFixed(2)}
        </h1>
      </div>
      <Divider />
      <div className="lg:hidden block">
        <div className="center_div">
          {_.get(location, "state.bookingId.booking", "") !== "Checkout" && (
            <Tag
              onClick={handleClick}
              color="green"
              className="cursor-pointer px-2 py-1"
            >
              Checkout and pay amount
            </Tag>
          )}
        </div>
      </div>
      <Modal
        open={viewModal}
        closable={false}
        footer={false}
        className="bg-black rounded-2xl"
        onCancel={() => {
          setViewModal(false);
        }}
      >
        <div className="flex flex-col gap-y-10 justify-start pt-4 !text-white !rounded-2xl bg-black lg:px-10 py-10">
          <Radio value={1} checked={true} className="!text-white !pt-10">
            Cash
          </Radio>
          <Radio disabled className="!text-white">
            Credit / Debit / ATM Card
          </Radio>
          <Radio disabled className="!text-white">
            Net Banking
          </Radio>
          <Button
            onClick={handlePlaceOrder}
            loading={loadingPlaceOrder}
            className=" hover:!text-white min-w-[200px] center_div  border-none min-h-[50px] text-md bg-primary_color rounded-lg text-white mt-4"
          >
            Checkout & Pay Now
          </Button>
        </div>
      </Modal>
      {contextHolder}
    </div>
  );
};

export default DiningPayment;
