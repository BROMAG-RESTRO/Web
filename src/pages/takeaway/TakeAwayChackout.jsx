import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
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
import { useLocation, useNavigate } from "react-router-dom";
import {
  addDiningOrder,
  addOnlineOrder,
  addTakeAwayOrder,
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
import { useDispatch, useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { addCoupon } from "../../redux/authSlice";

//=======================================================

const TakeAwayChackout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const coupon = useSelector((state) => state.auth.coupon);
  // ================= Instructions

  const [instructionInput, setInstructionInput] = useState(false);
  const [instructions, setInstructions] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const maxInstructionsToShow = 2;
  // const allInstructions = Object.values(productInstructions).flat(); //get instructions
  const [productInstructions, setProductInstructions] = useState([]);
  const [bannersData, setbannersData] = useState([1, 2, 3, 4, 5]);

  const ProductInstructions = useSelector(
    (state) => state.auth.foodInstructions
  );

  const handleAddInstruction = (productId, newInstruction) => {
    if (newInstruction.trim() !== "") {
      setProductInstructions((prevInstructions) => ({
        ...prevInstructions,
        [productId]: [...(prevInstructions[productId] || []), newInstruction],
      }));
    }
  };

  const handleShowMore = () => {
    setShowAll(true);
  };

  const handleRemoveInstruction = (productId, index) => {
    const updatedInstructions = [...productInstructions[productId]];
    updatedInstructions.splice(index, 1);
    setProductInstructions({
      ...productInstructions,
      [productId]: updatedInstructions,
    });
  };

  //=====================
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [makeCartforOrder, setMakeCartforOrder] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dummy, setDummy] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingPlaceOrder, setLoadingPlaceOrder] = useState(false);

  const [cartData, setCartData] = useState([]);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  console.log({ makeCartforOrder, cartData });

  const handleCartClick = async () => {
    let path = _.get(location, "pathname", "");

    if (path === "/online-order-cart") {
      navigate(`/delivery-address?instruction=${instructions}`, {
        state: makeCartforOrder,
      });
    } else if (path === "/take-away-cart") {
      setModalOpen(true);
    } else if (path === "/dining-cart") {
      try {
        setLoadingPlaceOrder(true);
        let food_data = getFoodDetails();
        let formData = {
          billAmount: _.get(getTotalAmount(), "total_for_dining", 0),
          gst: _.get(getTotalAmount(), "gstPrice", 0),
          item_price: _.get(getTotalAmount(), "itemPrice", 0),
          orderedFood: food_data,
          bookingId: _.get(location, "state.table_details._id", ""),
          orderId:
            "BIPL031023" +
            uuidv4()?.slice(0, 4)?.toUpperCase() +
            moment(new Date()).format("DMy"),
          tableNo: _.get(location, "state.table_details.tableNo", ""),
          timeSlot: _.get(location, "state.table_details.timeSlot", ""),
          customerName: _.get(location, "state.table_details.customerName", ""),
          mobileNumber: _.get(
            location,
            "state.table_details.contactNumber",
            ""
          ),
        };
        await addDiningOrder(formData);
        notification.success({
          message: "Your Order Successfully Placed",
        });

        navigate("/profile-table-booking");
      } catch (err) {
        console.log(err);
        notification.error({ message: "Something went wrong" });
      } finally {
        setLoadingPlaceOrder(false);
      }
    }
  };

  const getOrderReferance = () => {
    let orderRef = "";
    let path = _.get(location, "pathname", "");
    if (path === "/takeaway-checkout") {
      orderRef = "takeaway_order";
    } else if (path === "/online-order-cart") {
      orderRef = "online_order";
    } else if (path === "/dining-cart") {
      orderRef = "dining_order";
    }
    return orderRef;
  };

  const fetchData = async () => {
    try {
      let order_ref = getOrderReferance();
      setLoading(true);
      let formdatas = {
        order_ref: order_ref,
        bookingref: _.get(location, "state.table_details._id", ""),
      };
      const result = await getCurrentUserCartProducts(
        JSON.stringify(formdatas)
      );
      setCartData(_.get(result, "data.data", []));

      let initialData = _.get(result, "data.data", []).map((res) => {
        return {
          id: res._id,
          comment: "",
        };
      });

      console.log({ initialData });
      setMakeCartforOrder(initialData || []);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      return notification.error({ message: "Something went wrong" });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleExploreFoodsScreen = () => {
    let path = _.get(location, "pathname", "");
    if (path === "/take-away-cart") {
      navigate("/take-away");
    } else if (path === "/online-order-cart") {
      navigate("/online-order");
    } else if (path === "/dining-cart") {
      navigate("/dining");
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

  const handleChangeComment = (id, cmt) => {
    try {
      let newData = makeCartforOrder;
      newData.map((res) => {
        return res.id === id ? (res.comment = cmt) : res;
      });
      setMakeCartforOrder(newData);
      setDummy(!dummy);
    } catch (err) {
      console.log(err);
      notification.error({ message: "Something went wrong" });
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
    let itemPrice = _.sum(
      cartData.map((res) => {
        const typeRefId = _.get(res, "typeRef", "");
        const selectedType = _.get(res, "productRef.types", []).find(
          (type) => type._id === typeRefId
        );
        const productRef = _.get(res, "productRef", "");
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
    let couponDiscount =
      (itemPrice * Number(coupon?.discountPercentage || 0)) / 100;

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
      Total_amount:
        _.get(location, "pathname", "") === "/online-order-cart"
          ? total_amount.toFixed(2)
          : (total_amount - 50).toFixed(2),
      total_for_dining: total_for_dining,
      total_qty: total_qty,
      itemdiscountPrice: total_dc_price,
    };
  };

  useEffect(() => {
    getTotalAmount();
  }, [dummy, makeCartforOrder]);
  console.log({ cartData });
  const getFoodDetails = () => {
    let food_data = cartData.map((res) => {
      const typeRefId = _.get(res, "typeRef", "");
      const productRef = _.get(res, "productRef", "");
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
        foodPrice: price,
        originalPrice: _.get(res, "productRef.discountPrice", ""),
        foodQuantity: _.get(res, "quantity", ""),
        type: typeRefId?.Type ? typeRefId.Type : "Regular",
      };
    });
    return food_data;
  };
  console.log({ productInstructions });
  const handlePlaceOrder = async () => {
    let food_data = getFoodDetails();
    let prices = getTotalAmount();

    try {
      setLoadingPlaceOrder(true);
      let formData = {
        billAmount: _.get(getTotalAmount(), "Total_amount", 0),
        gst: _.get(getTotalAmount(), "gstPrice", 0),
        delivery_charge: _.get(getTotalAmount(), "deliverCharagePrice", 0),
        packing_charge: _.get(getTotalAmount(), "packingPrice", 0),
        transaction_charge: _.get(getTotalAmount(), "transactionPrice", 0),
        coupon_amount: _.get(getTotalAmount(), "couponDiscount", 0),
        item_price: _.get(getTotalAmount(), "itemPrice", 0),
        orderedFood: food_data,
        coupon,
        instructionsTakeaway: ProductInstructions,
        payment_mode: paymentMethod,
        orderId:
          "BIPL031023" +
          uuidv4()?.slice(0, 4)?.toUpperCase() +
          moment(new Date()).format("DMy"),
      };

      await addTakeAwayOrder(formData);
      notification.success({
        message: "Your order has been successfully placed.",
      });
      dispatch(addCoupon(null));
      navigate("/profile-take-away-order", {
        replace: true,
      });
    } catch (err) {
      console.error(err.message);
      notification.error({ message: "Something went wrong" });
    } finally {
      setLoadingPlaceOrder(false);
    }
  };

  const handleback = () => {
    navigate(-1);
  };

  // ========
  const [products, setProducts] = useState([]);
  useEffect(() => {
    // Initialize the products with the provided cartData
    const initialProducts = cartData.map((res) => {
      return {
        id: res._id,
        quantity: res.quantity || 1,
        price: parseFloat(res.productRef.discountPrice) || 0,
      };
    });
    setProducts(initialProducts);
  }, [cartData]);

  const HandleIncrement = (productId) => {
    const updatedProducts = products.map((product) =>
      product.id === productId
        ? { ...product, quantity: product.quantity + 1 }
        : product
    );
    setProducts(updatedProducts);
  };

  const HandleDecrement = (productId) => {
    const updatedProducts = products.map((product) =>
      product.id === productId && product.quantity > 1
        ? { ...product, quantity: product.quantity - 1 }
        : product
    );
    setProducts(updatedProducts);
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

        {/* <div>
          <Swiper
            modules={[Autoplay]}
            className=""
            autoplay={{
              delay: 3000,
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
        </div> */}
        {/* ==================================== */}

        <div className="flex flex-col gap-y-4  mt-4 p-5 justify-center items-center ">
          <div className="py-6 px-6 ultraSm:w-full lg:w-1/2 bg-white h-20 rounded-xl flex justify-between items-center border payment_disabled">
            <CiCreditCard1 className="text-3xl" />
            <span className="text-center font-sans text-sm font-bold text-black">
              Credit / Debit cards
            </span>
            <label className="flex items-center">
              <input
                type="radio"
                disabled
                name="paymentMethod"
                className="radio  ml-2"
                checked={paymentMethod === "Credit/Debit"}
                onChange={() => setPaymentMethod("Credit/Debit")}
              />
            </label>
          </div>
          <div className="py-6 px-6  ultraSm:w-full lg:w-1/2 bg-white h-20 rounded-xl flex justify-between items-center border payment_disabled">
            <LuMonitorSmartphone className="text-3xl" />
            <span className="text-center font-sans text-sm font-bold text-black">
              UPI Payment
            </span>
            <label className="flex items-center">
              <input
                disabled
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

export default TakeAwayChackout;
