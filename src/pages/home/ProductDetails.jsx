import {
  Divider,
  Modal,
  notification,
  Skeleton,
  Form,
  Select,
  Button,
  Empty,
  Tag,
} from "antd";
import { useEffect, useState } from "react";
import _ from "lodash";
import { useNavigate, useLocation, useHref } from "react-router-dom";
import {
  addMultiCartFromProductDetails,
  addToCartFromProductDetails,
  getAllBookedTables,
  getProductDetails,
} from "../../helper/api/apiHelper";
import { CiDiscount1 } from "react-icons/ci";
import { GoArrowLeft } from "react-icons/go";
import { GiBowlOfRice } from "react-icons/gi";

import "../../assets/css/foodDetails.css";

const ProductDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [productDetails, setProductDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modals, setopenmodal] = useState(false);
  const [triger, setTriger] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [tables, setTables] = useState([]);
  const [modal, contextHolder] = Modal.useModal();
  const [form] = Form.useForm();

  const [cartFood, setCartFood] = useState({});

  const currentLocation = useHref();

  const orderTypes = [
    {
      id: 1,
      name: "Online Order",
      orderRef: "online_order",
    },
    // {
    //   id: 2,
    //   name: "Dining Order",
    //   orderRef: "dining_order",
    // },
    {
      id: 3,
      name: "Take Away Order",
      orderRef: "takeaway_order",
    },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      let targetFood = _.get(location, "state.currentCatid", "");
      const result = await getProductDetails(targetFood);

      setProductDetails(_.get(result, "data.data", []));
      setLoading(false);
    } catch (err) {
      setLoading(false);
      notification.error({ message: "Something went wrong" });
    }
  };

  const getAllTables = async () => {
    try {
      const availableTables = await getAllBookedTables();
      let datas = _.get(availableTables, "data.data", []).filter((res) => {
        return res.booking !== "Checkout" && res.booking !== "Booked";
      });
      setTables(datas);
    } catch (err) {
      notification.error({ message: "Something went wrong" });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (
      localStorage.getItem("chgi5kjieaoyaiackaiw_bbcqgy4akacsaiq_bbcqgyyaq")
    ) {
      getAllTables();
    }
    fetchData();
  }, []);

  const handleCardClick = (res) => {
    if (
      localStorage.getItem("chgi5kjieaoyaiackaiw_bbcqgy4akacsaiq_bbcqgyyaq")
    ) {
      setCurrentId(res._id);
      setopenmodal(true);
      form.resetFields();
    } else {
      navigate("/login", {
        state: {
          currentCatid: _.get(location, "state.currentCatid", ""),
          backLocation: currentLocation,
        },
      });
    }
  };

  const handleCancel = () => {
    setopenmodal(false);
    form.resetFields();
  };

  const handleFinish = async (values) => {
    try {
      setLoading(true);
      values.productRef = currentId;

      const result = await addToCartFromProductDetails(values);
      if (_.get(result, "data.data", "") === "already exist") {
        setopenmodal(false);
        modal.confirm({
          title: "This is a confirmation message",
          content: `This food item is already in your cart.`,
          style: { background: "white", borderRadius: "10px" },
          cancelText: "Cancel",
          okText: "Go to cart",
          onOk: () => {
            if (values.orderRef === "takeaway_order") {
              navigate("/take-away-cart");
            } else if (values.orderRef === "online_order") {
              navigate("/online-order-cart");
            } else if (values.orderRef === "dining_order") {
              navigate("/dining-cart", {
                state: { bookingref: values.bookingRef },
              });
            }
          },
        });
      } else {
        setopenmodal(false);
        modal.confirm({
          title: "This is a confirmation message",
          content: `The food item has been added to the cart.`,
          style: { background: "white", borderRadius: "10px" },
          cancelText: "Cancel",
          okText: "Go to cart",
          onOk: () => {
            if (values.orderRef === "takeaway_order") {
              navigate("/take-away-cart");
            } else if (values.orderRef === "online_order") {
              navigate("/online-order-cart");
            } else if (values.orderRef === "dining_order") {
              navigate("/dining-cart", {
                state: { bookingref: values.bookingRef },
              });
            }
          },
        });
      }
      setCurrentId("");
      form.resetFields();
    } catch (err) {
      console.log(err);
      notification.error({ message: "Add to cart Failed" });
    } finally {
      setLoading(false);
    }
  };

  const AddMultiTypeCart = async (values) => {
    try {
      setLoading(true);
      values.productRef = currentId;
      let orderedFood = productDetails?.[0]?.types?.map((td) => {
        if (
          Object?.keys(cartFood)?.includes(td?._id) &&
          cartFood[td?._id] > 0
        ) {
          return {
            productRef: currentId,
            typeRef: td,
            quantity: cartFood[td?._id],
            orderRef: values?.orderRef,
          };
        }

        return;
      });

      const result = await addMultiCartFromProductDetails({ orderedFood });

      if (_.get(result, "data.data", "") === "already exist") {
        setopenmodal(false);
        modal.confirm({
          title: "This is a confirmation message",
          content: `This food item is already in your cart.`,
          style: { background: "white", borderRadius: "10px" },
          cancelText: "Cancel",
          okText: "Go to cart",
          onOk: () => {
            if (values.orderRef === "takeaway_order") {
              navigate("/take-away-cart");
            } else if (values.orderRef === "online_order") {
              navigate("/online-order-cart");
            } else if (values.orderRef === "dining_order") {
              navigate("/dining-cart", {
                state: { bookingref: values.bookingRef },
              });
            }
          },
        });
      } else {
        setopenmodal(false);
        modal.confirm({
          title: "This is a confirmation message",
          content: `The food item has been added to the cart.`,
          style: { background: "white", borderRadius: "10px" },
          cancelText: "Cancel",
          okText: "Go to cart",
          onOk: () => {
            if (values.orderRef === "takeaway_order") {
              navigate("/take-away-cart");
            } else if (values.orderRef === "online_order") {
              navigate("/online-order-cart");
            } else if (values.orderRef === "dining_order") {
              navigate("/dining-cart", {
                state: { bookingref: values.bookingRef },
              });
            }
          },
        });
      }
      setCurrentId("");
      setCartFood({});
      form.resetFields();
    } catch (err) {
      console.log(err);
      notification.error({ message: "Add to cart Failed" });
    } finally {
      setLoading(false);
    }
  };
  const getLargeAmountItem = (types) => {
    const orderedItems = types?.sort((a, b) => b.TypePrice - a.TypePrice);

    // Get the item with the largest TypePrice
    return orderedItems[0];
  };

  const handleTypeChange = (
    selectedType,
    selectedPrice,
    id,
    offerPercentage
  ) => {
    // setQuantity(historyCart?.[id] || 1);
    // setPrice(
    //   typeof selectedPrice === "number"
    //     ? selectedPrice
    //     : parseInt(selectedPrice)
    // );
    // setProductPrice(
    //   typeof selectedPrice === "number"
    //     ? selectedPrice
    //     : parseInt(selectedPrice)
    // );
    // setTypeRef(id);
    // setTypeOfferPer(offerPercentage);
  };

  return (
    <div className="w-full lg:px-20 px-4  flex flex-col lg:gap-y-10 pb-10 min-h-screen">
      <div className="flex flex-col lg:gap-y-16 gap-y-5">
        <div className="flex lg:items-center justify-start gap-x-2  w-full  pt-11 lg:flex-row flex-row items-center gap-y-4">
          <GoArrowLeft
            onClick={() => {
              navigate("/");
            }}
            className="!cursor-pointer"
          />
          <div>
            <h1 className="text-dark_color font-medium lg:text-xl   ">
              Food Details &nbsp;
            </h1>
            <img src="/assets/icons/orderborder.png" alt="" />
          </div>
        </div>
      </div>
      <Divider />
      <div className="flex flex-col lg:gap-y-24">
        {productDetails.map((res, index) => {
          console.log("Teesting THE BUG--------------->", res);
          console.log("res.discountprice-----------", res.discountPrice);
          const isMultityped = res?.types?.length;
          const isDining = false;
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
              ? Number(actualPrice) + (Number(actualPrice) * 30) / 100
              : offerPercentage
              ? actualPrice - actualPrice * (offerPercentage / 100)
              : actualPrice
            : isDining
            ? Number(res?.price) + (Number(res?.price) * 30) / 100
            : Number(res?.discountPrice || 0);
          return (
            <Skeleton
              key={index}
              loading={loading}
              active
              className="w-[500px] h-[200px] "
            >
              <div className="flex w-full lg:items-center justify-between gap-y-10 lg:flex-row   flex-col lg:shadow-none shadow-2xl  rounded-lg lg:px-0 py-10 lg:py-0 px-4">
                <div className="center_div justify-start gap-x-4">
                  {/* image */}
                  <img
                    src={res.image}
                    alt=""
                    className="lg:w-40 lg:h-40  w-full h-[50vh] rounded-lg"
                  />
                  {/* price details */}
                  <div className="flex flex-col gap-y-2 lg:pt-0 pt-8">
                    <h1 className="text-[#3A3A3A] font-semibold lg:text-3xl uppercase">
                      {res.name}
                    </h1>
                    <div className="flex gap-x-2 items-center">
                      {/* <div className="text-[#999999] font-medium lg:text-md">
                        Price
                      </div> */}
                      <div className="text-[#999999] relative ultraSm:hidden lg:block">
                        &#8377; {actualPrice}
                        <img
                          src="/assets/icons/linecross.png"
                          alt=""
                          className="absolute top-1"
                          style={{
                            display: Number(offerPercentage) ? "block" : "none",
                          }}
                        />
                      </div>
                      {Number(offerPercentage) ? (
                        <Tag
                          color="green"
                          className="flex items-center bg-primary_color text-white rounded-md border-none"
                          style={{
                            display: offerPercentage ? "flex" : "none",
                          }}
                        >
                          <CiDiscount1 className="me-1 text-white text-sm font-bold" />{" "}
                          {offerPercentage}%
                        </Tag>
                      ) : null}
                    </div>
                    {Number(offerPrice) ? (
                      <div className="text-[#000]  lg:text-md flex items-center gap-x-2 ">
                        Price{" "}
                        <div className="text-[#292929] ">
                          &#8377; {offerPrice}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
                {/* cart button */}
                <div
                  onClick={() => {
                    handleCardClick(res);
                  }}
                  className={` ${"bg-[#000000] text-white "} font-medium center_div rounded-2xl px-3 py-2 min-w-[200px] cursor-pointer`}
                >
                  Add to cart
                </div>
              </div>
            </Skeleton>
          );
        })}
      </div>
      <Modal
        destroyOnClose
        open={modals}
        onCancel={handleCancel}
        footer={false}
        className="!bg-white !rounded-xl"
        closable={false}
        title="Place the item in the Food cart."
      >
        <Form
          form={form}
          layout="vertical"
          className="pt-2 flex flex-col gap-y-4"
          onFinish={
            productDetails[0]?.types?.length ? AddMultiTypeCart : handleFinish
          }
        >
          <Form.Item
            className="!w-full"
            name="orderRef"
            label="Select Order Type"
            rules={[
              {
                required: true,
                message: "Please select a type of order",
              },
            ]}
          >
            <Select
              className="antd_input !rounded-lg !bg-white"
              placeholder="Select Order Type"
              onChange={(e) => {
                setTriger(!triger);
                form.setFieldsValue({ orderRef: e });
              }}
            >
              {orderTypes.map((res, index) => {
                return (
                  <Select.Option value={res.orderRef} key={index}>
                    {res.name}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <div>
            <div className="flex items-center gap-1 font-bold font-lg ms-3 ">
              <GiBowlOfRice size={20} color={"orange"} />{" "}
              {productDetails?.[0]?.name}
            </div>
            {productDetails?.[0]?.types &&
              productDetails?.[0]?.types.map((data) => {
                let isDining = false;
                let food = productDetails?.[0];
                let actualPrice = Number(data?.TypePrice) || 0;
                let offerPercentage = Number(data?.TypeOfferPercentage) || 0;
                let offerPrice =
                  actualPrice - actualPrice * (offerPercentage / 100);

                let tmpQty = cartFood[data?._id];
                return (
                  <div className="food_details_container mt-2" key={data._id}>
                    {!data?.Type ? null : (
                      <>
                        <div className="food_details_info">
                          <div className="food_data">
                            <span className="item__type--name uppercase font-bold">
                              {data?.Type}{" "}
                            </span>
                            {offerPercentage ? (
                              <div className="discount__tag">
                                <CiDiscount1 className="me-1 text-white text-sm font-bold" />{" "}
                                {offerPercentage}%
                              </div>
                            ) : null}
                          </div>

                          <span className="item__type--price">
                            {offerPercentage ? (
                              <span
                                style={{
                                  textDecorationLine: "line-through",
                                }}
                              >
                                {" "}
                                ₹ {actualPrice}
                              </span>
                            ) : null}
                            <span className="ms-1">
                              {" "}
                              ₹
                              {isDining
                                ? Number(data?.TypePrice) +
                                  (Number(data?.TypePrice) * 30) / 100
                                : data?.TypeOfferPrice
                                ? data?.TypeOfferPrice
                                : data?.TypePrice}
                              .00
                            </span>
                          </span>
                          <div></div>
                        </div>

                        <div className="food_details_action">
                          {tmpQty ? (
                            <>
                              <div className="text-end  font-bold  font-lg ">
                                {" "}
                                ₹ {offerPrice * tmpQty}
                              </div>
                              <div
                                className={` text-white bg-black    font-medium center_div rounded-2xl   min-w-[100px] sm-min-w-[200px] md-min-w-[200px]  lg-min-w-[200px]  cursor-pointer flex justify-between items-center `}
                              >
                                <div
                                  onClick={() => {
                                    let tmp = { ...cartFood };
                                    tmp[data?._id] = tmp[data?._id] - 1;
                                    setCartFood(tmp);
                                  }}
                                  className="w-[30%] hover:bg-primary_color py-2  rounded-l-2xl center_div"
                                >
                                  -
                                </div>
                                <div className=" font-bold">{tmpQty}</div>
                                <div
                                  onClick={() => {
                                    let tmp = { ...cartFood };
                                    tmp[data?._id] = tmp[data?._id] + 1;
                                    setCartFood(tmp);
                                  }}
                                  className="w-[30%] hover:bg-primary_color py-2 rounded-r-2xl center_div"
                                >
                                  +
                                </div>
                              </div>
                            </>
                          ) : (
                            <div
                              onClick={() => {
                                let tmp = { ...cartFood };
                                tmp[data?._id] = 1;
                                setCartFood(tmp);
                              }}
                              className={
                                "hover:bg-primary_color font-medium  cursor-pointer cart__btn"
                              }
                            >
                              Add
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
          </div>

          {/* {!_.isEmpty(tables)
            ? _.get(form.getFieldValue(), "orderRef", "") ===
                "dining_order" && (
                <Form.Item
                  className="!w-full"
                  name="bookingRef"
                  label="Select Order Type"
                  rules={[
                    {
                      required: true,
                      message: "Please select a type of order",
                    },
                  ]}
                >
                  <Select
                    className="antd_input !rounded-lg !bg-white"
                    placeholder="Select Table"
                    onChange={(e) => {
                      form.setFieldsValue({
                        bookingRef: e,
                      });
                    }}
                  >
                    {tables.map((res, index) => {
                      return (
                        <Select.Option
                          value={res._id}
                          key={index}
                        >{`Table ${res.tableNo}`}</Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              )
            : _.get(form.getFieldValue(), "orderRef", "") ===
                "dining_order" && (
                <Empty
                  description={
                    <p>
                      The check-in table is currently unavailable.
                      <br /> click{" "}
                      <span
                        onClick={() => {
                          navigate("/book-my-tables");
                        }}
                        className="text-blue-500 cursor-pointer"
                      >
                        here
                      </span>{" "}
                      to book tables
                    </p>
                  }
                />
              )} */}
          <Form.Item>
            <Button
              block
              loading={loading}
              disabled={
                productDetails?.[0]?.types?.length
                  ? !Object.values(cartFood)?.filter(Boolean)?.length
                  : false
              }
              htmlType="submit"
              className="!w-full !m-auto lg:!h-[60px] h-[50px]  !border-none rounded-[25px]  bg-yellow_color center_div"
            >
              <div className="lg:text-lg text-[#EFEFEF] font-semibold">
                Add to cart{" "}
                {Object.values(cartFood)?.filter(Boolean)?.length
                  ? `( ${Object.values(cartFood)?.filter(Boolean)?.length} )`
                  : ""}
              </div>
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {contextHolder}
    </div>
  );
};

export default ProductDetails;
