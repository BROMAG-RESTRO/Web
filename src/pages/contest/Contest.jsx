import { Button, Form, Input, Modal, notification } from "antd";
import { useEffect, useState } from "react";
import { phoneNumberValidation } from "../../helper/validation";
import { checkScrachCardDetails } from "../../helper/api/apiHelper";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Contest = () => {
  const [openCard, setOpenCard] = useState(false);
  const [status, setStatus] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFinish = async (values) => {
    try {
      setLoading(true);
      const result = await checkScrachCardDetails(values);
      if (_.get(result, "data.data", "") === "failed") {
        setStatus(false);
        setOpenCard(true);
      } else {
        setStatus(true);
        setOpenCard(true);
      }
    } catch (err) {
      notification.error({
        message: _.get(err, "response.data.messsage", "Something Went Wrong"),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen min-h-screen bg-[url('/assets/images/contestbg2.png')] bg-no-repeat bg-cover ">
      <div className="lg:px-20 flex flex-col lg:gap-y-20 gap-y-10 px-4 items-center pb-[200px] w-full ">
        <div className="play_font text-white lg:text-5xl tracking-wider font-normal lg:pt-24 pt-10 ">
          PLAY CONTEST
        </div>
        <div className="lg:w-[30vw] min-h-[60vh] w-full  rounded-[50px] relative ">
          <div className="bg-white w-full min-h-[60vh] pb-10 absolute !z-10 gap-y-10   rounded-[50px] shadow-xl flex flex-col items-center">
            <h1 className="pt-10 lg:text-2xl text-[#3A3A3A] font-semibold tracking-wider">
              Fill the details
            </h1>
            <Form
              className="w-full lg:px-10 px-4"
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
                      phoneNumberValidation(
                        "Enter phone number Here",
                        value,
                        10
                      ),
                  },
                ]}
              >
                <Input
                  type="number"
                  className="antd_input  w-full"
                  placeholder="Enter your phone number"
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
              <Form.Item className="pt-10">
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

            <Link to={"/"}>
              <button className="">Back</button>
            </Link>
          </div>
          <img
            src="/assets/logo/contestavtar.png"
            alt=""
            className="absolute left-[-129px] top-[-100px] !z-20 lg:block hidden"
          />
        </div>
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
        className="lg:w-[400px] w-full"
      >
        {status ? (
          <img src="/assets/icons/success.png" className="rounded-2xl" />
        ) : (
          <img src="/assets/icons/fail.png" className="rounded-2xl" />
        )}
      </Modal>
    </div>
  );
};

export default Contest;
