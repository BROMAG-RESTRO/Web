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
    addToCartFromProductDetails,
    getAllBookedTables,
    getProductDetails,
} from "../../helper/api/apiHelper";
import { CiDiscount1 } from "react-icons/ci";
import { GoArrowLeft } from "react-icons/go";

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

    const currentLocation = useHref();

    const orderTypes = [
        {
            id: 1,
            name: "Online Order",
            orderRef: "online_order",
        },
        {
            id: 2,
            name: "Dining Order",
            orderRef: "dining_order",
        },
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
            let datas = _.get(availableTables, "data.data", []).filter(
                (res) => {
                    return (
                        res.booking !== "Checkout" && res.booking !== "Booked"
                    );
                }
            );
            setTables(datas);
        } catch (err) {
            notification.error({ message: "Something went wrong" });
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        if (
            localStorage.getItem(
                "chgi5kjieaoyaiackaiw_bbcqgy4akacsaiq_bbcqgyyaq"
            )
        ) {
            getAllTables();
        }
        fetchData();
    }, []);

    const handleCardClick = (res) => {
        if (
            localStorage.getItem(
                "chgi5kjieaoyaiackaiw_bbcqgy4akacsaiq_bbcqgyyaq"
            )
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
                    console.log("Teesting THE BUG--------------->", res)
                    console.log("res.discountprice-----------", res.discountPrice)
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
                                        className="lg:w-36 lg:h-36  w-full h-[20vh] rounded-lg"
                                    />
                                    {/* price details */}
                                    <div className="flex flex-col gap-y-2 lg:pt-0 pt-8">
                                        <h1 className="text-[#3A3A3A] font-semibold lg:text-3xl">
                                            {res.name}
                                        </h1>
                                        <div className="flex gap-x-2 items-center">
                                            <div className="text-[#999999] font-medium lg:text-md">
                                                Price
                                            </div>
                                            <div className="text-[#575757] relative">
                                                &#8377; {res.price}
                                                <img
                                                    src="/assets/icons/linecross.png"
                                                    alt=""
                                                    className="absolute top-1"
                                                />
                                            </div>
                                            <Tag
                                                color="green"
                                                className="flex items-center  gap-x-1"
                                            >
                                                {" "}
                                                <CiDiscount1 className="text-primary_color text-lg font-bold" />
                                                {res.offer}%
                                            </Tag>
                                        </div>
                                        <div className="text-[#FF2424]  lg:text-md flex items-center gap-x-2 ">
                                            Discount price{" "}
                                            <div className="text-[#292929] ">
                                                &#8377; {res.discountPrice}
                                            </div>
                                        </div>
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
                    onFinish={handleFinish}
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
                                    <Select.Option
                                        value={res.orderRef}
                                        key={index}
                                    >
                                        {res.name}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    </Form.Item>

                    {!_.isEmpty(tables)
                        ? _.get(form.getFieldValue(), "orderRef", "") ===
                              "dining_order" && (
                              <Form.Item
                                  className="!w-full"
                                  name="bookingRef"
                                  label="Select Order Type"
                                  rules={[
                                      {
                                          required: true,
                                          message:
                                              "Please select a type of order",
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
                                          The check-in table is currently
                                          unavailable.
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
                          )}
                    <Form.Item>
                        <Button
                            block
                            loading={loading}
                            htmlType="submit"
                            className="!w-full !m-auto lg:!h-[60px] h-[50px]  !border-none rounded-[25px]  bg-yellow_color center_div"
                        >
                            <div className="lg:text-lg text-[#EFEFEF] font-semibold">
                                Add to cart
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
