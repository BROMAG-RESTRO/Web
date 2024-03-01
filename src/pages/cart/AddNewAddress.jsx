/* eslint-disable react/prop-types */
import { Button, Form, Input, Radio, Skeleton, notification } from "antd";
import { memo, useEffect, useState } from "react";
import {
  addDeliveryAddress,
  tokenVerification,
  updateDeliveryAddress,
} from "../../helper/api/apiHelper";
import _ from "lodash";
import { PhoneInput } from "react-international-phone";
import { phoneNumberValidation } from "../../helper/validation";
import axios from "axios";

const AddNewAddress = ({
  setChangeRight,
  changeRight,
  fetchData,
  setOpen,
  updateId = "",
}) => {
  console.log({ updateId });
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [otherAddressType, setOtherAddressType] = useState("");
  const [location, setLocation] = useState(null);
  const [googleAddress, setGoogleAddressLocation] = useState(null);
  const [userDetail, setUserDetail] = useState("");

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
            const userAddress = allAddress?.[0]?.address_components;
            console.log({ userAddress });
            let doorno = "",
              street = "",
              area = "",
              city = "",
              country = "",
              state = "",
              pincode = "";
            userAddress?.forEach((component) => {
              if (component?.types.includes("administrative_area_level_1")) {
                state = component.long_name;
              } else if (component?.types.includes("locality")) {
                city = component.long_name;
              } else if (component?.types.includes("street_number")) {
                doorno = component.long_name;
              } else if (component?.types.includes("route")) {
                street = component.long_name;
              } else if (component?.types.includes("sublocality_level_1")) {
                area = component.long_name;
              } else if (component?.types.includes("postal_code")) {
                pincode = component.long_name;
              }
            });

            setGoogleAddressLocation({
              doorno,
              street,
              area,
              city,
              country,
              pincode,
              state,
            });

            form.setFieldsValue({
              streetName: `${doorno || ""}  ${street}`,
              landMark: area,
              city: city,
              picCode: pincode,
              customerState: state,
            });

            return {
              doorno,
              street,
              area,
              city,
              country,
              pincode,
              state,
            };
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

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const result = await tokenVerification();
      setUserDetail(_.get(result, "data.data", []));

      // form.setFieldsValue({
      //     user: _.get(result, "data.data.[0].user", ""),
      // });
    } catch (err) {
      return notification.error({ message: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!updateId) {
      handleGetCurrentLocation();
    }
    fetchUserData();
  }, []);

  console.log({ location, googleAddress });

  useEffect(() => {
    if (updateId) {
      form.setFieldsValue({ name: updateId?.user });
      // form.setFieldsValue({ mobileNumber: updateId?.mobileNumber });
      form.setFieldsValue(updateId);
    }
  }, [updateId]);

  const handleFinish = async (values) => {
    console.log({ values });

    // form.setFieldsValue({ name: "Helloooooooooooooooooooo"})
    // form.getFieldsValue()
    // if(form.getFieldValue("addressType") === "Other") form.setfi
    console.log("valueeeeeeeeeee", values);

    try {
      setLoading(true);
      if (updateId) {
        await updateDeliveryAddress({
          ...values,
          _id: updateId?._id,
          userId: updateId?.userId,
        });
      } else {
        await addDeliveryAddress(values);
      }
      setChangeRight(!changeRight);
      fetchData();
      setOpen(false);
      notification.success({
        message: "The address has been added successfully",
      });
    } catch (err) {
      console.log(err);
      notification.error({ message: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  form?.setFieldsValue({ mobileNumber: updateId?.mobileNumber });
  return (
    <Skeleton
      active
      loading={loading}
      className="!w-[500px] !min-h-[400px]  !rounded-2xl"
    >
      <div className="lg:w-[500px] w-full min-h-[400px] bg-white rounded-2xl   relative pb-10">
        <div>
          <div className="text-dark3a_color font-semibold lg:text-2xl tracking-wider pt-2">
            {updateId ? "Edit your address" : "Add your address"}
          </div>
          <Form className="pt-4" form={form} onFinish={handleFinish}>
            <div className="flex flex-col gap-y-2">
              <div className="text-dark3a_color  font-medium lg:text-lg">
                Contact information
              </div>

              <Form.Item
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Enter Your Name",
                  },
                ]}
              >
                <Input className="antd_input" placeholder="Your name" />
              </Form.Item>
              <Form.Item
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
                name="mobileNumber"
                className=" lg:w-[400px] w-[98%]  h-[50px]"
              >
                <PhoneInput
                  defaultCountry={"in"}
                  disableDialCodeAndPrefix
                  inputStyle={{ background: "red" }}
                  className="!w-full !bg-white"
                  value={form.getFieldValue("mobileNumber")}
                />
              </Form.Item>
            </div>
            <div className="flex flex-col gap-y-2 w-full">
              <div className="text-dark3a_color  font-medium lg:text-lg">
                Delivery address
              </div>
              <div className="flex gap-x-2 flex-col">
                {/* <Form.Item
                  name="addressType"
                  rules={[
                    {
                      required: true,
                      message: "Enter Home / Work, Other",
                    },
                  ]}
                >
                  <Input
                    className="antd_input"
                    placeholder="Enter Home / Work, Other"
                  />
                </Form.Item> */}

                <Form.Item
                  name="addressType"
                  rules={[
                    { required: true, message: "Please select an option!" },
                  ]}
                >
                  <Radio.Group>
                    <Radio value={"Home"}>Home</Radio>
                    <Radio value={"Work"}>Work</Radio>
                    <Radio value={"Other"}>Other</Radio>
                  </Radio.Group>
                </Form.Item>
                {/* <input onChange={(e) => setOtherAddressType(e.target.value)} /> */}

                <Form.Item
                  name="streetName"
                  rules={[
                    {
                      required: true,
                      message: "Enter Door / Flat no, Street name",
                    },
                  ]}
                >
                  {/* <div className="booking_input lg:w-[400px] w-full h-[40px]"> */}
                  <Input
                    className="antd_input "
                    placeholder="Door / Flat no, Street name"
                  />
                  {/* </div> */}
                </Form.Item>
                <Form.Item
                  name="landMark"
                  rules={[
                    {
                      required: true,
                      message: "Enter Area name / Landmark",
                    },
                  ]}
                >
                  <Input
                    className="antd_input "
                    placeholder="Area name / Landmark"
                  />
                </Form.Item>

                <Form.Item
                  name="city"
                  rules={[
                    {
                      required: true,
                      message: "Enter Your City",
                    },
                  ]}
                >
                  <Input className="antd_input " placeholder="City" />
                </Form.Item>
                <Form.Item
                  name="picCode"
                  rules={[
                    {
                      required: true,
                      message: "Enter Your Pin code",
                    },
                  ]}
                >
                  <Input className="antd_input " placeholder="Pin code" />
                </Form.Item>
                <Form.Item
                  name="customerState"
                  rules={[
                    {
                      required: true,
                      message: "Enter Your State",
                    },
                  ]}
                >
                  <Input className="antd_input " placeholder="State" />
                </Form.Item>

                {/* <img
                  src="/assets/images/map.png"
                  alt=""
                  className="lg:!w-[400px]"
                /> */}
              </div>
            </div>
            <div className="lg:w-[400px] center_div pt-10">
              <Button
                htmlType="submit"
                loading={loading}
                className="!border-none !bg-yellow_color !w-[400px] !h-[50px] !rounded-2xl"
              >
                <div className="text-[#EFEFEF] font-semibold">
                  Save & proceed
                </div>
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </Skeleton>
  );
};

export default memo(AddNewAddress);
