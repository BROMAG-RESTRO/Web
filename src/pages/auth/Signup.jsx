import { Button, Form, Input, notification } from "antd";
import { useEffect, useState } from "react";
import "react-phone-input-2/lib/style.css";
import { Link, useNavigate } from "react-router-dom";
import { phoneNumberValidation } from "../../helper/validation";
import { createUserSignUp } from "../../helper/api/apiHelper";
import _ from "lodash";
import { FaUser } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";

const Signup = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      localStorage.getItem("chgi5kjieaoyaiackaiw_bbcqgy4akacsaiq_bbcqgyyaq")
    ) {
      navigate("/");
    }
  }, []);

  const handleFinish = async (values) => {
    try {
      setLoading(true);
      values.phoneNumber = `+91${values.phoneNumber}`;
      values.status = "customer";
      await createUserSignUp(values);
      notification.success({ message: "Account successfully created" });
      setLoading(false);
      navigate("/login");
    } catch (err) {
      setLoading(false);
      notification.error({
        message: _.get(err, "response.data.message", "Something Went Wrong"),
      });
    }
  };

  return (
    <div className="w-screen min-h-screen bg-[url('/assets/images/loginhome.png')] pb-10 bg-cover bg-no-repeat flex items-center justify-center flex-col gap-y-4 lg:px-0 px-4">
      <img
        src="/assets/logo/logo.png"
        alt=""
        className="w-[150px] h-auto pt-10"
      />
      <div className="text-white lg:text-3xl">Sign up</div>
      <h1 className="text-white tracking-wider lg:text-xl text-sm text-center pt-1">
        Please Sign up to BROMAG with your mail address
      </h1>

      <Form
        id="signup"
        className="flex flex-col gap-y-2 lg:w-fit w-full pt-4"
        form={form}
        onFinish={handleFinish}
      >
        <Form.Item
          name="user"
          rules={[{ required: true, message: "Enter user name Here" }]}
        >
          <div className="rounded-[10px] center_div lg:w-[400px]  md:w-[400px] w-[98%] bg-white">
            <div className="w-[10%] flex justify-center items-center ">
              <FaUser className="text-xl text-black" />
            </div>
            <div className="w-[90%] bg-[#DFDFDF] rounded-lg">
              <Input
                className="antd_input w-full"
                placeholder="user name"
                id="user_name"
              />
            </div>
          </div>
        </Form.Item>
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Enter E-mail Here" },
            { type: "email", message: "Enter Valid E-mail" },
          ]}
        >
          <div className="rounded-[10px] center_div lg:w-[400px]  md:w-[400px] w-[98%] bg-white">
            <div className="w-[10%] flex justify-center items-center ">
              <MdOutlineEmail className="text-xl text-black" />
            </div>
            <div className="w-[90%] bg-[#DFDFDF] rounded-lg">
              <Input
                className="antd_input w-full"
                placeholder="E-mail"
                id="email"
              />
            </div>
          </div>
        </Form.Item>
        <Form.Item
          name="phoneNumber"
          rules={[
            {
              validator: (_, value) =>
                phoneNumberValidation("Enter phone number Here", value, 10),
            },
          ]}
        >
          <div className="rounded-[10px] center_div lg:w-[400px]  md:w-[400px] w-[98%] bg-white">
            <div className="w-[10%] flex justify-center items-center ">
              <FaPhoneAlt className="text-xl text-black" />
            </div>
            <div className="w-[90%] bg-[#DFDFDF] rounded-lg">
              <Input
                type="number"
                className="antd_input w-full"
                placeholder="phone number"
                id="phone_number"
              />
            </div>
          </div>
        </Form.Item>
        <Form.Item className="!m-auto">
          <Button
            loading={loading}
            id="signup_button"
            htmlType="submit"
            className="hover:!text-white min-w-[200px] center_div border-none min-h-[50px] text-md bg-black rounded-full text-white"
          >
            Sign up
          </Button>
        </Form.Item>
      </Form>

      <h1 className="text-white">or</h1>
      <Link
        to="/login"
        id="login_button"
        className="min-w-[200px] center_div -4 py-3 text-md bg-[#5C5C5C66] shadow-2xl rounded-full text-white w-fit"
      >
        Log in
      </Link>
    </div>
  );
};

export default Signup;
