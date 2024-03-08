importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js"
);

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
  console.log("message recieved", payload?.data);
  const notificationTitle = payload?.data?.title;
  const notificationOptions = {
    body: payload?.data?.body,
    icon: payload?.data?.logo,
    data: {
      url: payload?.data?.url,
    },
    vibrate: [200, 100, 200],

    requireInteraction: true,
    // sound: Sound,
  };

  // self.addEventListener("notificationclick", (event) => {
  //   console.log(event);
  //   event.waitUntil(
  //     clients.openWindow("https://dev.iftar.bromag.in/") // Replace with your desired URL
  //   );
  // });

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
  console.log("On notification click: ", event, event.notification.tag);
  event.notification.close();

  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(
    clients
      .matchAll({
        type: "window",
      })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === "/" && "focus" in client) return client.focus();
        }
        if (clients.openWindow) return clients.openWindow("/");
      })
  );
});
