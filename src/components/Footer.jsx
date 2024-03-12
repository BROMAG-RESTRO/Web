import _ from "lodash";

import { useLocation, useNavigate } from "react-router-dom";
import { Menus } from "../helper/datas/menu";
import { addHomefeedback, getFooterData } from "../helper/api/apiHelper";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addFooter, colorTheme } from "../redux/authSlice";
import { MdLocationPin } from "react-icons/md";
import { IoMailOutline } from "react-icons/io5";
import { FaPhoneAlt } from "react-icons/fa";
import "../assets/css/footer.css";
import { Link } from "react-router-dom";
import { Formik } from "formik";

import * as yup from "yup";
import { notification } from "antd";
function Footer() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [footerData, setFooterData] = useState(null);
  const [color, setColor] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialmedia, setsocialMedia] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getFooterData();
        setFooterData(response?.data);
        setsocialMedia(response?.social);
        setColor(response?.data?.[0]?.colors);
        dispatch(addFooter(response));
        dispatch(
          colorTheme({
            primaryColor: response?.data[0]?.colors?.primaryColor,
            secondaryColor: response?.data[0]?.colors?.secondaryColor,
            thirdColor: response?.data[0]?.colors?.thirdColor,
            fourthColor: response?.data[0]?.colors?.fourthColor,
          })
        );
      } catch (error) {
        console.error("Error fetching footer data:", error);
      }
    };

    fetchData();
  }, []);

  if (footerData === null) {
    return null;
  }

  const social = [
    {
      id: 1,
      link: "https://www.instagram.com/iftar_restaurant_ambur/?igshid=ZDdkNTZiNTM%3D",
      name: "igram",
    },
    {
      id: 2,
      link: "https://www.facebook.com/people/Iftar-Restaurant/100090336356764/?mibextid=ZbWKwL",
      name: "fbook",
    },
    {
      id: 3,
      link: "https://whatsapp.com/channel/0029VaBEhJ40gcfSjIZsQV04",
      name: "wup",
    },
    {
      id: 4,
      link: "https://www.youtube.com/@BROMAGINDIA",
      name: "ytube",
    },
    {
      id: 5,
      link: "https://www.linkedin.com/company/bromagindia/",
      name: "linkedin",
    },
  ];

  const footerLinks = [
    { id: 1, name: "Who we are", link: "/whoweare" },
    { id: 2, name: "Privacy Policy", link: "/privacy" },
    { id: 3, name: "Refund and Cancellation", link: "/cancellation" },
    { id: 4, name: " Terms and Condition", link: "/termsandcondition" },
  ];

  const firstFooterData = footerData?.[0];
  console.log({ socialmedia });
  return (
    <div
      className={` py-4 lg:min-h-[53vh] text-white z-50 pb-10 ${
        ["/booking-details", "/play-my-contest", "/my-profile"].includes(
          _.get(location, "pathname", "")
        )
          ? "rounded-none"
          : "lg:rounded-t-[50px] rounded-t-[25px]"
      }`}
      style={{
        backgroundColor: color?.secondaryColor
          ? color?.secondaryColor
          : "#000000",
      }}
    >
      <div className="footer-container">
        {/* <div className="ultraSm:px-4 lg:px-8 py-2">
          {/* Logo */}
        {/* <img
            src={firstFooterData?.logo}
            className="lg:w-[150px] lg:h-[150px]"
            alt="Footer Logo"
          /> 
        </div> */}
        <div className="footer-wrapper">
          {/* About Us */}

          <div className="footer-part1">
            <div className="flex flex-col lg:gap-y-10 gap-y-8">
              <h1 className="lg:text-2xl text-sm font-bold   text-[#EFEFEF] footer-link-header">
                ABOUT US
                <img
                  src="/assets/icons/footerborder.png"
                  alt="Footer Border"
                  className="lg:pt-1 pt-2 footer-line"
                />
              </h1>

              <div className="flex flex-col lg:gap-y-2 gap-y-5 lg:text-2xl text-sm footer-link-wrapper">
                <div className="flex gap-2 items-center">
                  <FaPhoneAlt className="text-[10] lg:text-sm hidden" />
                  <Link
                    to={"/whoweare"}
                    title="Who we are"
                    // className="text-[10px] footer-link "
                  >
                    <span className="text-[10px] footer-link ">Who we are</span>
                  </Link>
                </div>

                <div className="flex items-center">
                  <IoMailOutline className="text-sm hidden" />
                  <Link
                    to={"/privacy"}
                    title="Privacy Policy"
                    // className="text-[10px] footer-link "
                  >
                    <span className="text-[9px] footer-link">
                      Privacy Policy
                    </span>
                  </Link>
                </div>
                <div className="flex lg:items-center">
                  <MdLocationPin className="text-2xl lg:text-lg  hidden" />
                  <Link
                    to={"/cancellation"}
                    title="Refund and Cancellation"
                    // className="text-[10px] footer-link "
                  >
                    <span className="text-[10px] footer-link">
                      Refund and Cancellation
                    </span>
                  </Link>
                </div>
                <div className="flex lg:items-center">
                  <MdLocationPin className="text-2xl lg:text-lg  hidden" />
                  <Link
                    to={"/termsandcondition"}
                    title="Terms and Condition"
                    // className="text-[10px] footer-link "
                  >
                    {" "}
                    <span className="text-[10px] footer-link">
                      Terms and Condition
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Us */}
          <div className="footer-part2">
            <div className="flex flex-col lg:gap-y-10 sm:gap-y-8 gap-y-7 ">
              <h1 className="lg:text-2xl text-sm font-bold   text-[#EFEFEF]  footer-link-header">
                CONTACT US
                <img
                  src="/assets/icons/footerborder.png"
                  alt="Footer Border"
                  className="lg:pt-1 pt-2 footer-line"
                />
              </h1>

              <div className="flex flex-col lg:gap-y-7 gap-y-5 lg:text-2xl text-sm footer-link-wrapper">
                <div className="flex gap-2 items-center footer-wrap">
                  <FaPhoneAlt size={15} className="footer-link" />
                  <a
                    href={`tel:${firstFooterData?.contactNumber}`}
                    className="text-[10px] footer-link"
                  >
                    {firstFooterData?.contactNumber}
                  </a>
                </div>

                <div className="flex gap-2 items-center footer-wrap">
                  <IoMailOutline size={15} className="footer-link" />
                  <a
                    href={`mailto:${firstFooterData?.email}`}
                    className="text-[10px] footer-link"
                  >
                    {firstFooterData?.email}
                  </a>
                </div>
                <div className="flex gap-2 lg:items-center footer-wrap">
                  <MdLocationPin size={15} className="footer-link" />
                  <span className="text-[10px] text-capitalize footer-link">
                    {firstFooterData?.address}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/*  */}
          <div className="footer-part3">
            <div className="flex flex-col border-l border-white/50 pl-10 pr-3">
              <h1 className="text-2xl font-sans  text-[#5e5e5e] font-extrabold mb-1">
                GIVE YOUR FEEDBACK
              </h1>
              <Formik
                initialValues={{
                  name: "",
                  email: "",
                  mobile: "",
                  feedback: "",
                }}
                validateOnBlur={false}
                validationSchema={yup.object({
                  name: yup.string().required("Enter Email"),
                  email: yup
                    .string()
                    .email("Invalid Email")
                    .required("Enter email"),
                  mobile: yup
                    .string()
                    .required("Enter Mobile")
                    .required("Enter mobile number"),
                  feedback: yup.string().required("Enter some Feedback "),
                })}
                onSubmit={async (values, formik) => {
                  try {
                    setLoading(true);
                    await addHomefeedback(values);
                    notification.success({
                      message: "Thanks for your feedback",
                    });

                    formik.resetForm({});
                    setLoading(false);
                  } catch (err) {
                    setLoading(false);
                    notification.error({ message: "Something went wrong" });
                  }
                }}
              >
                {(formik) => {
                  console.log(formik.errors, formik.values);
                  return (
                    <>
                      <form
                        className="flex flex-col lg:gap-y-2 gap-y-5 lg:text-2xl text-sm pr-3 mt-1"
                        onSubmit={formik.handleSubmit}
                      >
                        <div>
                          <input
                            type="text"
                            name={"name"}
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter your name"
                            className={
                              formik.touched?.name && formik.errors.name
                                ? "error_text input input-bordered w-full bg-white text-red"
                                : "input input-bordered w-full bg-white text-black border "
                            }
                          />
                        </div>
                        <div>
                          <input
                            type="email"
                            name={"email"}
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter your e-mail"
                            className={
                              formik.touched?.email && formik.errors.email
                                ? "error_text input input-bordered w-full bg-white text-red"
                                : "input input-bordered w-full bg-white text-black border "
                            }
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Enter your phone number"
                            className={
                              formik.touched?.email && formik.errors.email
                                ? "error_text input input-bordered w-full bg-white text-red"
                                : "input input-bordered w-full bg-white text-black border "
                            }
                            maxLength={10}
                            minLength={10}
                            name={"mobile"}
                            value={formik.values.mobile}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                        </div>

                        <div className="w-full flex items-center py-1 gap-2">
                          <textarea
                            className={
                              formik.touched?.email && formik.errors.email
                                ? "error_text textarea textarea-bordered w-[70%] h-16  bg-white text-black text-red"
                                : "textarea textarea-bordered w-[70%] h-16  bg-white text-black "
                            }
                            placeholder="Write something..."
                            name={"feedback"}
                            value={formik.values.feedback}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          ></textarea>
                          <button
                            className="btn w-[30%] h-16 bg-primary_color border-none text-lg text-white"
                            type="submit"
                            disabled={loading}
                          >
                            Submit
                          </button>
                        </div>
                      </form>
                    </>
                  );
                }}
              </Formik>
            </div>
          </div>
          {/* Social Links */}
        </div>
        <div className="flex gap-x-5 justify-center items-center mt-6">
          {socialmedia?.map((res, index) => (
            <a key={index} href={res.link} target="_blank">
              <img src={res?.image} className="footer_icons" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Footer;
