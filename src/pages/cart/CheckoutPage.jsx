import React, { useEffect, useRef, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import {
  Button,
  Divider,
  Drawer,
  Empty,
  Modal,
  Radio,
  message,
  notification,
} from "antd";
import AddNewAddress from "./AddNewAddress";
import { useLocation, useNavigate } from "react-router-dom";
import {
  addOnlineOrder,
  decrementCartQuantity,
  getCurrentUserCartProducts,
  getDeliveryAddress,
  incrementCartQuantity,
  removeSoloFromCart,
} from "../../helper/api/apiHelper";
import _ from "lodash";
import LoadingScreen from "../../components/LoadingScreen";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import { GoArrowLeft } from "react-icons/go";
import { useParams } from "react-router-dom";
import { CiCreditCard1 } from "react-icons/ci";
import { TbTruckDelivery } from "react-icons/tb";
import { LuMonitorSmartphone } from "react-icons/lu";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";

const CheckoutPage = () => {
  const [changeRight, setChangeRight] = useState(false);
  const location = useLocation();
  const [allDeliveryAddress, setAllDeliveryAddress] = useState([]);
  const [selectedDeliveryAddress, setSelectedDeliveryAddress] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPlaceOrder, setLoadingPlaceOrder] = useState(false);
  // const [dummy, setDummy] = useState(false);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [cartData, setCartData] = useState([]);
  const navigate = useNavigate();
  const [bannersData, setbannersData] = useState([1, 2, 3, 4, 5]);
  const ProductInstructions = useSelector(
    (state) => state.auth.foodInstructions
  );
  const [paymentMethod, setPaymentMethod] = useState("COD");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchData = async () => {
    try {
      let order_ref = "online_order";
      setLoading(true);
      let formdatas = {
        order_ref: order_ref,
        bookingref: _.get(location, "state.table_details._id", ""),
      };
      const result = await getCurrentUserCartProducts(
        JSON.stringify(formdatas)
      );

      console.log(result, " ia am result for cvatrr");
      if (_.isEmpty(_.get(result, "data.data", []))) {
        navigate(-1);
      }
      setCartData(_.get(result, "data.data", []));
      const address = await getDeliveryAddress();
      setAllDeliveryAddress(_.get(address, "data.data", []));
      setSelectedDeliveryAddress(_.get(address, "data.data[0]", []));
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      return notification.error({ message: "Something went wrong" });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getSingleItemTotalPrice = (id) => {
    try {
      let filters = cartData.filter((res) => {
        return id === res._id;
      });

      return (
        _.get(filters, "[0].productRef.discountPrice", 0) *
        _.get(filters, "[0].quantity", 0)
      );
    } catch (err) {
      notification.error({ message: "Something went wrong" });
    }
  };

  const handlePlaceOrder = async () => {
    try {
      setLoadingPlaceOrder(true);

      let food_data = cartData.map((res) => {
        const typeRefId = _.get(res, "typeRef", "");
        const productRef = _.get(res, "productRef", "");
        // const selectedType = _.get(res, "productRef.types", []).find(
        //   (type) => type._id === typeRefId
        // );
        // const price = selectedType
        //   ? selectedType.price
        //   : _.get(res, "productRef.discountPrice", "");

        const price = typeRefId.Type
          ? typeRefId.TypeOfferPrice
            ? typeRefId.TypeOfferPrice
            : typeRefId.TypePrice
          : productRef.discountPrice
          ? parseFloat(productRef.discountPrice)
          : parseFloat(productRef.price);

        return {
          id: res._id,
          pic: _.get(res, "productRef.image", ""),
          foodName: _.get(res, "productRef.name", ""),
          foodPrice: price, // Consider the type price
          originalPrice: _.get(res, "productRef.discountPrice", ""),
          foodQuantity: _.get(res, "quantity", ""),
          type: typeRefId.Type ? typeRefId.Type : "Regular",
        };
      });

      let formData = {
        customerName: _.get(selectedDeliveryAddress, "name", ""),
        mobileNumber: _.get(selectedDeliveryAddress, "mobileNumber", ""),
        billAmount: _.get(getTotalAmount(), "Total_amount", 0),
        gst: _.get(getTotalAmount(), "gstPrice", 0),
        deliveryCharge: _.get(getTotalAmount(), "deliverCharagePrice", 0),
        packingCharge: _.get(getTotalAmount(), "packingPrice", 0),
        transactionCharge: _.get(getTotalAmount(), "transactionPrice", 0),
        couponAmount: _.get(getTotalAmount(), "couponDiscount", 0),
        itemPrice: _.get(getTotalAmount(), "itemPrice", 0),
        orderedFood: food_data,
        payment_mode: paymentMethod,
        location: selectedDeliveryAddress,
        instructions: ProductInstructions,
        status: "placed",
        orderId:
          "BIPL031023" +
          uuidv4()?.slice(0, 4)?.toUpperCase() +
          moment(new Date()).format("DMy"),
      };
      await addOnlineOrder(formData);
      notification.success({
        message: "Your order has been successfully placed.",
      });
      navigate("/profile-online-order");
    } catch (err) {
      notification.error({ message: "Something went wrong" });
    } finally {
      setLoadingPlaceOrder(false);
    }
  };

  const handleIncement = async (id) => {
    try {
      await incrementCartQuantity(id);
      message.success("quantity updated");
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };
  const handleClickDecrement = async (id, count) => {
    try {
      if (count > 1) {
        await decrementCartQuantity(id);
        message.success("quantity updated");
      } else {
        await removeSoloFromCart(id);
        message.success("Food removed from cart");
      }
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };
  const getTotalAmount = () => {
    // let itemPrice = _.sum(
    //   cartData.map((res) => {
    //     const typeRefId = _.get(res, "typeRef", "");
    //     const selectedType = _.get(res, "productRef.types", []).find(
    //       (type) => type._id === typeRefId
    //     );
    //     const price = selectedType
    //       ? selectedType.price
    //       : _.get(res, "productRef.discountPrice", "");

    //     return Number(price) * res.quantity;
    //   })
    // );

    let itemPrice = _.sum(
      cartData?.map((res) => {
        const typeRefId = _.get(res, "typeRef", "");
        const productRef = _.get(res, "productRef", "");
        const selectedType = _.get(res, "productRef.types", []).find(
          (type) => type._id === typeRefId
        );

        // const price = selectedType
        //   ? selectedType.price
        //   : _.get(res, "productRef.discountPrice", "");

        const price = typeRefId.Type
          ? typeRefId.TypeOfferPrice
            ? typeRefId.TypeOfferPrice
            : typeRefId.TypePrice
          : productRef.discountPrice
          ? parseFloat(productRef.discountPrice)
          : parseFloat(productRef.price);

        return Number(price) * res.quantity;
      })
    );

    let itemdiscountPrice = _.sum(
      cartData.map((res) => {
        return Number(_.get(res, "productRef.price", "")) * res.quantity;
      })
    );

    let total_qty = _.sum(
      cartData.map((res) => {
        return res.quantity;
      })
    );

    let gstPrice = (itemPrice * 5) / 100;
    let deliverCharagePrice = 50;
    let packingPrice = (itemPrice * 10) / 100;
    let transactionPrice = (itemPrice * 5) / 100;
    let couponDiscount = 0;

    let total_amount =
      itemPrice +
      gstPrice +
      deliverCharagePrice +
      packingPrice +
      transactionPrice -
      couponDiscount;

    let total_for_dining = itemPrice + gstPrice;
    let total_dc_price =
      _.get(location, "pathname", "") !== "/dining-cart"
        ? total_for_dining - itemPrice + itemdiscountPrice
        : total_amount - itemPrice + itemdiscountPrice;

    return {
      total_amount: total_amount,
      itemPrice: itemPrice,
      gstPrice: gstPrice,
      deliverCharagePrice: deliverCharagePrice,
      packingPrice: packingPrice,
      transactionPrice: transactionPrice,
      couponDiscount: couponDiscount,
      Total_amount: total_amount.toFixed(2),
      total_for_dining: total_for_dining,
      total_qty: total_qty,
      itemdiscountPrice: total_dc_price,
    };
  };

  return (
    <>
      <div className="bg-gradient-to-tr from-blue-100 via-blue-200 to-blue-300 p-5">
        <div className="lg:pt-14 pt-10">
          <div className="flex items-center gap-x-2">
            <IoIosArrowBack
              onClick={() => {
                navigate(-1);
              }}
              className="!cursor-pointer text-2xl"
            />
            <div>
              <div className="font-bold lg:text-4xl  tracking-wider ">
                Your food cart
              </div>
            </div>
          </div>
        </div>

        {/* ==================================== */}

        <div>
          <Swiper
            modules={[Autoplay]}
            className=""
            autoplay={{
              delay: 2000,
            }}
            loop={true}
            pagination={{
              clickable: true,
            }}
          >
            {bannersData.map((res, index) => {
              return (
                <SwiperSlide key={index}>
                  <div className="w-full h-1/5 flex justify-center ">
                    <div className="flex justify-center items-center gap-4 backdrop:blur-2xl bg-white/30 w-[400px] h-28 rounded-2xl shadow-md">
                      <img
                        src="/assets/icons/Logo.jpeg"
                        className="w-16 h-16 rounded-2xl object-cover"
                        alt=""
                      />
                      <div className="flex flex-col">
                        <h1 className="text-white text-2xl font-extrabold">
                          FLAT 50% OFF
                        </h1>
                        <p className="text-white text-sm text-start">
                          Click and claim your offer
                        </p>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
        {/* ==================================== */}

        <div className="flex flex-col gap-y-4  mt-4 p-5 justify-center items-center ">
          <div className="py-6 px-6 ultraSm:w-full lg:w-1/2 bg-white h-20 rounded-xl flex justify-between items-center border">
            <CiCreditCard1 className="text-3xl" />
            <span className="text-center font-sans text-sm font-bold text-black">
              Credit / Debit cards
            </span>
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                className="radio  ml-2"
                checked={paymentMethod === "Credit/Debit"}
                onChange={() => setPaymentMethod("Credit/Debit")}
              />
            </label>
          </div>
          <div className="py-6 px-6  ultraSm:w-full lg:w-1/2 bg-white h-20 rounded-xl flex justify-between items-center border">
            <LuMonitorSmartphone className="text-3xl" />
            <span className="text-center font-sans text-sm font-bold text-black">
              UPI Payment
            </span>
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                className="radio  ml-2"
                checked={paymentMethod === "UPI"}
                onChange={() => setPaymentMethod("UPI")}
              />
            </label>
          </div>
          <div className="py-6 px-6  ultraSm:w-full lg:w-1/2 bg-white h-20 rounded-xl flex justify-between items-center border">
            <TbTruckDelivery className="text-3xl" />
            <span className="text-center font-sans text-sm font-bold text-black">
              Cash on delivery
            </span>
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                className="radio  ml-2"
                checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")}
              />
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-y-4 mt-4 p-5 justify-center items-center ">
          <div
            className="lg:w-[450px] h-[80px] center_div bg-black cursor-pointer  rounded-2xl text-[#ffffff] lg:text-lg font-semibold"
            onClick={handlePlaceOrder}
          >
            Proceed & Continue to pay
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
