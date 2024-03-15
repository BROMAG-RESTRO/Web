/* eslint-disable no-empty */
/* eslint-disable react-hooks/exhaustive-deps */

import {
  Badge,
  Divider,
  Select,
  Skeleton,
  Tag,
  notification,
  message,
  Switch,
} from "antd";
import { useEffect, useRef, useState } from "react";
import { useHref, useLocation, useNavigate } from "react-router-dom";
import _, { set } from "lodash";

import {
  addToCart,
  decrementCartQuantity,
  getAllCusinessData,
  getAllCusinessFilter,
  getAllSearchCusinessData,
  getCurrentUserCarts,
  getFilteredProducts,
  incrementCartQuantity,
  removeSoloFromCart,
} from "../../helper/api/apiHelper";
import { CiDiscount1 } from "react-icons/ci";
import { MdKeyboardArrowRight } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";
import Customization from "./Customization";
import axios from "axios";
import "../../assets/css/cusines-details.css";
let base_url = import.meta.env.VITE_base_url;
import { useMediaQuery } from "react-responsive";
import { useSelector } from "react-redux";

const Cusinedetails = () => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [subCategory, setSubCategory] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentSubCategory, setCurrentSubCategory] = useState("");
  const [search, setSearch] = useState("");
  const [allCusinesCategory, setAllCusinesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allSearchCusinesCategory, setAllSearchCusinesCategory] = useState([]);
  const [isNonVegOnly, setNonVegOnly] = useState(false);
  const [isVegOnly, setVegOnly] = useState(false);
  const [productData, setProductData] = useState([]);
  const [currentCartsData, setCurrentCartsData] = useState([]);
  const [allCartsData, setAllCartsData] = useState([]);
  const [dummy, setDummy] = useState(false);
  const [customizeProduct, setCustomizeProduct] = useState(null);
  const [open, setOpen] = useState(false);
  const [showVgn, setShowVgn] = useState(false);
  const [editMultiType, setEditMulti] = useState(false);
  const location = useLocation();
  const charges = useSelector((state) => state.auth.charges);

  const pageName = location?.pathname;
  const navigate = useNavigate();
  const currentLocation = useHref();

  console.log(filteredData, "filteredData");
  const DININGMODE = charges?.dining?.mode;
  const DININGPERCENTAGE =
    DININGMODE === "percentage"
      ? charges?.dining?.value / 100
      : charges?.dining?.value;
  const fetchSearchData = async () => {
    try {
      if (search.length > 0) {
        const result = await getAllSearchCusinessData(search);
        setAllSearchCusinesCategory(result.data.data);
      }
    } catch (err) {
      notification.error({ message: "Something went wrong" });
    }
  };

  useEffect(() => {
    fetchSearchData();
  }, [search]);

  useEffect(() => {
    fetchSearchData();
  }, [search]);

  //=========================

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchData = async (loading = true) => {
    try {
      setLoading(loading);
      const result = await getAllCusinessFilter(
        localStorage.getItem("search") ||
          _.get(location, "state.currentCatid", "")
      );
      setAllCusinesData(_.get(result, "data.data.categoryData", []));
      setSubCategory(_.get(result, "data.data.subCategoryData", []));
      let filterDatas;
      if (
        localStorage.getItem("search") ||
        _.get(location, "state.currentCatid", "")
      ) {
        filterDatas = _.get(result, "data.data.categoryData", []).filter(
          (res) => {
            return localStorage.getItem("search")
              ? res._id === localStorage.getItem("search")
              : res._id === _.get(location, "state.currentCatid", "");
          }
        );
      } else {
        filterDatas = _.get(result, "data.data.categoryData", []);
        localStorage.setItem(
          "search",
          _.get(result, "data.data.categoryData[0]._id", "")
        );
      }
      setDummy(!dummy);
      setFilteredData(filterDatas);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      notification.error({ message: "Something went wrong" });
    }
  };

  useEffect(() => {
    if (_.get(location, "pathname", "") === "/dining-cusines") {
      if (!_.get(location, "state.currentCatid", "")) {
        navigate("/dining");
      }
    }
    fetchData();
  }, [
    _.get(location, "state.currentCatid", ""),
    localStorage.getItem("search"),
    currentSubCategory,
    // isVegOnly,
    // isNonVegOnly
  ]);

  const fetechProductData = async () => {
    try {
      setLoading(true);

      let searchItems = {
        cat:
          localStorage.getItem("search") ||
          _.get(location, "state.currentCatid", ""),
        subCat: currentSubCategory || "",
        isVegOnly: isVegOnly,
        isNonVegOnly: isNonVegOnly,
      };

      const productDatas = await getFilteredProducts(
        JSON.stringify(searchItems)
      );

      setLoading(false);

      setProductData(_.get(productDatas, "data.data", []));
    } catch (err) {
      setLoading(false);

      notification.error({ message: "Something went wrong" });
    }
  };

  useEffect(() => {
    fetechProductData();
  }, [
    _.get(location, "state.currentCatid", ""),
    localStorage.getItem("search"),
    currentSubCategory,
    isNonVegOnly,
    isVegOnly,
  ]);

  const fetchCurrentUserCarts = async (loading = true) => {
    try {
      setLoading(loading);
      let orderStatus = getOrderReferance();
      console.log("orderrs", { orderStatus });
      let current_carts = await getCurrentUserCarts(orderStatus);
      let cardsref = "";
      if (_.get(location, "pathname", "") === "/dining-cusines") {
        cardsref = _.get(current_carts, "data.data", [])
          .filter((res) => {
            return (
              res.bookingRef === _.get(location, "state.table_details._id", "")
            );
          })
          .map((res) => {
            return res.productRef;
          });
      } else {
        cardsref = _.get(current_carts, "data.data", []).map((res) => {
          return res.productRef;
        });
      }
      setAllCartsData(_.get(current_carts, "data.data", []));
      setCurrentCartsData(cardsref);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      return notification.error({ message: "Something went wrong" });
    }
  };

  useEffect(() => {
    if (
      localStorage.getItem("chgi5kjieaoyaiackaiw_bbcqgy4akacsaiq_bbcqgyyaq")
    ) {
      fetchCurrentUserCarts();
    }
  }, []);

  const getOrderReferance = () => {
    let orderRef = "";
    let path = _.get(location, "pathname", "");
    if (path === "/take-away-cusiness") {
      orderRef = "takeaway_order";
    } else if (path === "/cusines") {
      orderRef = "online_order";
    } else if (path === "/dining-cusines") {
      orderRef = "dining_order";
    }
    return orderRef;
  };

  const handleNotLoginUsers = () => {
    if (
      localStorage.getItem("search") ||
      _.get(location, "state.currentCatid", "")
    ) {
      navigate("/login", {
        state: {
          currentCatid:
            localStorage.getItem("search") ||
            _.get(location, "state.currentCatid", ""),
          backLocation: currentLocation,
        },
      });
    }
  };

  const handleCartClick = async (product) => {
    if (
      localStorage.getItem("chgi5kjieaoyaiackaiw_bbcqgy4akacsaiq_bbcqgyyaq")
    ) {
      try {
        setLoading(true);
        let orderStatus = getOrderReferance();
        console.log(orderStatus);
        let formData = {
          productRef: _.get(product, "_id", ""),
          orderRef: orderStatus,
        };
        if (orderStatus === "dining_order") {
          formData.bookingRef = _.get(location, "state.table_details._id", "");
        }
        const result = await addToCart(formData);
        message.success(_.get(result, "data.message", ""));
        fetchCurrentUserCarts();
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
        notification.error({ message: "Something went wrong" });
      }
    } else {
      handleNotLoginUsers();
    }
  };

  const handlegotocart = () => {
    if (
      localStorage.getItem("chgi5kjieaoyaiackaiw_bbcqgy4akacsaiq_bbcqgyyaq")
    ) {
      let path = _.get(location, "pathname", "");
      if (path === "/take-away-cusiness") {
        navigate("/take-away-cart");
      } else if (path === "/cusines") {
        navigate("/online-order-cart");
      } else if (path === "/dining-cusines") {
        navigate("/dining-cart", {
          state: _.get(location, "state", ""),
        });
      }
    } else {
      handleNotLoginUsers();
    }
  };

  const getCardId = (id) => {
    return allCartsData?.filter((res) => {
      return res.productRef === id;
    });
  };

  const getPriceAndOffers = (data) => {
    let maxPrice = 0;
    let correspondingOfferPercentage = 0;
    let correspondingTypePrice = 0;

    console.log(data, "tyypeeee");

    const isMultiTyped = data?.types ? data?.types?.length > 0 : false;

    console.log(isMultiTyped, data, "isMultiTyped");
    if (isMultiTyped) {
      for (const type of data?.types) {
        console.log("   type.TypeOfferPercentage ", type.TypeOfferPercentage);
        if (type.TypeOfferPrice && type.TypeOfferPrice > maxPrice) {
          maxPrice = type.TypeOfferPrice;
          correspondingOfferPercentage =
            type.TypeOfferPercentage === "undefined" ||
            type.TypeOfferPercentage === "null" ||
            !type?.TypeOfferPercentage
              ? 0
              : type?.TypeOfferPercentage;
          correspondingTypePrice = type.TypePrice || 0;
        } else if (type.TypePrice && type.TypePrice > maxPrice) {
          maxPrice = type.TypePrice;
          correspondingOfferPercentage = 0;
        }
      }

      return {
        actualPrice: correspondingTypePrice,
        OfferPrice: maxPrice,
        OfferPercentage: correspondingOfferPercentage || 0,
      };
    } else {
      const price = data?.discountPrice ? data?.discountPrice : data?.price;

      return {
        actualPrice: data?.price,
        OfferPrice: data?.discountPrice,
        OfferPercentage: data?.offer || 0,
      };
    }
  };

  const getLargeAmountItem = (types) => {
    const orderedItems = types?.sort((a, b) => b.TypePrice - a.TypePrice);

    // Get the item with the largest TypePrice
    return orderedItems[0];
  };

  const getQuantity = (id) => {
    try {
      let qty = getCardId(id);
      return _.get(qty, "[0].quantity", 0);
    } catch (err) {}
  };

  const handleIncrement = async (id) => {
    try {
      let _id = getCardId(id);
      await incrementCartQuantity(_.get(_id, "[0]._id", ""));
      message.success("quantity updated");
      fetchData(false);
      fetchCurrentUserCarts(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDecrement = async (id) => {
    try {
      let _id = getCardId(id);
      if (getQuantity(id) > 1) {
        await decrementCartQuantity(_.get(_id, "[0]._id", ""));
        message.success("quantity updated");
      } else {
        await removeSoloFromCart(_.get(_id, "[0]._id", ""));
        message.success("Food removed from cart");
      }
      fetchData(false);
      fetchCurrentUserCarts(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    localStorage.setItem("search", e);
    setCurrentSubCategory("");
    setDummy(!dummy);
  };

  //========================================================

  //========================================================

  return (
    <div className="w-screen lg:px-20 px-2  flex flex-col lg:gap-y-10 min-h-screen lg:pb-20 pb-5">
      <div className="flex flex-col lg:gap-y-14 gap-y-8">
        <div className="flex items-center justify-start gap-x-2 pt-11">
          <IoIosArrowBack
            onClick={() => {
              navigate(-1);
            }}
            className="lg:hidden block text-2xl"
          />
          <div>
            <h1 className="text-dark_color font-medium lg:text-xl ">
              {!_.isEmpty(_.get(location, "state.table_details", [])) &&
                `for Table ${_.get(
                  location,
                  "state.table_details.tableNo",
                  ""
                )}`}
            </h1>
          </div>

          {currentCartsData?.length > 0 ? (
            <div className="mr-4 lg:hidden fixed bottom-4  w-[96%] z-50 m-auto">
              <div
                onClick={handlegotocart}
                className="!bg-primary_color text-white lg:hidden lg:text-lg text-[10px]  cursor-pointer rounded-2xl lg:px-4 lg:py-2 font-bold md:w-[60%] w-[98%] m-auto center_div justify-between px-4 h-[40px]"
              >
                <div> {currentCartsData?.length} item added</div>
                <div className="center_div">
                  view cart <MdKeyboardArrowRight className="text-xl" />
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
        <Skeleton
          active
          loading={loading}
          className="lg:w-[500px] lg:h-[100px] mb-2"
        >
          <div className="flex flex-col lg:gap-y-10 gap-y-8">
            <div className="flex gap-x-10 lg:items-center items-start justify-between lg:flex-row flex-col">
              <div className="grid ultraSm:flex  gap-4 justify-between w-full items-center">
                <div
                  loading={loading}
                  className="!text-[#3A3A3A] !font-semibold lg:!text-5xl flex gap-x-2 !capitalize mx-3  "
                >
                  <span className="line-clamp-1 overflow-hidden text-ellipsis py-2 uppercase text-[12px] lg:text-5xl font-extrabold ">
                    {_.get(filteredData, "[0].name", "")} Cusines
                  </span>
                </div>
                <div className="pt-1 lg:w-[20vw] overflow-hidden">
                  <Select
                    showSearch
                    placeholder="Other cusines"
                    optionFilterProp="children"
                    value={filteredData?.[0]?._id}
                    className=" !w-full !border-[#494949] focus:!border-[#494949] hover:!border-[#494949] ultraSm:w-[180px] cursor-pointer"
                    onChange={(e) => {
                      handleChange(e);
                    }}
                  >
                    {allCusinesCategory.map((res, index) => {
                      return (
                        <Select.Option key={index} value={res._id}>
                          {res.name}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </div>
              </div>

              <div className="mr-4 lg:block hidden ">
                <Badge
                  size="small"
                  offset={[-14, 5]}
                  color="#DF9300"
                  count={`${currentCartsData?.length}`}
                >
                  <Tag
                    onClick={handlegotocart}
                    className="!bg-black text-white  cursor-pointer rounded-md px-4 py-2 font-bold"
                    color="yellow"
                  >
                    go to cart
                  </Tag>
                </Badge>
              </div>
            </div>

            {filteredData?.[0]?.type === "food" ? (
              <div className="p-2 pl-5 items-center flex px-3 gap-4">
                <div className="flex items-center	gap-1">
                  <div>Non-Veg</div>
                  <input
                    checked={isNonVegOnly}
                    onChange={() => {
                      setVegOnly(false);
                      setNonVegOnly(!isNonVegOnly);
                    }}
                    type="checkbox"
                    className="toggle toggle-lg non-veg-checkbox"
                    style={{
                      borderColor: `${isNonVegOnly ? `red` : "grey"}`,
                      backgroundColor: `${isNonVegOnly ? `red` : "grey"}`,
                    }}
                  />
                </div>

                <div className="flex items-center	gap-1">
                  <div>Veg</div>
                  <input
                    checked={isVegOnly}
                    onChange={() => {
                      setNonVegOnly(false);
                      setVegOnly(!isVegOnly);
                    }}
                    type="checkbox"
                    className="toggle toggle-lg veg-checkbox"
                    style={{
                      borderColor: `${isVegOnly ? `green` : "grey"}`,
                      backgroundColor: `${isVegOnly ? `green` : "grey"}`,
                    }}
                  />
                </div>
              </div>
            ) : null}

            <div className="px-3 relative">
              {/* <IoSearch className="absolute top-5 left-7 text-2xl text-gray-500" /> */}
              <input
                onClick={() => setOpen(!open)}
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your food"
                className="py-3 px-4 ultraSm:w-full lg:w-1/2 h-[60px] rounded-lg shadow font-thin focus:outline-none focus:shadow-lg focus:shadow-slate-200 duration-100 shadow-gray-100 border"
              />

              {open && (
                <ul
                  className="ultraSm:w-full lg:w-1/2 absolute bg-white z-50 px-4 h-[300px] overflow-y-auto rounded-md"
                  onClick={() => setOpen(!open)}
                >
                  {allSearchCusinesCategory.map((res, index) => {
                    return (
                      <li
                        className={`ultraSm:w-full lg:w-1/2 p-4 mt-2 hover:font-bold hover:transition duration-500 cursor-pointer ${
                          !res?.status
                            ? "text-red-700 line-through"
                            : "text-gray-700 hover:text-black"
                        }`}
                        key={index}
                        value={res._id}
                        onClick={() => {
                          if (res?.status) {
                            document
                              .getElementById("customization")
                              .showModal();
                            setCustomizeProduct(res);
                          }
                        }}
                      >
                        {res.name}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div>
              <div className="center_div justify-start lg:gap-x-6 gap-x-4 flex-nowrap overflow-scroll">
                {subCategory.map((res, index) => {
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        setCurrentSubCategory(
                          currentSubCategory === res._id ? "" : res._id
                        );
                      }}
                      className={`${
                        res._id === currentSubCategory
                          ? "bg-[#000000] text-white"
                          : "bg-[#EFEFEF] text-[#4D4D4D]"
                      } min-w-fit lg:px-4 lg:py-2 py-3 px-4 rounded-3xl center_div lg:min-w-[150px] flex text-sm lg:text-lg cursor-pointer `}
                    >
                      {res.name}
                    </div>
                  );
                })}
              </div>
              <Divider className="!bg-[#B8B8B8]" />
            </div>
          </div>
        </Skeleton>
      </div>
      {/* foods */}
      {/* ======================skeleton lodaer for food */}
      {loading ? (
        Array(5)
          .fill("1")
          ?.map((td, i) => {
            return (
              <Skeleton
                key={i}
                loading={loading}
                active
                className="w-4/5 ms-3 h-[200px] mt-2"
              ></Skeleton>
            );
          })
      ) : (
        <>
          {/* ====================== food list*/}
          <div className="flex flex-col lg:gap-y-24 gap-y-4">
            {productData.map((res, index) => {
              let isDining = pageName === "/dining-cusines";
              const available = res?.status;
              const isMultityped = res?.types?.length;
              const largeItem = isMultityped
                ? getLargeAmountItem(res?.types)
                : null;
              const foodName = res?.name;
              const actualPrice = isMultityped
                ? largeItem?.TypePrice || 0
                : Number(res?.price || 0);
              const offerPercentage = isDining
                ? 0
                : isMultityped
                ? largeItem?.TypeOfferPercentage || 0
                : Number(res?.offer || 0);
              const offerPrice = isMultityped
                ? isDining
                  ? DININGMODE === "percentage"
                    ? Number(actualPrice) +
                      Number(actualPrice) * DININGPERCENTAGE
                    : Number(actualPrice) + DININGPERCENTAGE
                  : offerPercentage
                  ? actualPrice - actualPrice * (offerPercentage / 100)
                  : actualPrice
                : isDining
                ? DININGMODE === "percentage"
                  ? Number(res?.price) + Number(res?.price) * DININGPERCENTAGE
                  : Number(res?.price) + DININGPERCENTAGE
                : Number(res?.discountPrice || 0);

              const isAddedtoCart = currentCartsData?.includes(res?._id);
              console.log({
                currentCartsData,
                foodName,
                actualPrice,
                offerPercentage,
                res,
              });
              return (
                <>
                  <div className="food-container">
                    <div className="food__image_wrapper">
                      <div className="relative">
                        <img
                          src={res?.image}
                          alt={res?.name}
                          className={
                            available
                              ? "ultraSm:w-36 md:w-40 md:h-36 lg:w-72 ultraSm:h-28 lg:h-44 rounded-lg object-cover food--image"
                              : "ultraSm:w-36 md:w-40 md:h-36 lg:w-72 ultraSm:h-28 lg:h-44 rounded-lg object-cover blur-sm food--image"
                          }
                        />
                        {available ? null : (
                          <h1 className="absolute inset-0 lg:left-24 items-center flex px-3 text-red-700 font-bold">
                            unavailable
                          </h1>
                        )}
                      </div>
                    </div>

                    {/* price details */}
                    <div className="food__details_wrapper">
                      <h1 className="text-[#3A3A3A] text-lg ultraSm:text-sm lg:text-3xl font-extrabold uppercase food_text">
                        {foodName}
                      </h1>
                      <div className="flex items-center gap-2">
                        <div
                          className="text-[#999999] relative ultraSm:hidden lg:block"
                          style={{
                            display: offerPercentage ? "block" : "none",
                          }}
                        >
                          {actualPrice}
                          <img
                            src="/assets/icons/linecross.png"
                            alt=""
                            className="absolute top-1"
                          />
                        </div>

                        <Tag
                          color="green"
                          className="flex items-center bg-primary_color text-white rounded-md border-none"
                          style={{
                            display: offerPercentage ? "flex" : "none",
                          }}
                        >
                          <CiDiscount1 className="me-1 text-white text-sm font-bold" />{" "}
                          {offerPercentage}% Discount
                        </Tag>
                      </div>
                      <div className="text-[#262525] ultraSm:text-sm  lg:text-xl flex items-center gap-x-2 ">
                        Price{" "}
                        <div className="text-[#292929] font-bold ">
                          &#8377; {offerPrice}
                        </div>
                      </div>
                    </div>

                    <div className="food__actions">
                      {isAddedtoCart ? (
                        <div
                          className={` text-white bg-black    font-medium center_div rounded-2xl   min-w-[100px] sm-min-w-[200px] md-min-w-[200px]  lg-min-w-[200px]  cursor-pointer flex justify-between items-center `}
                        >
                          <div
                            onClick={() => {
                              handleDecrement(res._id);
                            }}
                            className="w-[30%] hover:bg-primary_color py-2  rounded-l-2xl center_div"
                          >
                            -
                          </div>
                          <div className=" font-bold">
                            {getQuantity(res._id)}
                          </div>
                          <div
                            onClick={() => {
                              if (isMultityped) {
                                document
                                  .getElementById("customization")
                                  .showModal();
                                setCustomizeProduct(res);
                                setEditMulti(true);
                              } else {
                                handleIncrement(res._id);
                              }
                            }}
                            className="w-[30%] hover:bg-primary_color py-2 rounded-r-2xl center_div"
                          >
                            +
                          </div>
                        </div>
                      ) : (
                        <div
                          // onClick={() => {
                          //   handleCartClick(res);
                          // }}
                          onClick={() => {
                            if (available) {
                              document
                                .getElementById("customization")
                                .showModal();
                              setCustomizeProduct(res);
                            }
                          }}
                          className={
                            available
                              ? "hover:bg-primary_color font-medium  cursor-pointer cart__btn"
                              : " cart__btn cart_disabled font-medium  cursor-not-allowed"
                          }
                        >
                          {isMobile ? "Add" : "Add to cart"}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              );
            })}
          </div>
          <Customization
            id={"customization"}
            edit={editMultiType}
            product_data={customizeProduct}
            isDining={pageName === "/dining-cusines"}
            DININGMODE={DININGMODE}
            OnClose={() => {
              fetchData(false);
              fetchCurrentUserCarts(false);
              document?.getElementById("customization")?.hideModal();
            }}
          />
        </>
      )}
    </div>
  );
};

export default Cusinedetails;
