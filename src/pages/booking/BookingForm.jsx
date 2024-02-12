/* eslint-disable react/prop-types */
import {
    Button,
    DatePicker,
    Form,
    Input,
    Select,
    TimePicker,
    notification,
} from "antd";
import { useEffect, useState } from "react";
import {
    minimumCountValidation,
    phoneNumberValidation,
} from "../../helper/validation";
import _ from "lodash";
import { bookMyTables, tokenVerification } from "../../helper/api/apiHelper";
import { useNavigate } from "react-router-dom";
import { PhoneInput } from "react-international-phone";
import moment from "moment";

import { CalendarOutlined, FieldTimeOutlined } from "@ant-design/icons";

const BookingForm = ({ tableDatas }) => {
    const [form] = Form.useForm();

    const { TextArea } = Input;

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [dummy, setDummy] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const userDeails = await tokenVerification();
            form.setFieldsValue({
                customerName: _.get(userDeails, "data.data[0].user", "") || 0,
                contactNumber:
                    _.get(userDeails, "data.data[0].phoneNumber", "") || 0,
                alterateContactNumber:
                    _.get(userDeails, "data.data[0].alter_mobile_number", "") ||
                    0,
            });
        } catch (err) {
            console.log(err);
            notification.error({ message: "Something went wrong" });
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (
            localStorage.getItem(
                "chgi5kjieaoyaiackaiw_bbcqgy4akacsaiq_bbcqgyyaq"
            )
        ) {
            fetchData();
        } else {
            navigate("/");
        }
    }, []);

    const handleFinish = async (values) => {
        try {
            setLoading(true);

            values.timeSlot = `${moment(new Date(values.diningDate)).format(
                "LL"
            )} ${moment(new Date(values.diningTime)).format("hh:mm A")}`;

            values.booking = "Booked";
            values.tableNo = _.get(tableDatas, "tableNo", "");
            values.tableId = _.get(tableDatas, "_id", "");
            values.tablePic = _.get(tableDatas, "image", "");
            await bookMyTables(values);
            notification.success({
                message:
                    "Your table reservation has been successfully confirmed.",
            });
            navigate("/dining");
            form.resetFields();
        } catch (err) {
            console.log(err);
            notification.error({ message: "Something went wrong" });
        } finally {
            setLoading(false);
        }
    };

    const disabledDate = (current) => {
        return current && current < moment().startOf("day");
    };

    const disabledPastTime = () => {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentSecond = now.getSeconds();

        return {
            disabledHours: () =>
                Array.from({ length: currentHour }, (_, i) => i),
            disabledMinutes: (hour) =>
                hour === currentHour
                    ? Array.from({ length: currentMinute }, (_, i) => i)
                    : [],
            disabledSeconds: (hour, minute) =>
                hour === currentHour && minute === currentMinute
                    ? Array.from({ length: currentSecond }, (_, i) => i)
                    : [],
        };
    };

    const getStatus = () => {
        return (
            moment(new Date(form.getFieldValue("diningDate"))).format(
                "DDMMYYYY"
            ) === moment(new Date()).format("DDMMYYYY")
        );
    };

    return (
        <div className="py-10 md:w-[500px] w-full">
            <Form
                className="flex flex-col w-full px-4"
                form={form}
                onFinish={handleFinish}
                layout="vertical"
            >
                <Form.Item
                    name="customerName"
                    label={<p className="text-white">Enter your full name</p>}
                    rules={[
                        { required: true, message: "Enter your full name" },
                    ]}
                >
                    <Input
                        prefix={
                            <img
                                src="./assets/icons/tuser.png"
                                className="booking_input_pic"
                            ></img>
                        }
                        className="antd_input w-full "
                        placeholder="Enter your full name"
                    />
                </Form.Item>
                <Form.Item
                    name="contactNumber"
                    label={
                        <p className="text-white">Enter your phone number</p>
                    }
                    className="!w-full "
                    rules={[
                        {
                            required: true,
                            message: null,
                        },
                        {
                            validator: (_, value) =>
                                phoneNumberValidation(
                                    "Enter your phone number",
                                    value
                                ),
                        },
                    ]}
                >
                    <PhoneInput
                        defaultCountry="in"
                        type="number"
                        className="!w-full !bg-[#DFDFDF] !rounded"
                        placeholder="Enter your phone number"
                    />
                </Form.Item>
                <Form.Item
                    className="!w-full"
                    name="alterateContactNumber"
                    rules={[
                        {
                            required: true,
                            message: null,
                        },
                        {
                            validator: (_, value) =>
                                phoneNumberValidation(
                                    "Enter your alternate phone number",
                                    value
                                ),
                        },
                    ]}
                    label={
                        <p className="text-white">
                            Enter your alternate phone number
                        </p>
                    }
                >
                    <PhoneInput
                        defaultCountry="in"
                        type="number"
                        className="!w-full !bg-[#DFDFDF] !rounded"
                        placeholder="Enter your alternate phone number"
                    />
                </Form.Item>
                <Form.Item
                    name="pickupAddress"
                    label={
                        <p className="text-white">Enter your pickup address</p>
                    }
                    rules={[
                        {
                            required: true,
                            message: "Enter your  pickup address",
                        },
                    ]}
                >
                    <TextArea
                        rows={4}
                        prefix={
                            <img
                                src="./assets/icons/tlocationdark.png"
                                className="booking_input_pic"
                            ></img>
                        }
                        className="antd_input w-full !bg-white"
                        placeholder="Enter your pickup address"
                    />
                </Form.Item>
                <Form.Item
                    name="location"
                    label={<p className="text-white">Enter your location</p>}
                    rules={[{ required: true, message: "Enter your location" }]}
                >
                    <Input
                        prefix={
                            <img
                                src="./assets/icons/tlocationlight.png"
                                className="booking_input_pic"
                            ></img>
                        }
                        className="antd_input w-full "
                        placeholder="Enter your location"
                    />
                </Form.Item>
                <Form.Item
                    name="pickupOption"
                    label={
                        <p className="text-white">Select your pickup option</p>
                    }
                    rules={[
                        {
                            required: true,
                            message: "Select your pickup option",
                        },
                    ]}
                >
                    <Select
                        className="!antd_input w-full !rounded-lg !bg-[#DFDFDF]"
                        placeholder="Enter your pickup option"
                        onChange={(data) => {
                            form.setFieldsValue({ pickupOption: data });
                        }}
                    >
                        <Select.Option value="Pickup">Pickup</Select.Option>
                        <Select.Option value="Drop">Drop</Select.Option>
                        <Select.Option value="Both">Both</Select.Option>
                    </Select>
                    {/* </div> */}
                </Form.Item>
                <Form.Item
                    name="noOfGuest"
                    label={<p className="text-white">Enter number of guest</p>}
                    rules={[
                        {
                            required: true,
                            message: null,
                        },
                        {
                            validator: (_, value) =>
                                minimumCountValidation(
                                    "Enter number of guest",
                                    value
                                ),
                        },
                    ]}
                >
                    <Input
                        type="number"
                        prefix={
                            <img
                                src="./assets/icons/tguest.png"
                                className="booking_input_pic h-[8px]"
                            ></img>
                        }
                        className="antd_input w-full "
                        placeholder="Enter number of guest"
                    />
                </Form.Item>
                <Form.Item
                    className="w-full"
                    name="diningDate"
                    rules={[
                        {
                            required: true,
                            message: "Select Booking Date",
                        },
                    ]}
                    label={<p className="text-white">Select Booking Date</p>}
                >
                    <DatePicker
                        placement="topRight"
                        size="small"
                        disabledDate={disabledDate}
                        onChange={(dates) => {
                            setDummy(!dummy);
                            form.setFieldsValue({
                                diningDate: dates,
                                diningTime: null,
                            });
                        }}
                        suffixIcon={
                            <CalendarOutlined className="booking_input_pic" />
                        }
                        placeholder="Select date"
                        format={"MMMM DD, YYYY"}
                        className="antd_input w-full bg-transparent"
                    />
                </Form.Item>
                {getStatus() ? (
                    <Form.Item
                        className="w-full"
                        name="diningTime"
                        rules={[
                            {
                                required: true,
                                message: "Select Booking Time",
                            },
                        ]}
                        label={
                            <p className="text-white">Select Booking Time</p>
                        }
                    >
                        <TimePicker
                            placement="topRight"
                            size="small"
                            suffixIcon={
                                <FieldTimeOutlined className="booking_input_pic" />
                            }
                            {...disabledPastTime()}
                            onChange={(times) => {
                                form.setFieldsValue({
                                    diningTime: times,
                                });
                            }}
                            placeholder="Select time slot"
                            format={"hh:mm A"}
                            className="antd_input w-full bg-transparent"
                        />
                    </Form.Item>
                ) : (
                    <Form.Item
                        className="w-full"
                        name="diningTime"
                        rules={[
                            {
                                required: true,
                                message: "Select Booking Time",
                            },
                        ]}
                        label={
                            <p className="text-white">Select Booking Time</p>
                        }
                    >
                        <TimePicker
                            placement="topRight"
                            size="small"
                            suffixIcon={
                                <FieldTimeOutlined className="booking_input_pic" />
                            }
                            onChange={(times) => {
                                form.setFieldsValue({
                                    diningTime: times,
                                });
                            }}
                            placeholder="Select time slot"
                            format={"hh:mm A"}
                            className="antd_input w-full bg-transparent"
                        />
                    </Form.Item>
                )}
                <Form.Item className="pt-5 w-full">
                    <Button
                        loading={loading}
                        htmlType="submit"
                        className="lg:!w-full !m-auto lg:!h-[60px] h-[50px] w-full !border-none  bg-yellow_color center_div"
                    >
                        <div className="lg:text-lg text-[#EFEFEF] font-semibold">
                            Confirm Booking
                        </div>
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default BookingForm;
