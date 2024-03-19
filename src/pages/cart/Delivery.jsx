/* eslint-disable no-empty */
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
import React, { useEffect, useState } from "react";
import AddNewAddress from "./AddNewAddress";
import { useLocation, useNavigate } from "react-router-dom";
import {
  addOnlineOrder,
  decrementCartQuantity,
  getCurrentUserCartProducts,
  getDeliveryAddress,
  getUserCoupons,
  incrementCartQuantity,
  removeSoloFromCart,
} from "../../helper/api/apiHelper";
import _ from "lodash";
import LoadingScreen from "../../components/LoadingScreen";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import { GoArrowLeft } from "react-icons/go";
import { IoIosArrowBack } from "react-icons/io";
import CheckoutPage from "./CheckoutPage";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import explore from "../../assets/explore_food.png";
import nocoupon from "../../assets/no.png";

import "../../assets/css/address-modal.css";
import { calculateFare, couponCheck } from "../../helper/utils";
import { addCoupon } from "../../redux/authSlice";
const Delivery = () => {
  const [changeRight, setChangeRight] = useState(false);
  const ProductInstructions = useSelector(
    (state) => state.auth.foodInstructions
  );
  const dispatch = useDispatch();
  const charges = useSelector((state) => state.auth.charges);
  const couponData = useSelector((state) => state.auth.coupon);
  const location = useLocation();
  const [allDeliveryAddress, setAllDeliveryAddress] = useState([]);
  const [selectedDeliveryAddress, setSelectedDeliveryAddress] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPlaceOrder, setLoadingPlaceOrder] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({
    latitude: null,
    longitude: null,
  });
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [cartData, setCartData] = useState([]);
  const navigate = useNavigate();
  let routepath = _.get(location, "pathname", "");

  //coupons
  const [couponError, setCouponError] = useState(null);
  const [couponModal, setCouponModal] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [coupon, setCoupon] = useState(couponData);
  //coupons

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const DININGMODE = charges?.dining?.mode;
  const DININGPERCENTAGE =
    charges?.dining?.mode === "percentage"
      ? charges?.dining?.value / 100
      : charges?.dining?.value;

  // const handleGetCurrentLocation = () => {
  //   if (navigator.geolocation) {
  //     const confirmation = window.confirm("Share your current location?");
  //     if (confirmation) {
  //       navigator.geolocation.getCurrentPosition(
  //         (position) => {
  //           const latitude = position.coords.latitude;
  //           const longitude = position.coords.longitude;

  //           setCurrentLocation({
  //             latitude: latitude,
  //             longitude: longitude,
  //           });
  //         },
  //         (error) => {
  //           console.error("Error getting location:", error);
  //         }
  //       );
  //     }
  //   } else {
  //     console.error("Geolocation is not supported by this browser.");
  //   }
  // };

  const currentAddress = {
    name: "Current Location",
    streetName: "Current Street",
    landmark: "Current Landmark",
    city: "Current City",
    picCode: "Current PinCode",
    latitude: currentLocation.latitude,
    longitude: currentLocation.longitude,
  };

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
      console.log(result, "res from delivery");
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
  const fetchCoupons = async (load = true) => {
    try {
      const result = await getUserCoupons();

      // Assuming result.data.data is an array

      console.log("coupons", result.data.data);
      setCoupons(_.get(result, "data", []));
    } catch (err) {
      console.log(err);

      return notification.error({ message: "Something went wrong" });
    }
  };

  useEffect(() => {
    fetchData();
    fetchCoupons();
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
        return {
          id: res._id,
          pic: _.get(res, "productRef.image", ""),
          foodName: _.get(res, "productRef.name", ""),
          foodPrice: _.get(res, "productRef.price", ""),
          originalPrice: _.get(res, "productRef.discountPrice", ""),
          foodQuantity: _.get(res, "quantity", ""),
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
    let cgst = charges?.gst?.value;
    let gstMode = charges?.gst?.mode;
    // let delivery = charges?.delivery?.value;
    // let deliveryMode = charges?.delivery?.mode;
    let packing = charges?.packing?.value;
    let packingMode = charges?.packing?.mode;
    let transaction = charges?.transaction?.value;
    let transactionMode = charges?.transaction?.mode;
    let dining = charges?.dining?.value;
    let diningMode = charges?.dining?.mode;
    let distance = selectedDeliveryAddress?.distance;

    let deliveryFee = calculateFare(distance, charges?.delivery);
    console.log({ deliveryFee, distance, selectedDeliveryAddress });
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
    let isDeliveryFree = false;
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

    let couponDiscount = 0;
    let couponPrice = 0;
    let couponAppliedPrice = itemPrice;
    if (coupon) {
      const validPurchase = coupon.min_purchase
        ? itemPrice >= coupon.min_purchase
        : true;

      if (validPurchase) {
        let discount =
          coupon?.discount_type === "percentage"
            ? (itemPrice * coupon?.discount) / 100
            : coupon?.discount;
        couponPrice =
          discount <= coupon?.max_discount ? discount : coupon?.max_discount;

        isDeliveryFree = coupon?.deliveryFree;
        couponAppliedPrice = couponAppliedPrice - couponPrice;
      } else {
        couponPrice = 0;
        couponAppliedPrice = itemPrice;
      }
    } else {
      couponPrice = 0;
      couponAppliedPrice = itemPrice;
    }
    let gstPrice =
      gstMode === "percentage" ? (couponAppliedPrice * cgst) / 100 : cgst;
    let deliverCharagePrice = deliveryFee;
    let packingPrice =
      packingMode === "percentage"
        ? (couponAppliedPrice * packing) / 100
        : packing;
    let transactionPrice =
      transactionMode === "percentage"
        ? (couponAppliedPrice * transaction) / 100
        : transaction;

    if (coupon?.deliveryFree) {
      deliverCharagePrice = 0;
    }
    let total_amount =
      couponAppliedPrice +
      gstPrice +
      deliverCharagePrice +
      packingPrice +
      transactionPrice;

    let total_for_dining = itemPrice + gstPrice;
    let total_dc_price =
      _.get(location, "pathname", "") !== "/dining-cart"
        ? total_for_dining - itemPrice + itemdiscountPrice
        : total_amount - itemPrice + itemdiscountPrice;

    const orderType = routepath?.includes("online")
      ? "online"
      : routepath?.includes("takeaway")
      ? "takeaway"
      : "null";

    console.log({
      total_amount: total_amount?.toFixed(0),
      itemPrice: itemPrice?.toFixed(0),
      gstPrice: gstPrice?.toFixed(0),
      deliverCharagePrice: deliverCharagePrice?.toFixed(0),
      packingPrice: packingPrice?.toFixed(0),
      transactionPrice: transactionPrice?.toFixed(0),
      couponDiscount: couponPrice?.toFixed(0),
      Total_amount: total_amount?.toFixed(0),
      total_for_dining: total_for_dining?.toFixed(0),
      total_qty: total_qty,
      itemdiscountPrice: total_dc_price?.toFixed(0),
      isDeliveryFree,
    });

    return {
      total_amount: total_amount?.toFixed(0),
      itemPrice: itemPrice?.toFixed(0),
      gstPrice: gstPrice?.toFixed(0),
      deliverCharagePrice: deliverCharagePrice?.toFixed(0),
      packingPrice: packingPrice?.toFixed(0),
      transactionPrice: transactionPrice?.toFixed(0),
      couponDiscount: couponPrice?.toFixed(0),
      Total_amount: total_amount?.toFixed(0),
      total_for_dining: total_for_dining?.toFixed(0),
      total_qty: total_qty,
      itemdiscountPrice: total_dc_price?.toFixed(0),
      isDeliveryFree,
    };
  };

  const handleGoBack = () => {
    try {
      window.scrollTo(0, 0);
      navigate(-1);
    } catch (err) {}
  };

  return loading ? (
    <div>
      <LoadingScreen />
    </div>
  ) : (
    <div className="min-h-screen" id="delivery-container">
      {_.isEmpty(allDeliveryAddress) ? (
        <div className="min-h-screen center_div">
          <Empty
            description={
              <div>
                <span
                  className="text-blue-500 !cursor-pointer"
                  onClick={handleGoBack}
                >
                  go back
                </span>
                <div>
                  You currently have no address
                  <br /> add a new one by clicking this link.
                  <span
                    onClick={() => {
                      setChangeRight(true);
                      setOpen(true);
                    }}
                    className="text-blue-500 cursor-pointer"
                  >
                    &nbsp;here
                  </span>
                </div>
              </div>
            }
          />
        </div>
      ) : (
        <div className="w-screen min-h-screen lg:px-20 px-2 bg-[#ededed] pb-28">
          <div className="lg:pt-14 pt-10">
            <div className="flex items-center gap-x-2">
              <IoIosArrowBack
                onClick={() => {
                  navigate(-1);
                }}
                className="!cursor-pointer text-2xl"
              />
              <div>
                <div className="font-bold lg:text-5xl  text-[#3A3A3A] tracking-wider">
                  Your food cart
                </div>
              </div>
            </div>
          </div>

          {/* items */}
          <div className="flex justify-between items-start lg:pt-14 pt-8 lg:flex-row flex-col-reverse gap-y-8">
            {/* left */}
            {/* allDeliveryAddress */}

            <div className="flex flex-col gap-y-6 w-full">
              <div className="flex flex-col gap-y-6 w-full">
                <div className="text-dark3a_color font-semibold lg:text-2xl">
                  Select delivery address
                </div>
                {/* address */}
                <div className="lg:w-[450px] w-full min-h-[200px] gap-y-3 flex flex-col bg-white shadow-2xl shadow-[#00000040] rounded-2xl relative ">
                  <div className="flex justify-between items-center p-4">
                    <div className="font-semibold text-dark3a_color text-sm">
                      Delivery to this address
                    </div>
                    <div className="font-semibold text-dark3a_color text-sm">
                      {selectedDeliveryAddress?.addressType}
                    </div>
                  </div>
                  <address className="text-[#494949] capitalize font-normal pl-4 line-clamp-3 lg:text-lg text-sm lg:w-[90%]">
                    {_.get(selectedDeliveryAddress, "name", "")}
                    ,&nbsp;
                    {_.get(selectedDeliveryAddress, "streetName", "")}
                    ,&nbsp;
                    {_.get(selectedDeliveryAddress, "landMark", "")}
                    ,&nbsp;
                    {_.get(selectedDeliveryAddress, "city", "")}-
                    {_.get(selectedDeliveryAddress, "picCode", "")}
                  </address>
                  <div className="text-green_color pl-4 pb-20 text-sm">
                    Estimate time 30 min
                  </div>
                  {/* button */}
                  <div
                    onClick={() => {
                      setOpen(true);
                      setChangeRight(false);
                    }}
                    className="w-full h-[60px] bg-dark3a_color center_div absolute bottom-0 rounded-b-2xl cursor-pointer text-white"
                  >
                    Delivery here
                  </div>
                </div>
                {/* new address */}
                {/* <div
                  onClick={() => {}}
                  className="lg:w-[450px] w-full min-h-[100px] cursor-pointer bg-white border shadow-2xl shadow-[#00000040] rounded-2xl gap-x-5 center_div justify-start px-10"
                >
                  <div className="lg:w-[80px] lg:h-[80px] rounded-full center_div">
                    <img
                      src="/assets/icons/addresslocation.png"
                      alt=""
                      className="lg:w-[30px] w-[20px]"
                    />
                  </div>
                  <div className="font-medium text-dark3a_color lg:text-xl">
                    Select Current location.
                  </div>
                </div> */}

                <div
                  onClick={() => {
                    setChangeRight(true);
                    setOpen(true);
                  }}
                  className="lg:w-[450px] w-full min-h-[100px] cursor-pointer bg-white border shadow-2xl shadow-[#00000040] rounded-2xl gap-x-5 center_div justify-start px-10"
                >
                  <div className="lg:w-[80px] lg:h-[80px] rounded-full center_div">
                    <img
                      src="/assets/icons/addresslocation.png"
                      alt=""
                      className="lg:w-[30px] w-[20px]"
                    />
                  </div>
                  <div className="font-medium text-dark3a_color lg:text-xl">
                    Add another address
                  </div>
                </div>
                {/* proceed button */}

                <div
                  onClick={() =>
                    navigate(`/online-order-checkout`, {
                      state: {
                        address: selectedDeliveryAddress,
                      },
                    })
                  }
                  className="block lg:w-[450px] h-[80px] center_div bg-black cursor-pointer rounded-2xl text-[#EFEFEF] lg:text-xl font-semibold justify-center items-center py-7"
                >
                  <h1 className="text-center ">Proceed & Continue to pay</h1>
                </div>
              </div>
            </div>

            {/* right */}

            <div
              className="lg:w-[70%] w-full  overflow-y-auto bg-white rounded-2xl lg:px-10 pt-0 flex flex-col gap-y-2 pb-10 px-2"
              id="address-cart-summary"
            >
              {/* foods */}
              <div className="flex flex-col gap-y-2 pt-4 ">
                {cartData.map((res, index) => {
                  const productId = res._id;
                  const productRef = _.get(res, "productRef", "");
                  const typeRefId = _.get(res, "typeRef", "");
                  const selectedType = _.get(res, "productRef.types", []).find(
                    (type) => type._id === typeRefId
                  );

                  // Determine the price to display based on whether the selectedType exists
                  // const displayPrice = selectedType
                  //   ? selectedType.price * res.quantity
                  //   : _.get(res, "productRef.discountPrice", "") * res.quantity;

                  const displayPrice = typeRefId.Type
                    ? (typeRefId.TypeOfferPrice
                        ? typeRefId.TypeOfferPrice
                        : typeRefId.TypePrice) * _.get(res, "quantity", "")
                    : (productRef.discountPrice
                        ? parseFloat(productRef.discountPrice)
                        : parseFloat(productRef.price)) *
                      _.get(res, "quantity", "");

                  const displayType = typeRefId.Type;

                  // const displayType = selectedType
                  //   ? selectedType.type
                  //   : "Regular";

                  return (
                    <div
                      key={index}
                      className="relative justify-between items-center rounded-2xl shadow-2xl flex flex-col overflow-hidden w-full"
                    >
                      {/* food picture */}

                      <div className="items-center rounded-t-2xl shadow-2xl flex flex-row overflow-hidden w-full">
                        <div className=" p-3 ">
                          <img
                            src={_.get(res, "productRef.image", "")}
                            alt=""
                            className=" md:h-36 md:w-36 ultraSm:h-16 ultraSm:w-16 lg:h-[110px] lg:w-[110px] rounded-lg object-cover"
                          />
                        </div>

                        {/* name icn/dec button */}

                        <div className=" flex items-center justify-between w-full">
                          <div className="flex flex-col pb-0  ">
                            <div className="flex items-start justify-between ">
                              {_.get(res, "productRef.name", "")}
                            </div>
                            <div className="text-[#B6B6B6] w-[80px]  flex justify-start whitespace-nowrap">
                              {" "}
                              {_.get(res, "quantity", "")}
                              &times;
                              {displayType ? displayType : "Regular"}{" "}
                            </div>
                          </div>

                          <div className="flex justify-between whitespace-nowrap px-5 ml-auto">
                            <div className="text-lg text-[#3A3A3A] flex justify-end">
                              &#8377; {displayPrice}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="h-6 w-full bg-white px-7 flex gap-2 border border-5">
                        {Object.entries(ProductInstructions).map(
                          ([key, value]) =>
                            key === res._id
                              ? value.map((instruction, index) => (
                                  <p key={index} className="text-[10px]">
                                    {instruction},
                                  </p>
                                ))
                              : null
                        )}
                      </div>

                      {/* count int */}
                    </div>
                  );
                })}
              </div>
              <Divider />
              {/* price deatils */}
              <div className="flex flex-col gap-y-6 pb-2">
                {/* price */}
                <h1 className="text-[#292929] lg:text-2xl font-semibold">
                  Order summary
                </h1>
                <div className="flex  justify-between pt-4 border-b border-[#C1C1C1]">
                  <div className="flex gap-x-2">
                    <div className="text-[#3F3F3F] font-normal">Item price</div>{" "}
                    <div className="text-[#B6B6B6]">
                      {" "}
                      &times; {_.get(getTotalAmount(), "total_qty", 0)}
                    </div>
                  </div>
                  <div className="text-lg text-[#3A3A3A]">
                    &#8377; {_.get(getTotalAmount(), "itemPrice", 0)}
                  </div>
                </div>
                {coupon &&
                Number(_.get(getTotalAmount(), "couponDiscount", 0)) ? (
                  <div className="flex  justify-between pt-4 border-b border-[#C1C1C1] lg:text-lg text-sm">
                    <div className="flex gap-x-2">
                      <div className="text-[#3F3F3F] font-normal">
                        Coupon Discount
                      </div>
                    </div>

                    <div className="lg:text-lg text-[red]">
                      - &#8377; {_.get(getTotalAmount(), "couponDiscount", 0)}
                    </div>
                  </div>
                ) : null}
                {/* gst */}
                <div className="flex  justify-between border-b border-[#C1C1C1] lg:text-lg text-sm">
                  <div className="flex gap-x-2">
                    <div className="text-[#3F3F3F] font-normal">Taxes</div>{" "}
                  </div>
                  <div className=" text-[#3A3A3A]">
                    &#8377; {_.get(getTotalAmount(), "gstPrice", 0)}
                  </div>
                </div>
                {/* delivery charge */}
                <div className="flex  justify-between border-b border-[#C1C1C1] lg:text-lg text-sm">
                  <div className="flex gap-x-2">
                    <div className="text-[#3F3F3F] font-normal">
                      Delivery Charge
                    </div>{" "}
                  </div>
                  <div className=" text-[#3A3A3A]">
                    {_.get(getTotalAmount(), "isDeliveryFree", 0) ? (
                      "FREE DELIVERY"
                    ) : (
                      <p>
                        &#8377;{" "}
                        {_.get(getTotalAmount(), "deliverCharagePrice", 0)}
                      </p>
                    )}{" "}
                  </div>
                </div>
                {/* Packing charges */}
                {Number(_.get(getTotalAmount(), "packingPrice", 0)) ? (
                  <div className="flex  justify-between border-b border-[#C1C1C1] lg:text-lg text-sm">
                    <div className="flex gap-x-2">
                      <div className="text-[#3F3F3F] font-normal">
                        {" "}
                        Restaurant Packing Charges
                      </div>{" "}
                    </div>
                    <div className=" text-[#3A3A3A]">
                      <div className="lg:text-lg text-[#3A3A3A]">
                        &#8377; {_.get(getTotalAmount(), "packingPrice", 0)}
                      </div>
                    </div>
                  </div>
                ) : null}
                {/* Transaction charges */}
                {Number(_.get(getTotalAmount(), "transactionPrice", 0)) ? (
                  <div className="flex  justify-between border-b border-[#C1C1C1] lg:text-lg text-sm">
                    <div className="flex gap-x-2">
                      <div className="text-[#3F3F3F] font-normal">
                        {" "}
                        Platform Fee
                      </div>{" "}
                    </div>

                    <div className=" text-[#3A3A3A]">
                      &#8377; {_.get(getTotalAmount(), "transactionPrice", 0)}
                    </div>
                  </div>
                ) : null}

                {/* Coupon discount */}
                {/* <div className="flex  justify-between border-b border-[#C1C1C1] lg:text-lg text-sm">
                                    <div className="flex gap-x-2">
                                        <div className="text-[#3F3F3F] font-normal">
                                            Coupon discount
                                        </div>{" "}
                                    </div>
                                    <div className=" text-yellow_color font-medium">
                                        &#8377; 0
                                    </div>
                                </div> */}
                {/* total amount */}
                <div className="flex  justify-between pt-6">
                  <div className="flex gap-x-2">
                    <div className="text-[#3F3F3F] font-normal">
                      Total Amount
                    </div>{" "}
                  </div>
                  <div className="text-lg text-[#3A3A3A] font-medium flex items-center gap-x-2">
                    {/* <div className="text-[rgb(87,87,87)] relative text-red-500">
                                            &#8377;{" "}
                                            {_.get(
                                                getTotalAmount(),
                                                `itemdiscountPrice`,
                                                0
                                            )}
                                            <img
                                                src="/assets/icons/linecross.png"
                                                alt=""
                                                className="absolute top-1"
                                            />
                                        </div> */}

                    <div className="text-green-500 font-bold">
                      &#8377;
                      {_.get(getTotalAmount(), "Total_amount", 0)}
                    </div>
                  </div>
                </div>
                {true ? (
                  <Button
                    block
                    type="text"
                    onClick={() => setCouponModal(true)}
                    className=" lg:h-[40px] h-[40px] text-xl   rounded-2xl cursor-pointer font-bold text-[orange]"
                  >
                    Apply Coupon
                  </Button>
                ) : null}
                {coupon ? (
                  <>
                    <div className="flex flex-row items-center center-div justify-center">
                      <p className="bg-white m-2 text-center p-2 rounded-xl text-[green] shadow">
                        Coupon Applied
                      </p>
                      <span
                        className="cursor-pointer font-medium"
                        onClick={() => {
                          setCoupon(null);
                          dispatch(addCoupon({ coupon: null, path: null }));
                        }}
                      >
                        X
                      </span>
                    </div>
                    {Number(_.get(getTotalAmount(), "couponDiscount", 0)) ? (
                      <div className="text-center text-lime-500 mt-1">
                        You have saved Rs.
                        {Number(_.get(getTotalAmount(), "couponDiscount", 0))}
                      </div>
                    ) : null}
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
      <Drawer
        title="Select Your Address"
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        destroyOnClose
        width={500}
      >
        <div className="lg:px-10 px-4">
          {changeRight ? (
            <AddNewAddress
              setChangeRight={setChangeRight}
              setOpen={setOpen}
              changeRight={changeRight}
              fetchData={fetchData}
            />
          ) : (
            <div className="flex flex-col gap-y-4">
              {allDeliveryAddress.map((res, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => {
                      setSelectedDeliveryAddress(res);
                      setOpen(false);
                    }}
                    className={`flex-col  break-words p-4 capitalize  justify-start pl-4 lg:text-lg   rounded-lg cursor-pointer ${
                      _.get(selectedDeliveryAddress, "_id", false) === res._id
                        ? "!bg-black/90 text-white"
                        : "bg-slate-100"
                    }`}
                  >
                    <div className="font-bold">
                      {_.get(res, "addressType", "")}
                    </div>
                    <div>
                      {_.get(res, "name", "")},&nbsp;
                      {_.get(res, "streetName", "")},&nbsp;
                      {_.get(res, "landMark", "")},&nbsp;
                      {_.get(res, "city", "")}-{_.get(res, "picCode", "")}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Drawer>

      <Modal
        open={couponModal}
        centered
        width={"60vw"}
        title="Coupons"
        className="bg-white rounded-2xl"
        closable={true}
        footer={false}
        onCancel={() => {
          setCouponModal(false);
          setCouponError(null);
        }}
      >
        {/* <div>
              <div>
                <Formik
                  enableReinitialize
                  onSubmit={async (values, formik) => {
                    try {
                      const result = await checkCouponCode({
                        code: values?.code,
                      });
                      if (result?.status == 200 && result?.data) {
                        setCoupon(result?.data);
                        setCouponModal(false);
                        dispatch(addCoupon(result?.data));
                      } else {
                        formik.setFieldError("code", "Invalid Code");
                      }
                      console.log({ result });
                    } catch (error) {}
                  }}
                  initialValues={{
                    code: "",
                  }}
                  validationSchema={yup.object({
                    code: yup.string().required("code is required"),
                  })}
                >
                  {(formik) => {
                    return (
                      <>
                        <div class="flex items-center w-100 gap-2">
                          <input
                            value={formik.values.code}
                            type="text"
                            className="w-8/12 shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Coupon code"
                            onChange={formik.handleChange("code")}
                          />

                          <button
                            class="w-4/12 shadow bg-orange-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-3 px-4 rounded"
                            type="button"
                            onClick={formik.handleSubmit}
                          >
                            Apply
                          </button>
                        </div>
                        {formik.errors.code ? (
                          <p className="ms-1 text-medium text-[red]">
                            {formik.errors.code}
                          </p>
                        ) : null}
                      </>
                    );
                  }}
                </Formik>
              </div>
            </div> */}
        {couponError?.msg ? (
          <div className="p-2 bg-red-400 text-white text-center">
            {couponError?.msg}
          </div>
        ) : null}
        <div className="coupon_container">
          {coupons?.length ? (
            coupons?.map((cd, i) => {
              return (
                <React.Fragment key={i}>
                  <div
                    className="coupon_wrapper"
                    onClick={() => {
                      const { valid, msg } = couponCheck({
                        coupon: cd,
                        amount: _.get(getTotalAmount(), `itemPrice`, 0),
                        type: "online",
                      });
                      console.log({ valid, msg });
                      if (valid) {
                        setCoupon(cd);
                        setCouponError(null);
                        setCouponModal(false);
                        dispatch(
                          addCoupon({
                            coupon: cd,
                            path: location?.pathname.includes("delivery")
                              ? "online"
                              : "takeaway",
                          })
                        );
                      } else {
                        setCouponError({ valid, msg });
                      }
                    }}
                  >
                    <img
                      src={cd?.image}
                      alt={`coupin${i}`}
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                </React.Fragment>
              );
            })
          ) : (
            <div className="flex flex-col justify-center items-center">
              <img
                src={nocoupon}
                alt="nocoupon"
                style={{
                  width: "150px",
                }}
              />
              <p className="font-lg text-1xl">Better luck next time!!</p>
            </div>
          )}
        </div>
      </Modal>
      <Modal
        open={openModal}
        className="bg-black rounded-2xl"
        closable={false}
        footer={false}
        onCancel={() => {
          setOpenModal(false);
        }}
      >
        <div className="flex flex-col gap-y-10 justify-start pt-4">
          <Radio value={1} checked={true} className="!text-white">
            Cash On Delivery
          </Radio>
          <Radio disabled className="!text-white">
            Credit / Debit / ATM Card
          </Radio>
          <Radio disabled className="!text-white">
            Net Banking
          </Radio>
          <Button
            onClick={handlePlaceOrder}
            loading={loadingPlaceOrder}
            className=" hover:!text-white min-w-[200px] center_div border-none min-h-[50px] text-md bg-primary_color rounded-lg text-white mt-10"
          >
            Place Order
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Delivery;
