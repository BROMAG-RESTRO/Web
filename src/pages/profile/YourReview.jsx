import {
    Button,
    Card,
    Drawer,
    Empty,
    Form,
    Input,
    Rate,
    Tag,
    notification,
} from "antd";
import _ from "lodash";
import { useEffect, useState } from "react";
import {
    addMyfeedback,
    deleteMyFeedBack,
    getMyfeedback,
} from "../../helper/api/apiHelper";
import ProfileHeading from "../../components/ProfileHeading";
import BoxLoadingScreen from "../../components/BoxLoadingScreen";
import { DeleteFilled } from "@ant-design/icons";
import moment from "moment";

const YourReview = () => {
    const [form] = Form.useForm();
    const [openModal, setOpenModal] = useState(false);
    const [feedbackData, setFeedbackData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState("");

    const fetchData = async () => {
        try {
            setLoading(true);
            const result = await getMyfeedback();
            setFeedbackData(_.get(result, "data.data", []));
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleFinish = async (values) => {
        try {
            setLoading(true);
            await addMyfeedback(values);
            notification.success({ message: "Thanks for feedback" });
            form.resetFields();
            setOpenModal(false);
            fetchData();
        } catch (err) {
            notification.error({ message: "Something went wrong" });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = async (id) => {
        try {
            setLoading(true);
            await deleteMyFeedBack(id);
            fetchData();
            notification.success({ message: "Successfully deleted" });
        } catch (err) {
            notification.error({ message: "Failed to delete" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="profile_head">
                <div className="w-full flex  justify-between">
                    <ProfileHeading message={"Your Review"} />
                    <Tag
                        className={`!px-3 py-1 bg-primary_color text-white ${
                            _.isEmpty(feedbackData) ? "hidden" : "block"
                        } cursor-pointer !border-none`}
                        onClick={() => {
                            setOpenModal(true);
                            setView("");
                        }}
                    >
                        Add
                    </Tag>
                </div>

                {loading ? (
                    <BoxLoadingScreen loading={loading} />
                ) : _.isEmpty(feedbackData) ? (
                    <div className="center_div w-full lg:px-2 min-h-[50vh] items-center ">
                        <Empty
                            description={
                                <span>
                                    You currently have no reviews
                                    <br /> add a new one by clicking this link.
                                    <span
                                        className="text-blue-500 cursor-pointer"
                                        onClick={() => {
                                            setOpenModal(true);
                                            setView("");
                                        }}
                                    >
                                        &nbsp;here
                                    </span>
                                </span>
                            }
                        />
                    </div>
                ) : (
                    <div className="profile_cards_grid">
                        {feedbackData.map((res, index) => {
                            return (
                                <Card
                                    hoverable
                                    key={index}
                                    className="shadow !cursor-default !min-h-[250px]"
                                    title={
                                        <div className="!text-[12px] !text-gray-400 !shadow-lg">
                                            {moment(res.createdAt).format(
                                                "lll"
                                            )}
                                        </div>
                                    }
                                    extra={
                                        <DeleteFilled
                                            className="!text-red-500 cursor-pointer"
                                            onClick={() => {
                                                handleDeleteClick(res._id);
                                            }}
                                        />
                                    }
                                >
                                    <Card.Meta
                                        title={
                                            <Rate
                                                value={res.ratings}
                                                disabled
                                            />
                                        }
                                        description={
                                            <div className="text-justify indent-4 text-dark_color leading-loose">
                                                {_.get(
                                                    res,
                                                    "message",
                                                    ""
                                                ).slice(0, 150)}{" "}
                                                &nbsp;
                                                {_.get(res, "message", "")
                                                    .length >= 150 ? (
                                                    <span
                                                        onClick={() => {
                                                            setOpenModal(true);
                                                            setView(
                                                                _.get(
                                                                    res,
                                                                    "message",
                                                                    ""
                                                                )
                                                            );
                                                        }}
                                                        className="text-[12px] text-primary_color cursor-pointer"
                                                    >
                                                        view more
                                                    </span>
                                                ) : (
                                                    ""
                                                )}
                                            </div>
                                        }
                                    />
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>

            <Drawer
                title={view ? "" : "Enter Your Review"}
                destroyOnClose
                open={openModal}
                onClose={() => {
                    setOpenModal(false);
                    setView("");
                }}
                footer={false}
                classNames={"!rounded-lg"}
            >
                {view ? (
                    <div className="text-black leading-loose indent-8 px-2 lg:px-4 text-justify pt-2">
                        {view}
                    </div>
                ) : (
                    <Form
                        layout="vertical"
                        className="bg-white px-4 py-4 rounded-lg"
                        onFinish={handleFinish}
                    >
                        <Form.Item
                            label="Feedback"
                            name="feedback"
                            rules={[
                                {
                                    required: true,
                                    message: "Enter Your Review",
                                },
                            ]}
                        >
                            <Input.TextArea
                                className="antd_input w-full !h-[100px]"
                                placeholder="Enter Your Review | Feedback"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Ratings"
                            name="rating"
                            rules={[
                                {
                                    required: true,
                                    message: "Enter Your Review",
                                },
                            ]}
                        >
                            <Rate />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                htmlType="submit"
                                loading={loading}
                                className="!border-none !bg-yellow_color !w-full !h-[50px] !rounded-2xl"
                            >
                                <div className="text-[#EFEFEF] font-semibold">
                                    Send to BROMAG Admin
                                </div>
                            </Button>
                        </Form.Item>
                    </Form>
                )}
            </Drawer>
        </>
    );
};

export default YourReview;
