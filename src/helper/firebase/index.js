import axios from "axios";
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

let base_url = import.meta.env.VITE_base_url;
let otp_API = import.meta.env.EDUMARC_OTP_API;
let template_Id = import.meta.env.BSNL_TEMPLATE_ID;

const firebaseConfig = {
  apiKey: "AIzaSyB6gHF1LhaU83ufRAe5Plc43P-0SpA8nd4",
  authDomain: "bromag-notification.firebaseapp.com",
  projectId: "bromag-notification",
  storageBucket: "bromag-notification.appspot.com",
  messagingSenderId: "845209637334",
  appId: "1:845209637334:web:5fc2dc826d71cffc065477",
  measurementId: "G-VVL31YWW22",
};

export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

// export const sendOTP = async (number) => {
//   try {
//     generateRecaptcha();
//     let result = await signInWithPhoneNumber(
//       auth,
//       `+${number}`,
//       window.recaptchaVerifier
//     );
//     window.confirmationResult = result;
//     return true;
//   } catch (err) {
//     if (err.message === "reCAPTCHA has already been rendered in this element") {
//       return "already sended";
//     }
//     return false;
//   }
// };

// export const verifyOTP = async (code) => {
//   try {
    // let confirmationResult = window.confirmationResult;
    // await confirmationResult.confirm(code);
//     return {
//       status: true,
//     };
//   } catch (err) {
//     if (err.code === "auth/code-expired") {
//       console.log(err);
//       return {
//         status: false,
//         message:
//           "The OTP has expired. Please refresh the page and generate a new OTP",
//       };
//     } else if (err.code === "auth/invalid-verification-code") {
//       return {
//         status: false,
//         message: "The verification code entered is not valid.",
//       };
//     } else {
//       return {
//         status: false,
//         message: "Something went wrong",
//       };
//     }
//   }
// };

//=====================================================================================


export const verifyOTP = async (transactionId) => {
  try {
    const response = await axios.get(`${base_url}/verify-sms/${transactionId}`);
    if (response?.data?.status) {
      return {
        status: true,
      };
    } else {
      return {
        status: true,
        message:
          "The OTP has expired. Please refresh the page and generate a new OTP",
      };
    }
  } catch (err) {
    console.log(err.message);
    return {
      status: true,
      message:
        "The verification code entered is not valid. Please refresh the page and generate a new OTP",
    };
  }
};
