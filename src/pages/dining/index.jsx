import { useEffect, useState } from "react";
import AllCusines from "../online-order/AllCusines";
import { Skeleton, Tag, notification, Card, Modal, Divider } from "antd";
import {
    cancelBooking,
    checkInBooking,
    getAllBookedTables,
    getDiningOrders,
} from "../../helper/api/apiHelper";
import _ from "lodash";
import { Link } from "react-router-dom";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const Dining = () => {
    const [bookedTables, setBookedTables] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [selectedCurrentTable, setSelectedTable] = useState([]);
    const [collectBookingIds, setCollectBookingIds] = useState([]);
    const [orderStatus, setOrderStatus] = useState([]);

    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            setLoading(true);
            const result = await getAllBookedTables();
            const diningOrders = await getDiningOrders();
            let collect = _.get(diningOrders, "data.data", []).map((res) => {
                return res.bookingId;
            });
            setOrderStatus(_.get(diningOrders, "data.data", []));
            setCollectBookingIds(collect);
            let filData = _.get(result, "data.data", []).filter((res) => {
                return res.booking !== "Checkout";
            });
            if (_.isEmpty(filData)) {
                return navigate("/book-my-tables");
            }
            setBookedTables(filData);
        } catch (err) {
            notification.error({ message: "Something went wrong" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (
            localStorage.getItem(
                "chgi5kjieaoyaiackaiw_bbcqgy4akacsaiq_bbcqgyyaq"
            )
        ) {
            fetchData();
        } else {
            return navigate("/book-my-tables");
        }
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
            setLoading(true);
            if (_.get(id, "booking", "") !== "Booked") {
                setSelectedTable(id);
                return setOpenModal(true);
            }
            let formData = {
                booking_id: _.get(id, "_id", ""),
            };
            await checkInBooking(formData);
            notification.success({
                message:
                    "Check-In  status successfully updated not place some order",
            });
            fetchData();
        } catch (err) {
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
        <div className="min-h-screen pb-20">
            {/* table details */}
            <div className="w-screen lg:px-20 px-4 lg:pt-20 pt-10 flex flex-col gap-y-10">
                <div className="flex items-center justify-between">
                    <div className="text-dark3a_color font-semibold lg:text-5xl">
                        Your Reservation
                    </div>
                    {!_.isEmpty(bookedTables) && (
                        <Link to="/book-my-tables">
                            {" "}
                            <Tag
                                color="#DF9300"
                                className="cursor-pointer lg:py-1 lg:px-3 lg:text-[12px] text-[10px]"
                            >
                                Book More...
                            </Tag>{" "}
                        </Link>
                    )}
                </div>
                {/* table */}
                <Skeleton
                    loading={loading}
                    className="lg:!w-[500px] lg:!h-[400px]"
                >
                    <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-x-20 gap-y-10">
                        {bookedTables.map((res, index) => {
                            return (
                                <div key={index}>
                                    <Card
                                        key={index}
                                        className="lg:!w-[350px] !bg-white shadow-lg !w-full"
                                        actions={[getStatus(res)]}
                                        cover={
                                            <img
                                                src={_.get(res, "tablePic", "")}
                                                className="w-[200px] h-[200px]"
                                            />
                                        }
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
                                                            <div className="flex flex-col-reverse gap-y-4 gap-x-2">
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
                                                                    }`}
                                                                >
                                                                    Order Status
                                                                    &nbsp;
                                                                    <span className="text-green-500">
                                                                        {getOrderStatus(
                                                                            res._id
                                                                        )}
                                                                    </span>
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
                </Skeleton>
            </div>
            {/* cusines */}
            <div className="!w-screen">
                <Modal
                    open={openModal}
                    onCancel={() => {
                        setOpenModal(false);
                    }}
                    className="bg-white !w-screen !rounded-lg "
                    footer={false}
                >
                    <AllCusines
                        selectedCurrentTable={selectedCurrentTable || []}
                    />
                </Modal>
            </div>
        </div>
    );
};

export default Dining;
