import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/home";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import Online from "../pages/online-order";
import Cusinedetails from "../pages/online-order/Cusinedetails";
import Contest from "../pages/contest/Contest";
import Bookingdetails from "../pages/booking/Bookingdetails";
import Cart from "../pages/cart/Cart";
import Delivery from "../pages/cart/Delivery";
import CallForOrder from "../pages/callingOrder/CallForOrder";
import TakeAway from "../pages/takeaway";
import TakeawayCusines from "../pages/takeaway/TakeawayCusines";
import TakeAwayCart from "../pages/takeaway/TakeAwayCart";
import Booking from "../pages/booking";
import Dining from "../pages/dining";
import DiningCusines from "../pages/dining/DiningCusines";
import Profile from "../pages/profile";
import DiningPayment from "../pages/dining/DiningPayment";
import TermsAndCondition from "../pages/footer/termsAndCondition";
import Cancelation from "../pages/footer/cancelation";
import Privacy from "../pages/footer/privacy";
import WhoAreWe from "../pages/footer/whoAreWe";
import OnlineOrders from "../pages/profile/OnlineOrders";
import MyProfile from "../pages/profile/MyProfile";
import TakeAwayOrders from "../pages/profile/TakeAwayOrders";
import BookedTables from "../pages/profile/BookedTables";
import DeliveryAddress from "../pages/profile/DeliveryAddress";
import YourReview from "../pages/profile/YourReview";
import YourContext from "../pages/profile/YourContext";
import CallforOrders from "../pages/profile/CallforOrders";
import ExploreAdd from "../components/ExploreAdd";
import Layout from "../pages/profile/Layout";
import ProductDetails from "../pages/home/ProductDetails";
import CheckoutPage from "../pages/cart/CheckoutPage";
import TakeAwayChackout from "../pages/takeaway/TakeAwayChackout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/online-order",
    element: <App />,
    children: [
      {
        path: "/online-order",
        element: <Online />,
      },
    ],
  },
  {
    path: "/cusines",
    element: <App />,
    children: [
      {
        path: "/cusines",
        element: <Cusinedetails />,
      },
    ],
  },
  {
    path: "/book-my-tables",
    element: <App />,
    children: [
      {
        path: "/book-my-tables",
        element: <Booking />,
      },
    ],
  },
  {
    path: "/play-my-contest",
    element: <App />,
    children: [
      {
        path: "/play-my-contest",
        element: <Contest />,
      },
    ],
  },
  {
    path: "/booking-details",
    element: <App />,
    children: [
      {
        path: "/booking-details",
        element: <Bookingdetails />,
      },
    ],
  },
  {
    path: "/my-cart",
    element: <App />,
    children: [
      {
        path: "/my-cart",
        element: <Cart />,
      },
    ],
  },
  {
    path: "/delivery-address",
    element: <App />,
    children: [
      {
        path: "/delivery-address",
        element: <Delivery />,
      },
    ],
  },
  {
    path: "/call-for-order",
    element: <App />,
    children: [
      {
        path: "/call-for-order",
        element: <CallForOrder />,
      },
    ],
  },
  {
    path: "/take-away",
    element: <App />,
    children: [
      {
        path: "/take-away",
        element: <TakeAway />,
      },
    ],
  },
  {
    path: "/take-away-cusiness",
    element: <App />,
    children: [
      {
        path: "/take-away-cusiness",
        element: <TakeawayCusines />,
      },
    ],
  },
  {
    path: "/take-away-cart",
    element: <App />,
    children: [
      {
        path: "/take-away-cart",
        element: <TakeAwayCart />,
      },
    ],
  },
  {
    path: "/online-order-cart",
    element: <App />,
    children: [
      {
        path: "/online-order-cart",
        element: <Cart />,
      },
    ],
  },
  {
    path: "/online-order-checkout",
    element: <App />,
    children: [
      {
        path: "/online-order-checkout",
        element: <CheckoutPage />,
      },
    ],
  },
  {
    path: "/takeaway-checkout",
    element: <App />,
    children: [
      {
        path: "/takeaway-checkout",
        element: <TakeAwayChackout />,
      },
    ],
  },
  {
    path: "/dining",
    element: <App />,
    children: [
      {
        path: "/dining",
        element: <Dining />,
      },
    ],
  },
  {
    path: "/dining-cusines",
    element: <App />,
    children: [
      {
        path: "/dining-cusines",
        element: <DiningCusines />,
      },
    ],
  },
  {
    path: "/dining-cart",
    element: <App />,
    children: [
      {
        path: "/dining-cart",
        element: <Cart />,
      },
    ],
  },
  {
    path: "/dining-payment",
    element: <App />,
    children: [
      {
        path: "/dining-payment",
        element: <DiningPayment />,
      },
    ],
  },
  {
    path: "/profile",
    element: <App />,
    children: [
      {
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/my-account",
    element: <Layout />,
    children: [
      {
        path: "/my-account",
        element: <MyProfile />,
      },
    ],
  },
  {
    path: "/profile-online-order",
    element: <Layout />,
    children: [
      {
        path: "/profile-online-order",
        element: <OnlineOrders />,
      },
    ],
  },
  {
    path: "/profile-take-away-order",
    element: <Layout />,
    children: [
      {
        path: "/profile-take-away-order",
        element: <TakeAwayOrders />,
      },
    ],
  },
  {
    path: "/profile-table-booking",
    element: <Layout />,
    children: [
      {
        path: "/profile-table-booking",
        element: <BookedTables />,
      },
    ],
  },
  {
    path: "/profile-delivery-address",
    element: <Layout />,
    children: [
      {
        path: "/profile-delivery-address",
        element: <DeliveryAddress />,
      },
    ],
  },
  {
    path: "/profile-my-reviews",
    element: <Layout />,
    children: [
      {
        path: "/profile-my-reviews",
        element: <YourReview />,
      },
    ],
  },
  {
    path: "/profile-my-contest",
    element: <Layout />,
    children: [
      {
        path: "/profile-my-contest",
        element: <YourContext />,
      },
    ],
  },
  {
    path: "/profile-call-for-order",
    element: <Layout />,
    children: [
      {
        path: "/profile-call-for-order",
        element: <CallforOrders />,
      },
    ],
  },
  {
    path: "/termsandcondition",
    element: <App />,
    children: [
      {
        path: "/termsandcondition",
        element: <TermsAndCondition />,
      },
    ],
  },
  {
    path: "/cancellation",
    element: <App />,
    children: [
      {
        path: "/cancellation",
        element: <Cancelation />,
      },
    ],
  },
  {
    path: "/privacy",
    element: <App />,
    children: [
      {
        path: "/privacy",
        element: <Privacy />,
      },
    ],
  },
  {
    path: "/whoweare",
    element: <App />,
    children: [
      {
        path: "/whoweare",
        element: <WhoAreWe />,
      },
    ],
  },
  {
    path: "/explore-advertisement",
    element: <App />,
    children: [
      {
        path: "/explore-advertisement",
        element: <ExploreAdd />,
      },
    ],
  },
  {
    path: "/food-deatils",
    element: <App />,
    children: [
      {
        path: "/food-deatils",
        element: <ProductDetails />,
      },
    ],
  },
]);

export default router;
