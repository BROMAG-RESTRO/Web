import { Button, Form, Input, Modal, notification } from "antd";
import { useEffect, useState } from "react";
import { phoneNumberValidation } from "../../helper/validation";
import {  ProcessContest } from "../../helper/api/apiHelper";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import ContestImg from "../../assets/contest.png";
import "../../assets/css/contest.css";

const Contest = () => {
  const [openCard, setOpenCard] = useState(false);
  const [status, setStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFinish = async (values) => {
    try {
      setLoading(true);
      const result = await ProcessContest({
        scratch_code: values.card_number,
        orderRef: values.order_id,
        phoneNo: values.contact_number
      });
      
      if (result.data.success) {
        setStatus(true);
        setMessage(result.data.message);
        setOpenCard(true);
      } else {
        setStatus(false);
        setMessage("Sorry, please try again.");
        setOpenCard(true);
      }
    } catch (err) {
      setStatus(false);
      setMessage(_.get(err, "response.data.message", "Something Went Wrong"));
      setOpenCard(true);
      notification.error({
        message: _.get(err, "response.data.message", "Something Went Wrong")
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen min-h-screen bg-[url('/assets/images/contestbg2.png')] bg-no-repeat bg-cover contest_container ">
      <div className="play_font title_card text-white">PLAY CONTEST</div>

      <div className="contest_form bg-white">
        <h1 className="pt-5 pb-4 lg:text-2xl text-[#3A3A3A] font-semibold tracking-wider text-center">
          Fill the details
        </h1>
        <div className="contest_wrapper">
          <img src={ContestImg} alt="avatar" className="contest_avatar" />
        </div>

        <Form
          className="w-full lg:px-5 px-4"
          form={form}
          onFinish={handleFinish}
        >
          <Form.Item
            className="w-full"
            name="order_id"
            rules={[
              {
                required: true,
                message: "Enter Order Id",
              },
            ]}
          >
            <Input
              className="antd_input w-full"
              placeholder="Enter your order ID"
            />
          </Form.Item>
          <Form.Item
            className="w-full"
            name="contact_number"
            rules={[
              {
                validator: (_, value) =>
                  phoneNumberValidation("Enter phone number Here", value, 10),
              },
            ]}
          >
            <Input
              type="text"
              className="antd_input w-full"
              placeholder="Enter your phone number"
              maxLength={10}
              name="contact_number"
              id="contact_number"
              max={10}
            />
          </Form.Item>
          <Form.Item
            className="w-full"
            name="card_number"
            rules={[
              {
                required: true,
                message: "Enter Scrach Card Details",
              },
            ]}
          >
            <Input
              className="antd_input w-full"
              placeholder="Enter your scratch code"
            />
          </Form.Item>
          <Form.Item className="pt-5">
            <Button
              loading={loading}
              htmlType="submit"
              block
              className="!bg-yellow_color h-[50px] center_div rounded-2xl !border-none"
            >
              <div className="!text-[#EFEFEF] font-semibold">Submit</div>{" "}
            </Button>
          </Form.Item>
        </Form>
        <Link
          to={"/"}
          className="text-center mb-1 text-lg font-medium"
          style={{
            display: "block",
            cursor: "pointer",
          }}
        >
          Back
        </Link>
      </div>
      <Modal
        open={openCard}
        onCancel={() => {
          setOpenCard(false);
          navigate("/profile-my-contest");
        }}
        destroyOnClose
        footer={false}
        centered
        closable={false}
        className="lg:w-[400px] w-full custom-modal"
      >
        <div className="bg-gradient-to-br from-orange-100 via-yellow-200 to-orange-50 rounded-2xl text-center p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-yellow-400 animate-pulse"></div>

          {status ? (
            <>
              <img src="/assets/icons/success.png" className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-orange-700 mt-4 mb-2">Congratulations!</h2>
              <p className="text-lg text-gray-700 mb-6">{message}</p>
            </>
          ) : (
            <>
              <img src="/assets/icons/fail.png" className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-700 mt-4 mb-2">Oops!</h2>
              <p className="text-gray-600 mb-6">{message}</p>
            </>
          )}

          <button
            onClick={() => {
              setOpenCard(false);
              navigate("/profile-my-contest");
            }}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-full transition"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Contest;
