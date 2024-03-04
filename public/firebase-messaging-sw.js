importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js"
);

import Sound from "./assets/notify.mp3";
import Logo from "./assets/logo.png";
const firebaseConfig = {
  apiKey: "AIzaSyDg1__Y23xsWzmIbfQRiV2WD8s2nMxvHSU",
  authDomain: "bromag-web.firebaseapp.com",
  projectId: "bromag-web",
  storageBucket: "bromag-web.appspot.com",
  messagingSenderId: "758673298399",
  appId: "1:758673298399:web:b9d8d4b4d3e3e5e8352a6a",
  measurementId: "G-36XD1B7QFE",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("message recieved", payload?.data?.title);
  const notificationTitle = payload?.data?.title;
  const notificationOptions = {
    body: payload?.data?.body,
    icon: Logo,
    sound: Sound,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
