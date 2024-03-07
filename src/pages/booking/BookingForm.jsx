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
import {
  bookMyTables,
  getSlots,
  tokenVerification,
} from "../../helper/api/apiHelper";
import { useNavigate } from "react-router-dom";
import { PhoneInput } from "react-international-phone";
import moment from "moment";

import { CalendarOutlined, FieldTimeOutlined } from "@ant-design/icons";

const BookingForm = ({ tableDatas }) => {
  console.log({ tableDatas });

  const [timeSlotsOptions, setTimeSlots] = useState([]);
  const [form] = Form.useForm();

  const { TextArea } = Input;

  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [googleAddress, setGoogleAddressLocation] = useState(null);
  const [choosenSlot, setChoosenSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [slotloading, setSlotLoading] = useState(false);
  const [dummy, setDummy] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const userDeails = await tokenVerification();
      form.setFieldsValue({
        customerName: _.get(userDeails, "data.data[0].user", "") || 0,
        contactNumber: _.get(userDeails, "data.data[0].phoneNumber", "") || 0,
        alterateContactNumber:
          _.get(userDeails, "data.data[0].alter_mobile_number", "") || 0,
      });
    } catch (err) {
      console.log(err);
      notification.error({ message: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };
  const fetchSlots = async (data) => {
    try {
      console.log({ data });
      setSlotLoading(true);
      const results = await getSlots(data);
      setTimeSlots(results?.data?.data || []);
    } catch (err) {
      console.log(err);
      notification.error({ message: "Something went wrong" });
    } finally {
      setSlotLoading(false);
    }
  };

  const getLocation = async (lat, long) => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=AIzaSyBTKE5U_KnZAbWR4qUhsHLsj4titj2uIWg`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          console.log({ result });
          if (result?.status === "OK") {
            const allAddress = result?.results;
            const userAddress = allAddress?.[0]?.formatted_address;

            setGoogleAddressLocation(userAddress);

            form.setFieldsValue({
              pickupAddress: userAddress,
              location: userAddress,
            });

            return true;
          }
        })
        .catch((error) => {
          console.error(error);
          return null;
        });

      return null;
    } catch (error) {
      console.log(error);

      return null;
    }
  };
  const handleGetCurrentLocation = async () => {
    if (navigator.geolocation) {
      //  const confirmation = window.confirm("Share your current location?");
      // if (confirmation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          getLocation(latitude, longitude);
          setLocation({
            latitude: latitude,
            longitude: longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        },
        { enableHighAccuracy: true }
      );
    }
  };
  useEffect(() => {
    if (
      localStorage.getItem("chgi5kjieaoyaiackaiw_bbcqgy4akacsaiq_bbcqgyyaq")
    ) {
      fetchData();
      handleGetCurrentLocation();
    } else {
      navigate("/");
    }
  }, []);

  const handleFinish = async (values) => {
    try {
      setLoading(true);
      console.log({ values });

      values.timeSlot = choosenSlot?._id;
      values.diningTime = choosenSlot?.time;
      values.bookingDate = moment(values?.bookingDate).format("YYYY-MM-DD");
      values.booking = "Booked";
      values.tableNo = _.get(tableDatas, "tableNo", "");
      values.tableId = _.get(tableDatas, "_id", "");
      values.tablePic = _.get(tableDatas, "image", "");

      await bookMyTables({ ...values, diningTime: choosenSlot?.time });
      notification.success({
        message: "Your table reservation has been successfully confirmed.",
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
    const today = moment().startOf("day");
    const twentyFourHoursLater = moment(today).add(24, "hours");

    return current && (current < today || current > twentyFourHoursLater);
  };

  const disabledPastTime = () => {
    // const now = new Date();
    // const currentHour = now.getHours();
    // const currentMinute = now.getMinutes();
    // const currentSecond = now.getSeconds();
    const now = moment();

    // Get the current hour in 24-hour format
    const currentHour24 = now.format("H");

    const hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    if (currentHour24 > 10) {
      for (let i = 10; i < currentHour24; i++) {
        hours.push(i);
      }
    }
    return {
      //   disabledHours: () => Array.from({ length: currentHour }, (_, i) => i),

      //   disabledHours: () =>
      //     Array.from({ length: currentHour }).concat(
      //       Array.from(
      //         { length: 24 - currentHour - 1 },
      //         (_, i) => i + currentHour + 1
      //       )
      //     ),
      disabledHours: () => hours,
      //   disabledMinutes: (hour) =>
      //     hour === currentHour
      //       ? Array.from({ length: currentMinute }, (_, i) => i)
      //       : [],
      //       disabledMinutes:()=>[]
      //   disabledSeconds: (hour, minute) =>
      //     hour === currentHour && minute === currentMinute
      //       ? Array.from({ length: currentSecond }, (_, i) => i)
      //       : [],
    };
  };

  const getStatus = () => {
    return (
      moment(new Date(form.getFieldValue("diningDate"))).format("DDMMYYYY") ===
      moment(new Date()).format("DDMMYYYY")
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
          rules={[{ required: true, message: "Enter your full name" }]}
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
          label={<p className="text-white">Enter your phone number</p>}
          className="!w-full "
          rules={[
            {
              required: true,
              message: null,
            },
            {
              validator: (_, value) =>
                phoneNumberValidation("Enter your phone number", value),
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
              required: false,
              message: null,
            },
            // {
            //   validator: (_, value) =>
            //     phoneNumberValidation(
            //       "Enter your alternate phone number",
            //       value
            //     ),
            // },
          ]}
          label={
            <p className="text-white">Enter your alternate phone number</p>
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
          label={<p className="text-white">Enter your pickup address</p>}
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
            className="antd_input w-full textareat"
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
          label={<p className="text-white">Select your pickup option</p>}
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
                minimumCountValidation("Enter number of guest", value),
            },
          ]}
        >
          <Input
            name="noOfGuest"
            id="noOfGuest"
            type="number"
            prefix={
              <img
                src="./assets/icons/tguest.png"
                className="booking_input_pic h-[8px]"
              ></img>
            }
            min={1}
            max={Number(tableDatas?.seatsAvailable)}
            className="antd_input w-full "
            placeholder="Enter number of guest"
          />
        </Form.Item>
        <Form.Item
          className="w-full"
          name="bookingDate"
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
            onChange={(date) => {
              console.log({ date });
              if (date) {
                form.setFieldsValue({
                  bookingDate: date,
                  diningTime: null,
                });
                const momentObject = moment({
                  year: date.$y,
                  month: date.$M,
                  day: date.$D,
                });

                // Format the date
                const formattedDate = momentObject.format("YYYY-MM-DD");
                fetchSlots({
                  tableId: tableDatas?._id,
                  bookingDate: formattedDate,
                });
              }
            }}
            suffixIcon={<CalendarOutlined className="booking_input_pic" />}
            placeholder="Select date"
            format={"DD-MM-YYYY"}
            className="antd_input w-full bg-transparent"
          />
        </Form.Item>
        <Form.Item
          name="timeSlot"
          label={<p className="text-white">Choose Timeslot </p>}
          rules={[
            {
              required: true,
              message: "Choose TimeSlot",
            },
          ]}
        >
          <Select
            className="!antd_input w-full !rounded-lg !bg-[#DFDFDF]"
            placeholder="Choose TimeSlot"
            loading={slotloading}
            disabled={slotloading}
            onSelect={(val, option) => {
              console.log(val, option?.data);
              setChoosenSlot(option?.data);
            }}
          >
            {timeSlotsOptions?.map((td, i) => {
              return (
                <Select.Option value={td?.time} key={td?._id} data={td}>
                  {td?.time}
                </Select.Option>
              );
            })}

            {/* Add more Option components for additional interests */}
          </Select>
          {/* </div> */}
        </Form.Item>

        {/* {getStatus() ? (
          <Form.Item
            className="w-full"
            name="diningTime"
            rules={[
              {
                required: true,
                message: "Select Booking Time",
              },
            ]}
            label={<p className="text-white">Select Booking Time</p>}
          >
            <TimePicker
              placement="topRight"
              size="small"
              showNow={false}
              minuteStep={10}
              hideDisabledOptions
              defaultOpenValue={moment("11:00", "HH:mm")}
              suffixIcon={<FieldTimeOutlined className="booking_input_pic" />}
              {...disabledPastTime()}
              onChange={(times, time) => {
                console.log({ times, time });
                form.setFieldsValue({
                  diningTime: times,
                  time: time,
                });
              }}
              placeholder="Select time slot"
              format={"HH:mm"}
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
            label={<p className="text-white">Select Booking Time</p>}
          >
            <TimePicker
              placement="topRight"
              size="small"
              minuteStep={10}
              showNow={false}
              hideDisabledOptions
              defaultOpenValue={moment("11:00", "HH:mm")}
              suffixIcon={<FieldTimeOutlined className="booking_input_pic" />}
              {...disabledPastTime()}
              onChange={(times, time) => {
                console.log({ times, time });
                form.setFieldsValue({
                  diningTime: times,
                  time: time,
                });
              }}
              placeholder="Select time slot"
              format={"HH:mm"}
              className="antd_input w-full bg-transparent"
            />
          </Form.Item>
        )} */}
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
