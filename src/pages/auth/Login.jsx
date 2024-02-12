import { Button, Input, notification } from "antd";
import { useEffect, useState } from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
// import {  verifyOTP } from "../../helper/firebase";
import _ from "lodash";
import {
  getFooterData,
  makeUserToken,
  sendOTP,
  verifyOTP,
} from "../../helper/api/apiHelper";
import axios from "axios";
import { MdKey } from "react-icons/md";

const Login = () => {

  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOTP] = useState();
  const [timer, setTimer] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [loading, setLoading] = useState({ gotp: false, votp: false });
  const [transactionId, setTransactionId] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {

    if (
      localStorage.getItem("chgi5kjieaoyaiackaiw_bbcqgy4akacsaiq_bbcqgyyaq")
    ) {
      navigate("/");
    }

  },[]);

  useEffect(() => {
    let countdown;

    if (isTimerRunning && timer > 0) {
      countdown = setInterval(() => {
        setTimer(prevTimer => (prevTimer > 0 ? prevTimer - 1 : 0));
      }, 1000);
    } else {
      // If timer is not running or has reached 0, stop the interval
      clearInterval(countdown);
      setIsTimerRunning(false);
      setTimer(60)// Set isTimerRunning to false
    }

    return () => clearInterval(countdown);
  }, [isTimerRunning, timer]);

  const handleGenerateOTP = async () => {
    try {

      if (phoneNumber.length < 8) {
        setLoading((pre) => ({ ...pre,  ["gotp"]: false }));
        return notification.error({ message: "Enter A Valid Number" });
      }

      setLoading((items) => ({ ...items, ["gotp"]: true }));
    
      
      let number = `${phoneNumber}`;

      const verify = await sendOTP(number);

      console.log(verify, "verify");
      
      if (!verify.data.success) {
        
        setLoading((pre) => ({ ...pre,  ["gotp"]: false }));
        
        return notification.error({
          
          message: verify.data.message
          
        });
        
      } else if (verify.data.success) {
        setIsTimerRunning(true)
        setLoading((pre) => ({ ...pre,  ["gotp"]: false }));
        



        return notification.success({ message: verify.data.message })
        
      }
      
      
    } catch (err) {
      
      setLoading((pre) => ({ ...pre,  ["gotp"]: false }));

      notification.error({ message: "Something went wrong" });

    }
  };

  const validateLogin = async (result) => {
    console.log("result",result);
    if (_.get(result, "data.success", false)) {
      let formData = { number: `${phoneNumber}` };
      const result = await makeUserToken(formData);
      localStorage.setItem(
        "chgi5kjieaoyaiackaiw_bbcqgy4akacsaiq_bbcqgyyaq",
        _.get(result, "data.data", "")
      );

      axios.defaults.headers.common["aizasycoxsewxv2t64dxca-wl8n8qfq0gzux1as"] =
        localStorage.getItem("chgi5kjieaoyaiackaiw_bbcqgy4akacsaiq_bbcqgyyaq");
      
      notification.success({ message: "Delicious success! Explore our menu and indulge in delights" });
      // navigation routes start

      if (_.get(location, "state.backLocation", null) === null) {
        navigate("/");
      } else {
        if (_.get(location, "state.currentCatid", null) !== null) {
          navigate(`${_.get(location, "state.backLocation", null)}`, {
            state: {
              currentCatid: _.get(location, "state.currentCatid", null),
            },
          });
        } else {
          navigate(`${_.get(location, "state.backLocation", null)}`);
        }
      }
      // end
    } else {
      notification.error({
        message: _.get(result, "message", "Something went wrong"),
      });
    }
  };

  const handleOtp = async () => {
    try {
      setLoading((pre) => ({ ...pre, votp: true }));

      if (!otp) {

        setLoading((pre) => ({ ...pre, votp: false }));

        return notification.error({ message: "Enter the verification code for authentication" });
        
      }
      const result = await verifyOTP(phoneNumber,otp);
      if (result.data.success) {
        validateLogin(result);
        
      } else {
        notification.error({message:result.data.message})
}

      setLoading((pre) => ({ ...pre, votp: false }));
      
    } catch (err) {
      setLoading((pre) => ({ ...pre, votp: false }));
      notification.error({ message: "Something went wrong" });
    }
  };

  return (
    <div className="w-screen flex min-h-screen bg-[url('/assets/images/loginhome.png')] bg-cover bg-no-repeat items-center justify-center flex-col gap-y-4 lg:px-0 px-4">
      <img src="/assets/logo/logo.png" alt="" className="w-[150px] h-auto" />
      <h1 className="text-white tracking-wider text-center lg:text-lg text-sm">
        Please log in to BROMAG with your phone number
      </h1>

      <div className="p-2 !w-full flex justify-center">
        <PhoneInput
          disableDialCodeAndPrefix
          onChange={(e) => {
            setPhoneNumber(e);
          }}

          id="contact_phone"
          defaultCountry={"in"}
          className="md:w-[400px] h-[50px] w-[100%] !bg-white placeholder:text-label_color rounded-lg"
        />
      </div>
      <Button
        disabled={isTimerRunning}
        id="generate_otp"
        loading={_.get(loading, "gotp", false)}
        onClick={handleGenerateOTP}
        className="hover:!text-white min-w-[200px] center_div border-none min-h-[50px] text-md bg-black rounded-full !text-white"
      >

{isTimerRunning ? (
        <span className="!text-white">Secure in {timer} seconds</span>
      ) : (
        <span className="!text-white">Generate OTP</span>
      )}
       
        {/* <span className="!text-white"> Generate OTP</span> */}

      </Button>

      <div className="rounded-[10px] center_div lg:w-[400px]  md:w-[400px] w-[98%] bg-white">
        <div className="w-[10%] flex justify-center items-center ">
          <MdKey className="text-xl text-black" />
        </div>
        <div className="w-[90%]">
          <Input
            id="otp"
            onChange={(e) => {
              setOTP(_.get(e, "target.value", ""));
            }}
            className="h-[50px] bg-white placeholder:text-label_color antd_input w-full "
            placeholder="Enter the OTP"
          />
        </div>
      </div>
      <Button
        id="login"
        loading={_.get(loading, "votp", false)}
        onClick={handleOtp}
        className="hover:!text-white min-w-[200px] center_div border-none min-h-[50px] text-md bg-black rounded-full text-white"
      >
        Log in
      </Button>
      <h1 className="text-white">or</h1>
      <Link
        to="/signup"
        id="signup"
        className="min-w-[200px] center_div -4 py-3 text-md bg-[#5C5C5C66] shadow-2xl rounded-full text-white w-fit"
      >
        Sign up
      </Link>
      <div id="capchabox"></div>
    </div>
  );
};

export default Login;
