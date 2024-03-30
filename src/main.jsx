import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./App.css";
import router from "./routes/Routes.jsx";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import { setMessage } from "./redux/authSlice.jsx";
import sound from "./assets/notify.mp3";
import { messaging, requestPermission } from "./helper/firebase";
import { notification } from "antd";
import { onMessage } from "firebase/messaging";
function handleNotify(payload) {
  console.log("notify", payload);

  store.dispatch(setMessage(payload));
  const audio = new Audio(sound);
  if (audio) {
    audio?.play();
  }
  notification.success({
    message: payload?.data?.body,
  });
}

requestPermission();
onMessage(messaging, (data) => {
  console.log("foreground messsager", data);
  handleNotify(data);
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
