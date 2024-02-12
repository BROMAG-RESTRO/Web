import { Card, Divider, Empty, Modal, Skeleton, Tag, notification } from "antd";
import _ from "lodash";
import { useState } from "react";
import { useEffect } from "react";
import {
    cancelBooking,
    checkInBooking,
    getDiningOrders,
    getMyProfileDining,
} from "../../helper/api/apiHelper";
import { Link } from "react-router-dom";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import AllCusines from "../online-order/AllCusines";
import ProfileHeading from "../../components/ProfileHeading";
import BoxLoadingScreen from "../../components/BoxLoadingScreen";

const BookedTables = () => {
    const [loading, setLoading] = useState(false);
    const [bookingDetails, setBookedTables] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedCurrentTable, setSelectedTable] = useState([]);
    const [collectBookingIds, setCollectBookingIds] = useState([]);
    const [orderStatus, setOrderStatus] = useState([]);

    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            setLoading(true);
            const result = await getMyProfileDining();
            setBookedTables(_.get(result, "data.data", []));
            const diningOrders = await getDiningOrders();
            let collect = _.get(diningOrders, "data.data", []).map((res) => {
                return res.bookingId;
            });
            setOrderStatus(_.get(diningOrders, "data.data", []));
            setCollectBookingIds(collect);
        } catch (err) {
            notification.error({ message: "Something went wrong" });
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    const handleCancelTable = async (id) => {
        try {
            setLoading(true);
            let formData = {
                booking_id: _.get(id, "_id", ""),
                table_id: _.get(id, "tableId", ""),
            };
            await cancelBooking(formData);
            notification.success({ message: "Booking successfully cancelled" });
            fetchData();
        } catch (err) {
            notification.error({ message: "Failed to cancel table" });
        } finally {
            setLoading(false);
        }
    };

    const handleCheckin = async (id) => {
        try {
            if (_.get(id, "booking", "") !== "Booked") {
                setSelectedTable(id);
                return setOpenModal(true);
            }
            setLoading(true);
            let formData = {
                booking_id: _.get(id, "_id", ""),
            };
            await checkInBooking(formData);
            notification.success({
                message:
                    "Check-In  status successfully updated now place some order",
            });
            fetchData();
        } catch (err) {
            console.log(err);
            notification.error({ message: "Failed to checkin try again" });
        } finally {
            setLoading(false);
        }
    };

    const handleViewBills = (id) => {
        navigate("/dining-payment", { state: { bookingId: id } });
    };

    const getOrderStatus = (id) => {
        let getFilterData = orderStatus.filter((res) => {
            return res.bookingId === id;
        });
        return _.get(getFilterData, "[0].status", "");
    };

    const getStatus = (data) => {
        switch (data.booking) {
            case "Canceled":
                return <div className="text-red-500 font-bold">Cancelled</div>;

            case "Checkout":
                return (
                    <div className="flex justify-evenly">
                        <div
                            className="text-dark_color font-bold"
                            onClick={() => {
                                handleViewBills(data);
                            }}
                        >
                            View Bill
                        </div>
                        {/* <Divider type="vertical" />
            <div className="text-red-500 font-bold">Checkout</div> */}
                    </div>
                );
            case "Booked":
                return (
                    <div className="flex justify-evenly">
                        <div
                            className="font-bold text-red-500"
                            onClick={() => {
                                handleCancelTable(data);
                            }}
                        >
                            Cancel
                        </div>
                        <Divider type="vertical" />
                        <div
                            onClick={() => handleCheckin(data)}
                            className="text-green-500 font-bold"
                        >
                            Checkin
                        </div>
                    </div>
                );
            case "CheckIn":
                return (
                    <div className="flex justify-evenly">
                        {collectBookingIds.includes(data._id) && (
                            <>
                                <div
                                    className="text-dark_color  font-bold"
                                    onClick={() => {
                                        handleViewBills(data);
                                    }}
                                >
                                    View Bill
                                </div>
                                <Divider type="vertical" />
                            </>
                        )}
                        <div
                            onClick={() => handleCheckin(data)}
                            className="text-orange-500 font-bold"
                        >
                            Browse{" "}
                            {collectBookingIds.includes(data._id)
                                ? "More"
                                : "Your"}{" "}
                            Food
                        </div>
                    </div>
                );
        }
    };

    return (
        <>
            <div className="profile_head">
                <div className="w-full flex  justify-between">
                    <ProfileHeading message={"Your Reservation"} />
                    <Link to="/book-my-tables">
                        <Tag
                            className={`!px-3 py-1 bg-primary_color text-white ${
                                _.isEmpty(bookingDetails) ? "hidden" : "block"
                            } cursor-pointer !border-none`}
                        >
                            Book Now
                        </Tag>
                    </Link>
                </div>
                {loading ? (
                    <BoxLoadingScreen loading={loading} />
                ) : _.isEmpty(bookingDetails) ? (
                    <div className="center_div lg:w-[80vw] w-full lg:px-2 min-h-[50vh] items-center ">
                        <Empty
                            description={
                                <span>
                                    Reserve now as tables were not booked.
                                    <Link to="/book-my-tables">
                                        <span className="text-blue-500">
                                            &nbsp;here
                                        </span>
                                    </Link>
                                </span>
                            }
                        />
                    </div>
                ) : (
                    <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1  gap-x-4 gap-y-4 pt-4 w-full">
                        {bookingDetails.map((res, index) => {
                            return (
                                <div key={index}>
                                    <Card
                                        hoverable
                                        cover={
                                            <img
                                                src={_.get(res, "tablePic", "")}
                                                className="w-[200px] h-[200px] !cursor-default"
                                            />
                                        }
                                        key={index}
                                        className="!min-w-[300px] !bg-white shadow-lg"
                                        actions={[getStatus(res)]}
                                    >
                                        <Skeleton
                                            loading={loading}
                                            avatar
                                            active
                                        >
                                            <Card.Meta
                                                title={
                                                    <div className="flex flex-col gap-y-1">
                                                        <h1 className="capitalize text-2xl">
                                                            {_.get(
                                                                res,
                                                                "customerName",
                                                                ""
                                                            )}
                                                        </h1>
                                                        <h2 className="text-[#4D4D4D] font-semibold text-xl">
                                                            Table{" "}
                                                            {_.get(
                                                                res,
                                                                "tableNo",
                                                                ""
                                                            )}
                                                        </h2>
                                                    </div>
                                                }
                                                description={
                                                    <div className="flex flex-col gap-y-1">
                                                        <p className="">
                                                            {_.get(
                                                                res,
                                                                "noOfGuest",
                                                                ""
                                                            )}{" "}
                                                            members
                                                        </p>
                                                        <div className="text-[#4D4D4D] ">
                                                            <p className=" text-[#494949] text-sm">
                                                                Timing:&nbsp;
                                                                {_.isDate(
                                                                    _.get(
                                                                        res,
                                                                        "timeSlot",
                                                                        ""
                                                                    )
                                                                )
                                                                    ? moment(
                                                                          _.get(
                                                                              res,
                                                                              "timeSlot",
                                                                              ""
                                                                          )
                                                                      ).format(
                                                                          "hh:mma, MMM Do"
                                                                      )
                                                                    : _.get(
                                                                          res,
                                                                          "timeSlot",
                                                                          ""
                                                                      )}
                                                            </p>
                                                            <div className="flex text-[#494949] text-sm">
                                                                Booking ID:{" "}
                                                                {_.get(
                                                                    res,
                                                                    "_id",
                                                                    ""
                                                                )}
                                                            </div>
                                                            <br />
                                                            <div className="flex gap-x-2 flex-col-reverse gap-y-2">
                                                                <div className=" text-[10px] rounded-md  cursor-pointer w-fit px-2 py-1 bg-[#00000099] text-[#E5E5E5]">
                                                                    View
                                                                    Location
                                                                </div>

                                                                <div
                                                                    className={`${
                                                                        collectBookingIds.includes(
                                                                            res._id
                                                                        )
                                                                            ? "visible"
                                                                            : "invisible"
                                                                    } h-[40px]`}
                                                                >
                                                                    {collectBookingIds.includes(
                                                                        res._id
                                                                    ) && (
                                                                        <div>
                                                                            Order
                                                                            Status
                                                                            &nbsp;
                                                                            <span className="text-green-500">
                                                                                {res.booking !==
                                                                                "Checkout"
                                                                                    ? getOrderStatus(
                                                                                          res._id
                                                                                      )
                                                                                    : "Order Served"}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                            />
                                        </Skeleton>
                                    </Card>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            <div className=" center_div">
                <Modal
                    open={openModal}
                    onCancel={() => {
                        setOpenModal(false);
                    }}
                    className="bg-white !w-screen !rounded-lg"
                    footer={false}
                >
                    <AllCusines
                        selectedCurrentTable={selectedCurrentTable || []}
                    />
                </Modal>
            </div>
        </>
    );
};

export default BookedTables;
