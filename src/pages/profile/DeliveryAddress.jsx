/* eslint-disable no-empty */
import { Card, Drawer, Empty, Tag, notification } from "antd";
import { useEffect, useState } from "react";
import {
    deleteDeliveryAddress,
    getMyDeliveryAddress,
} from "../../helper/api/apiHelper";
import _ from "lodash";
import ProfileHeading from "../../components/ProfileHeading";
import BoxLoadingScreen from "../../components/BoxLoadingScreen";
import AddNewAddress from "../cart/AddNewAddress";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const DeliveryAddress = () => {
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState([]);
    const [changeRight, setChangeRight] = useState(false);
    const [open, setOpen] = useState(false);
    const [updateId, setUpdateId] = useState("");

    const fetchData = async () => {
        try {
            setLoading(true);
            const result = await getMyDeliveryAddress();
            setAddress(_.get(result, "data.data", []));
        } catch (err) {
            notification.error({ message: "Something went wrong" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDeleteAddress = async (res) => {
        try {
            await deleteDeliveryAddress(res._id);
            notification.success({ message: "Address deleted successfully" });
            fetchData();
        } catch (err) {}
    };

    return (
        <div className="profile_head">
            <div className="w-full flex items-center justify-between">
                <ProfileHeading message={" Your Delivery Address"} />
                <Tag
                    onClick={() => {
                        setOpen(true);
                    }}
                    className={`!px-3 py-1 bg-primary_color text-white cursor-pointer !border-none`}
                >
                    Add New Address
                </Tag>
            </div>
            {loading ? (
                <BoxLoadingScreen loading={loading} />
            ) : _.isEmpty(address) ? (
                <div className="center_div lg:w-[80vw] w-full lg:px-2 min-h-[50vh] items-center ">
                    <Empty
                        description={
                            <span>
                                You currently have no deliver address
                                <br /> add a new one by clicking this link.
                                <span
                                    onClick={() => {
                                        setOpen(true);
                                    }}
                                    className="text-blue-500 cursor-pointer"
                                >
                                    &nbsp;here
                                </span>
                            </span>
                        }
                    />
                </div>
            ) : (
                <div className="profile_cards_grid">
                    {address.map((res, index) => {
                        return (
                            <Card
                                hoverable
                                key={index}
                                className="!min-w-[300px] !min-h-[100px] shadow !cursor-default"
                                loading={loading}
                                actions={[
                                    <EditOutlined
                                        onClick={() => {
                                            setOpen(true);
                                            setUpdateId(res);
                                        }}
                                        key="edit"
                                        className="!text-green-500"
                                    />,
                                    <DeleteOutlined
                                        onClick={() => {
                                            handleDeleteAddress(res);
                                        }}
                                        key="ellipsis"
                                        className="!text-red-500"
                                    />,
                                ]}
                            >
                                <Card.Meta
                                    title={
                                        <div className="capitalize">
                                            {res.name}
                                        </div>
                                    }
                                    description={
                                        <div className="flex flex-col gap-y-2">
                                            <p>
                                                <span className="font-bold">
                                                    contact number
                                                </span>{" "}
                                                : &nbsp; {res.mobileNumber}
                                            </p>
                                            <p>
                                                <span className="font-bold">
                                                    Address Type
                                                </span>{" "}
                                                : &nbsp; {res.addressType}
                                            </p>
                                            <p>
                                                <span className="font-bold">
                                                    street name
                                                </span>{" "}
                                                : &nbsp; {res.streetName}
                                            </p>
                                            <p>
                                                <span className="font-bold">
                                                    landmark
                                                </span>{" "}
                                                : &nbsp; {res.landMark}
                                            </p>
                                            <p>
                                                <span className="font-bold">
                                                    state
                                                </span>{" "}
                                                : &nbsp; {res.customerState}
                                            </p>
                                            <p>
                                                <span className="font-bold">
                                                    piccode
                                                </span>{" "}
                                                : &nbsp; {res.picCode}
                                            </p>
                                        </div>
                                    }
                                />
                            </Card>
                        );
                    })}
                </div>
            )}
            <Drawer
                open={open}
                onClose={() => {
                    setOpen(false);
                    setChangeRight(false);
                    setUpdateId("");
                }}
                destroyOnClose
                width={500}
                title="Enter New Address"
            >
                <div className="lg:px-10 px-4">
                    <AddNewAddress
                        setChangeRight={setChangeRight}
                        setOpen={setOpen}
                        changeRight={changeRight}
                        fetchData={fetchData}
                        updateId={updateId}
                    />
                </div>
            </Drawer>
        </div>
    );
};

export default DeliveryAddress;
