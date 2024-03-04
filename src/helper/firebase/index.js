import axios from "axios";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { addNotifyToken } from "../api/apiHelper";

let base_url = import.meta.env.VITE_base_url;
let otp_API = import.meta.env.EDUMARC_OTP_API;
let template_Id = import.meta.env.BSNL_TEMPLATE_ID;

const firebaseConfig = {
  apiKey: "AIzaSyDg1__Y23xsWzmIbfQRiV2WD8s2nMxvHSU",
  authDomain: "bromag-web.firebaseapp.com",
  projectId: "bromag-web",
  storageBucket: "bromag-web.appspot.com",
  messagingSenderId: "758673298399",
  appId: "1:758673298399:web:b9d8d4b4d3e3e5e8352a6a",
  measurementId: "G-36XD1B7QFE",
};

export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const getFireToken = () => {
  getToken(messaging, {
    vapidKey:
      "BL43BnIQnCwhTThzD9RK8n5pWQNZ9RkjuLtbqiIsBhF7kKQ6TwuIwg89oox8xUOFtMX7SZ6wyi4OZcDswmYglew",
  })
    .then(async (currentToken) => {
      if (currentToken) {
        console.log({ currentToken });
        if (
          localStorage.getItem("chgi5kjieaoyaiackaiw_bbcqgy4akacsaiq_bbcqgyyaq")
        ) {
          addNotifyToken(currentToken);
        }
        //
        // Send the token to your server and update the UI if necessary
        // ...
      } else {
        // Show permission request UI
        console.log(
          "No registration token available. Request permission to generate one."
        );
        // ...
      }
    })
    .catch((err) => {
      console.log("An error occurred while retrieving token. ", err);
      // ...
    });
};

export function requestPermission() {
  console.log("Requesting permission...");
  Notification.requestPermission()
    .then((permission) => {
      if (permission === "granted") {
        console.log("Notification permission granted.");
      } else {
        console.log("PErmission Denied!!");
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

// export const onMessageListener = async() =>{

//   try {
//     onMessage
//   } catch (error) {

//   }
// }
//   new Promise((resolve) => {
//     onMessage(messaging, (payload) => {
//       console.log("foreground messsage", payload);
//       resolve(payload);
//     });
//   });

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
