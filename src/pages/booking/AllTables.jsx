import { useEffect, useState } from "react";
import { useNavigate, useHref } from "react-router-dom";
import { Card, notification } from "antd";
import { getAllTables } from "../../helper/api/apiHelper";
import _ from "lodash";
import BoxLoadingScreen from "../../components/BoxLoadingScreen";

const AllTables = () => {
    const navigate = useNavigate();
    const currentLocation = useHref();

    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleClick = (res) => {
        if (
            localStorage.getItem(
                "chgi5kjieaoyaiackaiw_bbcqgy4akacsaiq_bbcqgyyaq"
            )
        ) {
            setLoading(true);
            if (!res.status) {
                navigate("/booking-details", { state: res });
            }
            setLoading(false);
        } else {
            setLoading(false);
            navigate("/login", { state: { backLocation: currentLocation } });
        }
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const result = await getAllTables();
            setTables(_.get(result, "data.data", ""));
        } catch (err) {
            notification.error({ message: "Something went wrong" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="w-screen min-h-screen">
            <div className="lg:px-20 !px-2 pt-20 flex flex-col items-center gap-y-10 pb-10 center_div">
                <div className="lg:text-4xl font-semibold text-[#3A3A3A] relative">
                    Secure your table in a click
                    <img
                        src="/assets/icons/orderborder.png"
                        alt=""
                        className="absolute"
                    />
                </div>
                {loading ? (
                    <div className="w-full min-h-screen lg:px-20 center_div">
                        <BoxLoadingScreen loading={loading} />
                    </div>
                ) : (
                    <div className="grid xl:grid-cols-4 lg:grid-cols-3 lg:w-[100%] w-full lg:px-10 md:grid-cols-2 grid-cols-1 gap-x-5 gap-y-14 lg:pt-4 items-center justify-center min-h-full">
                        {tables.map((res, index) => {
                            return (
                                <Card
                                    key={index}
                                    hoverable
                                    className="lg:!w-[300px]  w-[98%]   rounded-2xl shadow-2xl relative !cursor-default"
                                    cover={
                                        <img
                                            alt="example"
                                            src={res.image}
                                            className={` w-[300px] h-[180px] !object-cover m-auto p-2 !rounded-2xl !shadow-inner ${
                                                res.status
                                                    ? "!blur-[1.4px]"
                                                    : "blur-0"
                                            }`}
                                        />
                                    }
                                >
                                    <Card.Meta
                                        title={
                                            <h1 className="text-[#3F3F3F] font-semibold text-lg">
                                                Table&nbsp;{res.tableNo}
                                            </h1>
                                        }
                                        description={
                                            <h2 className="text-[#999999] text-sm">
                                                {res.seatsAvailable}
                                                &nbsp;seaters
                                            </h2>
                                        }
                                    />
                                    <div
                                        onClick={() => {
                                            handleClick(res);
                                        }}
                                        className={`center_div h-[50px] !p-0 absolute -bottom-[35px] left-0 w-full !m-0  cursor-pointer ${
                                            res.status
                                                ? "bg-[#999999] text-[#B6B6B6] !cursor-not-allowed"
                                                : "bg-[#2E2E2E] text-white"
                                        }  rounded-b-2xl`}
                                    >
                                        {res.status ? "Booked" : "Book now"}
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllTables;
