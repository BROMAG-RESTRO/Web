importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyB6gHF1LhaU83ufRAe5Plc43P-0SpA8nd4",
  authDomain: "bromag-notification.firebaseapp.com",
  projectId: "bromag-notification",
  storageBucket: "bromag-notification.appspot.com",
  messagingSenderId: "845209637334",
  appId: "1:845209637334:web:5fc2dc826d71cffc065477",
  measurementId: "G-VVL31YWW22",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => { 
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
