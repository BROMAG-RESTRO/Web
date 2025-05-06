import { io } from "socket.io-client";
let base_url = import.meta.env.VITE_base_url;
// "undefined" means the URL will be computed from the `window.location` object
const URL = base_url;

// export const BASEURL = "https://backendapi.qello.io";

export const socket = io(URL, {
  transports: ["websocket"],
  extraHeaders: {
    "Access-Control-Allow-Origin": "*",
    // Add any other necessary headers here
  },
});
