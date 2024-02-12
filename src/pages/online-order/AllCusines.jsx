/* eslint-disable react/prop-types */
import { Divider, Empty, Input, notification, Skeleton, Tag,Badge } from "antd";
import { memo, useEffect, useState } from "react";
import { useNavigate, useLocation, useHref } from "react-router-dom";
import _ from "lodash";
import { getAllCusinessData, getCurrentUserCarts, logoutCurrentUser } from "../../helper/api/apiHelper";
import { SearchOutlined } from "@ant-design/icons";
import { GoArrowLeft } from "react-icons/go";
import ShoppingCartOutlined from '@ant-design/icons/ShoppingCartOutlined';

const AllCusines = ({ selectedCurrentTable }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [allCusinesCategory, setAllCusinesData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentCartsData, setCurrentCartsData] = useState([]);
    const [allCartsData, setAllCartsData] = useState([]);
    const [search, setSearch] = useState("");
    const currentLocation = useHref();

    const handleClick = (id) => {
        let path = _.get(location, "pathname", "");
        localStorage.removeItem("search");
        if (path === "/take-away") {
            navigate("/take-away-cusiness", { state: { currentCatid: id } });
        } else if (path === "/online-order") {
            navigate("/cusines", { state: { currentCatid: id } });
        } else if (path === "/dining" || path === "/profile-table-booking") {
            navigate("/dining-cusines", {
                state: {
                    currentCatid: id,
                    table_details: selectedCurrentTable,
                },
            });
        }
    };
    const getOrderReference  = () => {
        let orderRef = "";
        let path = _.get(location, "pathname", "");

        if (path === '/online-order') {
            
          orderRef = "online_order";
            
        } else if (path === '/take-away') {
            
            orderRef = "takeaway_order";

        }
        

        // else if (path === "/take-away-cusiness") {
        //   orderRef = "takeaway_order";
        // } else if (path === "/cusines") {
        //   orderRef = "online_order";
        // } else if (path === "/dining-cusines") {
        //   orderRef = "dining_order";
        // }


        return orderRef;


        
      };
    const fetchCurrentUserCarts = async () => {
        try {
          setLoading(true);
            let orderStatus = getOrderReference (); 
           
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

    const fetchData = async () => {
        try {
            setLoading(true);
            let searchData = { search: search };
            const result = await getAllCusinessData(JSON.stringify(searchData));
            setAllCusinesData(_.get(result, "data.data", []));
            setLoading(false);
        } catch (err) {
            setLoading(false);
            notification.error({ message: "Something went wrong" });
        }
    };

    useEffect(() => {
        fetchData();
    }, [search]);

    const handleReachCart = () => {
        if (
            localStorage.getItem(
                "chgi5kjieaoyaiackaiw_bbcqgy4akacsaiq_bbcqgyyaq"
            )
        ) {
            let path = _.get(location, "pathname", "");

            if (path === "/take-away") {
                navigate("/take-away-cart");
            } else if (path === "/online-order") {
                navigate("/online-order-cart");
            } else if (path === "/dining") {
                navigate("/dining-cart", {
                    state: { table_details: selectedCurrentTable },
                });
            }
        } else {
            navigate("/login", { state: { backLocation: currentLocation } });
        }
    };

    return (
        <div className="w-full lg:px-20 px-4  flex flex-col lg:gap-y-10 pb-10 min-h-screen">
            <div className="flex flex-col lg:gap-y-16 gap-y-5">
                <div className="flex lg:items-center lg:justify-between  justify-start w-full lg:pt-11  pt-6 lg:flex-row flex-col gap-y-4">
                    <div className="center_div justify-between gap-x-2">
                        <div className="center_div justify-start gap-x-2">
                            <GoArrowLeft
                                onClick={() => {
                                    navigate("/");
                                }}
                                className="!cursor-pointer"
                            />{" "}
                            <div>
                                <h1 className="text-dark_color font-medium lg:text-xl   ">
                                    Order Food &nbsp;{" "}
                                    {!_.isEmpty(selectedCurrentTable) &&
                                        `for Table ${_.get(
                                            selectedCurrentTable,
                                            "tableNo",
                                            ""
                                        )}`}
                                </h1>
                                <img
                                    src="/assets/icons/orderborder.png"
                                    alt=""
                                />
                            </div>
                        </div>
                        <div className="lg:hidden block">
                            {currentLocation === "/take-away" ? (
                                <div className="font-bold text-primary_color text-sm lg:hidden block">
                                    Take Away
                                </div>
                            ) : (
                                <div className="font-bold text-primary_color text-sm lg:hidden block">
                                    {" "}
                                    Online Orders
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        <Input
                            onChange={(e) => {
                                setSearch(e.target.value);
                            }}
                            suffix={<SearchOutlined />}
                            type="text"
                            placeholder="search cuisines"
                            className="border border-gray-400 indent-4 hover:!border-gray-400 focus:!border-gray-400 py-3 lg:!w-[20vw] !w-full rounded-xl !outline-none"
                        />
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-[#3A3A3A] font-semibold  lg:text-6xl">
                            MULTI CUISINES
                        </div>
                       
                          
                        <Badge
                  size="small"
                  offset={[-10, 3]}
                  color="#000000"
                  count={currentCartsData?.length}
                        >
                        <Tag
      onClick={handleReachCart}
      className="!bg-primary_color text-white cursor-pointer rounded-md lg:px-3 lg:py-1 lg:text-sm text-[10px] font-bold"
      color="yellow"
      style={{ position: 'relative' }}
      >
   
        Go to Cart
                        </Tag>
                        
    </Badge>       

                       



      
                    </div>
                    <Divider className="!bg-[#B8B8B8]" />
                </div>
            </div>
            <Skeleton
                active
                loading={loading}
                className="lg:w-[500px] lg:h-[100px]"
            >
                {!_.isEmpty(allCusinesCategory) ? (
                    <div className="grid lg:grid-cols-4 grid-cols-1 gap-x-2 gap-y-6 md:grid-cols-3">
                        {allCusinesCategory.map((res, index) => {
                            return (
                                <div
                                    key={index}
                                    className="lg:!w-[20vw] !h-[30vh]  rounded-2xl relative cursor-pointer"
                                    onClick={() => handleClick(res._id)}
                                >
                                    <img
                                        src={res.image}
                                        alt=""
                                        className="w-full h-full !object-cover rounded-2xl"
                                    />
                                    <div className="bg-gradient-to-b from-[#00000000] from-0% to-[#000000] to-90% absolute bottom-0 w-full h-[10vh] rounded-b-2xl center_div text-white font-medium">
                                        {res.name}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
            </Skeleton>
        </div>
    );
};

export default memo(AllCusines);
