/* eslint-disable no-empty */
import { Button, Modal, Radio, Result, message, notification } from "antd";
import _ from "lodash";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  addDiningOrder,
  addTakeAwayOrder,
  decrementCartQuantity,
  getCurrentUserCartProducts,
  getUserCoupons,
  incrementCartQuantity,
  removeSoloFromCart,
} from "../../helper/api/apiHelper";
import LoadingScreen from "../../components/LoadingScreen";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { GoArrowLeft } from "react-icons/go";
import { IoIosArrowBack } from "react-icons/io";
import CheckoutPage from "./CheckoutPage";
import { useDispatch, useSelector } from "react-redux";
import { addCoupon, updateFoodInstructions } from "../../redux/authSlice";
import "../../assets/css/cart.css";
import { TbDiscount2 } from "react-icons/tb";
const Cart = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ================= Instructions

  const [instructionInput, setInstructionInput] = useState(false);
  const [instructions, setInstructions] = useState([]);
  const [openInstruction, setOpenInstruction] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [showMoreInstructions, setShowMoreInstructions] = useState([]);

  const maxInstructionsToShow = 2;
  const [productInstructions, setProductInstructions] = useState([]);
  const dispatch = useDispatch();
  const reduxProductInstructions = useSelector(
    (state) => state.auth.foodInstructions
  );

  const handleAddInstruction = (productId, newInstruction) => {
    if (newInstruction.trim() !== "") {
      const updatedInstructions = {
        ...productInstructions,
        [productId]: [
          ...(productInstructions[productId] || []),
          newInstruction,
        ],
      };
      setProductInstructions(updatedInstructions);
      dispatch(
        updateFoodInstructions({
          foodId: productId,
          instructions: updatedInstructions[productId],
        })
      );
    }
  };

  // console.log("Check instruction-------------->", ProductInstructions)

  const handleShowMore = (productId) => {
    setShowAll(true);

    let data = [...new Set([...showMoreInstructions, productId])];
    setShowMoreInstructions(data);
  };

  const handleShowLess = (productId) => {
    setShowAll(false);

    let data = [...new Set([...showMoreInstructions])];
    const index = data.indexOf(productId);
    if (index > -1) {
      // only splice array when item is found
      data.splice(index, 1); // 2nd parameter means remove one item only
    }

    setShowMoreInstructions(data);
  };

  const handleRemoveInstruction = (productId, index) => {
    const updatedInstructions = [...productInstructions[productId]];
    updatedInstructions.splice(index, 1);
    const newInstructions = {
      ...productInstructions,
      [productId]: updatedInstructions,
    };
    setProductInstructions(newInstructions);
    dispatch(
      updateFoodInstructions({
        foodId: productId,
        instructions: updatedInstructions,
      })
    );
  };

  //=====================

  const [makeCartforOrder, setMakeCartforOrder] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dummy, setDummy] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [couponModal, setCouponModal] = useState(false);
  const [loadingPlaceOrder, setLoadingPlaceOrder] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [coupon, setCoupon] = useState(null);
  const isDining = location?.pathname === "/dining-cart";

  const DININGPERCENTAGE = 30 / 100;
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBrowseMoreFoodClick = async () => {
    let path = _.get(location, "pathname", "");
    if (path === "/online-order-cart") {
      navigate("/online-order");
    } else if (path === "/take-away-cart") {
      navigate("/take-away");
    } else if (path === "/dining-cart") {
      navigate("/dining");
    }
  };

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
    if (path === "/take-away-cart") {
      orderRef = "takeaway_order";
    } else if (path === "/online-order-cart") {
      orderRef = "online_order";
    } else if (path === "/dining-cart") {
      orderRef = "dining_order";
    }
    return orderRef;
  };

  const fetchData = async (load = true) => {
    try {
      let order_ref = getOrderReferance();
      setLoading(load);
      let formdatas = {
        order_ref: order_ref,
        bookingref: _.get(location, "state.table_details._id", ""),
      };
      const result = await getCurrentUserCartProducts(
        JSON.stringify(formdatas)
      );

      // Assuming result.data.data is an array

      console.log(result.data.data);
      setCartData(_.get(result, "data.data", []));
      let initialData = _.get(result, "data.data", [])?.map((res) => {
        return {
          id: res._id,
          comment: "",
        };
      });
      setMakeCartforOrder(initialData || []);
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
      fetchData(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChangeComment = (id, cmt) => {
    try {
      let newData = makeCartforOrder;
      newData?.map((res) => {
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
      fetchData(false);
    } catch (err) {
      console.log(err);
    }
  };

  const getTotalAmount = () => {
    console.log(cartData, " ia ma cartdata");

    // const itemPrice = cartData?.reduce((accumulator, res) => {
    //   const typeRefId = _.get(res, "typeRef", "");
    //   const productRef = _.get(res, "productRef", "");
    //   const displayPrice = typeRefId
    //     ? (typeRefId.TypeOfferPrice
    //       ? typeRefId.TypeOfferPrice
    //       : typeRefId.TypePrice) * _.get(res, "quantity", "")
    //     : (productRef.discountPrice
    //       ? parseFloat(productRef.discountPrice)
    //       : parseFloat(productRef.price)) * _.get(res, "quantity", "");

    //   console.log("typeRefId:", typeRefId);
    //   console.log("productRef:", productRef);
    //   console.log("displayPrice:", displayPrice);

    //   return accumulator + displayPrice;
    // }, 0);

    // console.log("Total Amount:", itemPrice);

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
          ? isDining
            ? Number(typeRefId.TypePrice) +
              Number(typeRefId.TypePrice) * DININGPERCENTAGE
            : typeRefId.TypeOfferPrice
            ? typeRefId.TypeOfferPrice
            : typeRefId.TypePrice
          : isDining
          ? Number(productRef.price) +
            Number(productRef.price) * DININGPERCENTAGE
          : productRef.discountPrice
          ? parseFloat(productRef.discountPrice)
          : parseFloat(productRef.price);

        return Number(price) * res.quantity;
      })
    );
    let couponPrice = 0;

    let discountCoupon = Number(coupon?.discountPercentage || 0);

    if (discountCoupon > 0) {
      couponPrice = (Number(itemPrice) * Number(discountCoupon)) / 100;
    }

    let itemdiscountPrice = _.sum(
      cartData?.map((res) => {
        return Number(_.get(res, "productRef.price", "")) * res.quantity;
      })
    );

    let total_qty = _.sum(
      cartData?.map((res) => {
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
      couponPrice;

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
      couponDiscount: couponPrice,
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

  const getFoodDetails = () => {
    let food_data = cartData?.map((res) => {
      console.log("food_data", res);
      const typeRefId = _.get(res, "typeRef", "");
      let fprice = Number(_.get(res, "productRef.price", 0));
      let productPrice = isDining
        ? !typeRefId?.Type
          ? Number(fprice) + Number(fprice) * DININGPERCENTAGE
          : typeRefId.TypePrice + typeRefId.TypePrice * DININGPERCENTAGE
        : Number(_.get(res, "productRef.price", 0));
      let DiningPrice = isDining ? productPrice : productPrice;
      console.log("food_data", {
        isDining,
        typeRefId,
        fprice,
        productPrice,
        DiningPrice,
      });
      return {
        pic: _.get(res, "productRef.image", ""),
        foodName: _.get(res, "productRef.name", ""),
        foodPrice: isDining ? DiningPrice : _.get(res, "productRef.price", ""),
        originalPrice: isDining
          ? DiningPrice
          : _.get(res, "productRef.discountPrice", ""),
        foodQuantity: _.get(res, "quantity", ""),
      };
    });
    return food_data;
  };

  const handlePlaceOrder = async () => {
    let food_data = getFoodDetails();

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
        orderId:
          "BIPL031023" +
          uuidv4()?.slice(0, 4)?.toUpperCase() +
          moment(new Date()).format("DMy"),
      };
      await addTakeAwayOrder(formData);
      notification.success({
        message: "Your order has been successfully placed.",
      });
      navigate("/profile-take-away-order");
    } catch (err) {
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

  console.log({ cartData, isDining });
  useEffect(() => {
    // Initialize the products with the provided cartData
    const initialProducts = cartData?.map((res) => {
      return {
        id: res._id,
        quantity: res?.quantity || 1,
        price: isDining
          ? Number(res?.productRef?.price) +
            Number(res?.productRef?.price) * DININGPERCENTAGE
          : parseFloat(res?.productRef?.discountPrice) || 0,
      };
    });
    setProducts(initialProducts);
  }, [cartData]);

  const HandleIncrement = (productId) => {
    const updatedProducts = products?.map((product) =>
      product.id === productId
        ? { ...product, quantity: product.quantity + 1 }
        : product
    );
    setProducts(updatedProducts);
  };

  const HandleDecrement = (productId) => {
    const updatedProducts = products?.map((product) =>
      product.id === productId && product.quantity > 1
        ? { ...product, quantity: product.quantity - 1 }
        : product
    );
    setProducts(updatedProducts);
  };

  useEffect(() => {
    setProductInstructions(reduxProductInstructions);
  }, []);

  console.log({
    instructionInput,
    showMoreInstructions,
    showAll,
    productInstructions,
  });
  console.log({ coupons });
  return loading ? (
    <LoadingScreen />
  ) : (
    <div className="bg-white pb-20">
      {_.isEmpty(cartData) ? (
        <div className="lg:w-screen h-screen !center_div w-[98%]">
          <Result
            title={
              <div className="flex justify-center items-center ">
                <img
                  src="/assets/icons/Explore_Food.png"
                  alt="no items in the cart"
                  className="w-[250px]"
                />
              </div>
            }
            extra={
              <div className="w-screen center_div px-10">
                <button
                  onClick={handleExploreFoodsScreen}
                  type="primary"
                  className="hover:!text-white w-[500px] py-5 center_div border-none text-md bg-black rounded-full text-white"
                >
                  Explore Foods
                </button>
              </div>
            }
          />
        </div>
      ) : (
        <div className="w-screen lg:px-20 px-2  bg-white  min-h-screen ">
          {/* title */}
          <div className="flex justify-start lg:pt-14 pt-10 items-center gap-x-2">
            <IoIosArrowBack
              onClick={handleback}
              className="!cursor-pointer text-2xl"
            />{" "}
            <div className=" ">
              <div className="font-bold lg:text-5xl  text-[#3A3A3A] tracking-wider ">
                Your food cart
              </div>
            </div>
          </div>
          {/* items */}
          <div className="flex justify-between items-start lg:pt-14 pt-8 lg:flex-row flex-col gap-y-10 ">
            {/* left */}
            <div className="flex flex-col gap-y-5 w-full">
              {cartData?.map((res, index) => {
                const productId = res._id;
                const typeRefId = _.get(res, "typeRef", "");
                const productRef = _.get(res, "productRef", "");
                const selectedType = typeRefId.Type;
                let qty = Number(_.get(res, "quantity", ""));
                console.log({
                  typeRefId,
                  selectedType,
                  qty,
                  isDining,
                  DININGPERCENTAGE,
                  price: typeRefId.TypePrice,
                  amount: typeRefId.TypePrice * DININGPERCENTAGE,
                });
                const displayPrice = typeRefId?.Type
                  ? isDining
                    ? (typeRefId.TypePrice +
                        typeRefId.TypePrice * DININGPERCENTAGE) *
                      qty
                    : (typeRefId.TypeOfferPrice
                        ? typeRefId.TypeOfferPrice
                        : typeRefId.TypePrice) * qty
                  : isDining
                  ? (parseFloat(productRef.price) +
                      Number(productRef.price) * DININGPERCENTAGE) *
                    _.get(res, "quantity", "")
                  : (productRef.discountPrice
                      ? parseFloat(productRef.discountPrice)
                      : parseFloat(productRef.price)) *
                    _.get(res, "quantity", "");
                console.log({ displayPrice });
                // const selectedType = _.get(res, "productRef.types", []).find(
                //   (type) => type._id === typeRefId
                // );
                // const displayPrice = selectedType
                //   ? selectedType.price * _.get(res, "quantity", "")
                //   : _.get(res, "productRef.discountPrice", "") *
                //     _.get(res, "quantity", "");
                const displayType = selectedType ? selectedType : null;
                return (
                  <div
                    key={index}
                    className="relative justify-between items-center rounded-2xl shadow-2xl flex flex-col overflow-hidden w-full bg-white cart-page"
                  >
                    <div className="  justify-between items-center rounded-t-2xl shadow-2xl flex flex-row overflow-hidden w-full">
                      <div className="ultraSm:w-[30%] p-3 ">
                        <img
                          src={_.get(res, "productRef.image", "")}
                          alt=""
                          className="ultraSm:w-36 md:w-40 md:h-36 lg:w-56 ultraSm:h-24 lg:h-44 rounded-lg object-cover"
                        />
                      </div>
                      {/* comment */}
                      <div className="flex flex-col pb-0  ultraSm:w-[70%] ">
                        {/* title */}
                        <div className="flex items-start justify-between px-2 ">
                          <div className="flex flex-col gap-y-1">
                            <h1 className="text-[#3A3A3A] font-semibold lg:text-2xl text-[14px] uppercase">
                              {_.get(res, "productRef.name", "")}
                            </h1>
                            {/* <div className="flex items-center gap-x-2">
                              <div className="text-[#2f2e2e] text-sm ">
                                Price
                              </div>{" "}
                              <div className="lg:text-xl text-sm text-[#3A3A3A] font-medium">
                                &#8377; {displayPrice}{" "}
                                <span className="text-[#2f2e2e] text-sm font-bold">
                                  {displayType}
                                </span>
                              </div>
                            </div> */}
                          </div>
                          {/* increment decrement button */}
                          <div className="lg:pl-10 gap-y-2 flex flex-col items-center lg:me-1">
                            <h1 className="lg:text-sm text-[10px]">Quantity</h1>
                            <div className="flex lg:gap-x-4 gap-x-2 ">
                              <div
                                onClick={() => {
                                  handleClickDecrement(
                                    res._id,
                                    _.get(res, "quantity", "")
                                  );
                                  HandleDecrement(res._id);
                                }}
                                className="bg-[#3A3A3A] lg:w-[35px] lg:h-[35px] rounded-lg w-[20px] h-[20px] text-white center_div cursor-pointer !select-none"
                              >
                                -
                              </div>
                              <div>{_.get(res, "quantity", "")}</div>
                              <div
                                onClick={() => {
                                  handleIncement(res._id);
                                  HandleIncrement(res._id);
                                }}
                                className="lg:w-[35px] lg:h-[35px] w-[20px] h-[20px] rounded-lg bg-yellow_color text-white center_div cursor-pointer !select-none"
                              >
                                +
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-x-2 ml-[8px]">
                          <div className="text-[#2f2e2e] text-sm ">Price</div>{" "}
                          <div className="lg:text-xl text-sm text-[#3A3A3A] font-medium">
                            &#8377; {displayPrice}{" "}
                            <span className="text-[#2f2e2e] lg:text-sm text-[12px] font-bold capitalize">
                              ({displayType || "Regular"})
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Instruction */}
                    <div
                      style={{ marginBottom: "20px" }}
                      className={`${
                        (productInstructions[productId] || []).length === 0
                          ? `w-full gap-2 px-6 bg-white h-14 border-t-2 focus:border-none rounded-b-2xl cursor-pointer`
                          : `w-full gap-2 px-6 bg-white h-32 border-t-2 focus:border-none rounded-b-2xl cursor-pointer`
                      }`}
                    >
                      <div className="w-full">
                        {instructionInput &&
                        openInstruction.includes(productId) ? (
                          <div className="w-full flex justify-center items-center text-sm gap-2 text-[#18AD00] px-6 bg-white h-12 focus:border-none rounded-b-2xl cursor-pointer">
                            <input
                              type="text"
                              placeholder="Instruction"
                              className="input w-full focus:outline-none focus:ring-0 border-none placeholder-text-[#18AD00] pl-2 text-black"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  const instructionValue = e.target.value;
                                  handleAddInstruction(
                                    productId,
                                    instructionValue
                                  );
                                  e.target.value = "";
                                }
                              }}
                              onBlur={(e) => {
                                const instructionValue = e.target.value;
                                handleAddInstruction(
                                  productId,
                                  instructionValue
                                );
                                e.target.value = "";
                              }}
                            />
                          </div>
                        ) : (
                          <div className="w-full flex justify-center items-center text-sm gap-2 text-[#18AD00] px-6 bg-white h-12 focus:border-none rounded-b-2xl cursor-pointer">
                            <button
                              onClick={() => {
                                setInstructionInput(true);

                                setOpenInstruction([
                                  ...openInstruction,
                                  productId,
                                ]);
                              }}
                            >
                              +
                            </button>
                            <h1
                              onClick={() => {
                                setInstructionInput(true);
                                setOpenInstruction([
                                  ...openInstruction,
                                  productId,
                                ]);
                              }}
                            >
                              Add Food Instruction
                            </h1>
                          </div>
                        )}
                      </div>
                      {(productInstructions[productId] || []).length > 0 && (
                        <div className="w-full h-24 overflow-y-auto">
                          {(productInstructions[productId] || [])
                            .slice(
                              0,
                              showMoreInstructions?.includes(productId)
                                ? (productInstructions[productId] || []).length
                                : maxInstructionsToShow
                            )
                            ?.map((instruction, index) => (
                              <div
                                key={index}
                                className="flex justify-between items-center"
                              >
                                <h1 className="text-sm">
                                  <span className="text-lg font-bold text-black">
                                    -{" "}
                                  </span>
                                  {instruction}
                                </h1>
                                <button
                                  onClick={() =>
                                    handleRemoveInstruction(productId, index)
                                  }
                                  className="text-sm text-red-500 font-bold"
                                >
                                  remove
                                </button>
                              </div>
                            ))}
                          {productInstructions[productId]?.length >
                            maxInstructionsToShow && (
                            <button
                              onClick={() => handleShowMore(productId)}
                              className="text-[8px] absolute bottom-1 left-[40%] font-sans text-black font-bold bg-gray-300 rounded-lg px-4 py-2 "
                            >
                              Show More
                            </button>
                          )}
                          {showMoreInstructions?.includes(productId) && (
                            <button
                              onClick={() => handleShowLess(productId)}
                              className="text-[8px] absolute bottom-1 left-[40%] font-sans text-black font-bold bg-gray-300 rounded-lg px-4 py-2 "
                            >
                              Show Less
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              <Link onClick={handleBrowseMoreFoodClick}>
                <div className="w-full flex justify-center items-center gap-2 px-6 bg-white h-20 border border-gray-300 rounded-2xl cursor-pointer ">
                  + Browse more food
                </div>
              </Link>
            </div>
            {/* right */}

            {cartData.length > 0 && (
              <>
                <div className="flex flex-col items-center gap-y-4 w-full">
                  <div className="bg-[#F2F2F2] lg:w-[500px] w-full min-h-[400px] rounded-2xl lg:p-10  p-5 relative">
                    <h1 className="text-[#292929] lg:text-2xl font-semibold">
                      Order summary
                    </h1>
                    <div className="flex flex-col gap-y-6 pb-2">
                      {/* price */}
                      <div className="flex  justify-between pt-4 border-b border-[#C1C1C1] lg:text-lg text-sm">
                        <div className="flex gap-x-2">
                          <div className="text-[#3F3F3F] font-normal">
                            Item price
                          </div>{" "}
                          <div className="text-[#B6B6B6]">
                            {" "}
                            &times; {_.get(getTotalAmount(), "total_qty", 0)}
                          </div>
                        </div>

                        <div className="lg:text-lg text-[#3A3A3A]">
                          &#8377; {_.get(getTotalAmount(), "itemPrice", 0)}
                        </div>
                      </div>
                      {coupon ? (
                        <div className="flex  justify-between pt-4 border-b border-[#C1C1C1] lg:text-lg text-sm">
                          <div className="flex gap-x-2">
                            <div className="text-[#3F3F3F] font-normal">
                              Coupon Discount
                            </div>
                          </div>

                          <div className="lg:text-lg text-[red]">
                            - &#8377;{" "}
                            {/* {_.get(getTotalAmount(), "itemPrice", 0) *
                            Number(coupon?.discountPercentage)} */}
                            {Number(_.get(getTotalAmount(), "itemPrice", 0)) *
                              (Number(coupon?.discountPercentage) / 100)}
                          </div>
                        </div>
                      ) : null}
                      {/* gst */}
                      <div className="flex  justify-between border-b border-[#C1C1C1] text-sm lg:text-lg">
                        <div className="flex gap-x-2">
                          <div className="text-[#3F3F3F] font-normal">Gst</div>{" "}
                        </div>
                        <div className=" text-[#3A3A3A]">
                          &#8377; {_.get(getTotalAmount(), "gstPrice", 0)}
                        </div>
                      </div>
                      {/* delivery charge */}
                      {_.get(location, "pathname", "") ===
                      "/online-order-cart" ? (
                        <div className="flex  justify-between border-b border-[#C1C1C1] text-sm lg:text-lg">
                          <div className="flex gap-x-2">
                            <div className="text-[#3F3F3F] font-normal">
                              Delivery Charge
                            </div>{" "}
                          </div>
                          <div className="lg:text-lg text-[#3A3A3A]">
                            &#8377; 50
                          </div>
                        </div>
                      ) : (
                        ""
                      )}

                      {/* otehr charges */}
                      {_.get(location, "pathname", "") !== "/dining-cart" && (
                        <div className="flex  justify-between border-b border-[#C1C1C1] text-sm lg:text-lg">
                          <div className="flex gap-x-2">
                            <div className="text-[#3F3F3F] font-normal">
                              Packing Charges
                            </div>{" "}
                          </div>
                          <div className=" text-[#3A3A3A]">
                            &#8377;
                            {_.get(getTotalAmount(), "packingPrice", 0)}
                          </div>
                        </div>
                      )}
                      {/* Transaction charges */}
                      {_.get(location, "pathname", "") !== "/dining-cart" && (
                        <div className="flex  justify-between border-b border-[#C1C1C1] text-sm lg:text-lg">
                          <div className="flex gap-x-2">
                            <div className="text-[#3F3F3F] font-normal overflow-hidden text-ellipsis ">
                              Transaction Charges
                            </div>{" "}
                          </div>
                          <div className="text-[#3A3A3A] text-sm">
                            &#8377;
                            {_.get(getTotalAmount(), "transactionPrice", 0)}
                          </div>
                        </div>
                      )}
                      {/* Coupon discount */}
                      {/* {_.get(location, "pathname", "") !==
                                        "/dining-cart" && (
                                        <div className="flex  justify-between border-b border-[#C1C1C1]  text-sm lg:text-lg">
                                            <div className="flex gap-x-2">
                                                <div className="text-[#3F3F3F] font-normal">
                                                    Coupon discount
                                                </div>{" "}
                                            </div>
                                            <div className=" text-yellow_color font-medium">
                                                &#8377; 0
                                            </div>
                                        </div>
                                    )} */}
                      {/* total amount */}
                      <div className="flex  justify-between pt-6">
                        <div className="flex gap-x-2">
                          <div className="text-[#3F3F3F] font-normal">
                            Total Amount
                          </div>{" "}
                        </div>

                        <div className="text-lg text-[#3A3A3A] font-medium flex items-center gap-x-1">
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
                          <div className="text-green-500">
                            &nbsp; &#8377;
                            {_.get(location, "pathname", "") !== "/dining-cart"
                              ? _.get(getTotalAmount(), `Total_amount`, 0)
                              : _.get(getTotalAmount(), `total_for_dining`, 0)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button
                      block
                      type="text"
                      onClick={() => setCouponModal(true)}
                      className=" lg:h-[40px] h-[40px] text-xl   rounded-2xl cursor-pointer font-bold text-[orange]"
                    >
                      Apply Coupon
                    </Button>
                    {coupon?.code ? (
                      <p className="bg-white m-2 text-center p-2 rounded-xl text-[green]">
                        {coupon?.code}
                      </p>
                    ) : null}

                    {/* confirm button */}
                    <div
                      onClick={handleCartClick}
                      className="lg:w-[inhrit] w-full pt-10 "
                    >
                      {_.get(location, "pathname", "") ===
                      "/take-away-cart" ? null : (
                        <Button
                          block
                          loading={loadingPlaceOrder}
                          className=" lg:h-[80px] h-[50px] bg-[#292929]   rounded-2xl cursor-pointer hover:bg-[#292929]"
                        >
                          <div className="center_div font-semibold lg:text-xl text-white hover:text-yellow-500">
                            {_.get(location, "pathname", "") === "/dining-cart"
                              ? "Place Order"
                              : "  Confirm and continue"}
                          </div>
                        </Button>
                      )}

                      {_.get(location, "pathname", "") === "/take-away-cart" ? (
                        <div
                          onClick={() => navigate(`/takeaway-checkout`)}
                          className="lg:w-[450px] h-[80px] center_div bg-black cursor-pointer rounded-2xl text-[#EFEFEF] lg:text-xl font-semibold justify-center items-center py-7"
                        >
                          <h1 className="text-center">
                            Proceed & Continue to pay
                          </h1>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <Modal
            open={couponModal}
            title="Coupons"
            className="bg-white rounded-2xl"
            closable={true}
            footer={false}
            onCancel={() => {
              setCouponModal(false);
            }}
          >
            <div className="coupon_container">
              {coupons?.length ? (
                coupons?.map((cd, i) => {
                  return (
                    <React.Fragment key={i}>
                      <div
                        className="coupon_wrapper"
                        onClick={() => {
                          setCoupon(cd);
                          setCouponModal(false);
                          dispatch(addCoupon(cd));
                        }}
                      >
                        <div className="code_title">
                          <TbDiscount2 size={15} color="green" /> {cd?.code}
                        </div>
                        <h3 className="code_percentage">
                          {cd?.discountPercentage}% off
                        </h3>
                      </div>
                    </React.Fragment>
                  );
                })
              ) : (
                <div>
                  <p className="font-lg text-2xl">No Coupons Available</p>
                </div>
              )}
            </div>
          </Modal>

          <Modal
            open={modalOpen}
            className="bg-black rounded-2xl"
            closable={false}
            footer={false}
            onCancel={() => {
              setModalOpen(false);
            }}
          >
            <div className="flex flex-col gap-y-10 justify-start pt-4">
              <Radio value={1} checked={true} className="!text-white">
                Cash
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
                className=" hover:!text-white min-w-[200px] center_div border-none min-h-[50px] text-md bg-primary_color rounded-lg text-white mt-4"
              >
                Place Order
              </Button>
            </div>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default Cart;
