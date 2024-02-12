/* eslint-disable no-empty */
/* eslint-disable react/jsx-key */
import {
    Avatar,
    Button,
    Card,
    Divider,
    Drawer,
    Form,
    Input,
    Modal,
    Skeleton,
    Spin,
    notification,
    message,
} from "antd";
import { useEffect, useState } from "react";
import ProfileHeading from "../../components/ProfileHeading";
import { LiaUserEditSolid } from "react-icons/lia";
import {
    logoutCurrentUser,
    moveToCloud,
    tokenVerification,
    updateMyPic,
    updateProfile,
} from "../../helper/api/apiHelper";
import { MdCall } from "react-icons/md";
import _, { debounce } from "lodash";
import { PhoneInput } from "react-international-phone";
import { MdEditNote } from "react-icons/md";
import { IoMdLogOut } from "react-icons/io";
import Dragger from "antd/es/upload/Dragger";
import { CloudUploadOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { triger } from "../../redux/authSlice";
import { phoneNumberValidation } from "../../helper/validation";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MyProfile = () => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState("");

    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [modal, contextHolder] = Modal.useModal();

    const [user, setUser] = useState([]);

    const data = useSelector((data) => {
        return data;
    });

    const dispatch = useDispatch();

    const fetchData = async () => {
        try {
            setLoading(true);
            const userDeails = await tokenVerification();
            setUser(_.get(userDeails, "data.data", []));
        } catch (err) {
            notification.error({ message: "Something went wrong" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (
            localStorage.getItem(
                "chgi5kjieaoyaiackaiw_bbcqgy4akacsaiq_bbcqgyyaq"
            )
        ) {
            fetchData();
        } else {
            navigate("/");
        }
    }, []);

    const handleUpdateimage = async (res) => {
        try {
            setLoading(true);
            let url = `/assets/logo/${res}.png`;
            await updateMyPic({ user_image: url });
            dispatch(triger({ value: !_.get(data, "auth.value", "") }));
            setOpen("");
            fetchData();
            notification.success({ message: "Profile updated successfully" });
        } catch (err) {
        } finally {
            setLoading(false);
        }
    };

    const debouncedOnChange = debounce(async (file) => {
        try {
            let incommingType = _.get(file, "file.name", "").split(".")[1];
            if (!["jpg", "png", "jpeg"].includes(incommingType)) {
                setLoading(false);
                return message.error(
                    "Invalid File Type Please Upload jpg, png or jpeg"
                );
            }
            setLoading(true);
            const formData = new FormData();
            formData.append("file", file.file.originFileObj);
            formData.append(
                "user_image_key",
                _.get(user, "[0].user_image_key", "")
            );
            await moveToCloud(formData);
            dispatch(triger({ value: !_.get(data, "auth.value", "") }));
            setOpen("");
            fetchData();
            notification.success({ message: "Profile updated successfully" });
        } catch (err) {
            notification.error({ message: "Profile updation failed" });
        } finally {
            setLoading(false);
        }
    }, 300);

    const uploadtocloud = (file) => {
        try {
            setLoading(true);
            debouncedOnChange(file);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        try {
            form.setFieldsValue({
                alter_mobile_number:
                    _.get(user, "[0].alter_mobile_number", "") ||
                    "+910000000000",
                phoneNumber: _.get(user, "[0].phoneNumber", ""),
                email: _.get(user, "[0].email", ""),
                user: _.get(user, "[0].user", ""),
            });
            setOpen("form");
        } catch (err) {
            console.log(err);
        }
    };

    const handleFinish = async (values) => {
        try {
            setLoading(true);
            await updateProfile(values);
            dispatch(triger({ value: !_.get(data, "auth.value", "") }));
            setOpen("");
            fetchData();
            notification.success({ message: "Profile updated successfully" });
        } catch (err) {
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            setLoading(true);
            await logoutCurrentUser();
            localStorage.removeItem(
                "chgi5kjieaoyaiackaiw_bbcqgy4akacsaiq_bbcqgyyaq"
            );
            axios.defaults.headers.common[
                "aizasycoxsewxv2t64dxca-wl8n8qfq0gzux1as"
            ] = localStorage.getItem(
                "chgi5kjieaoyaiackaiw_bbcqgy4akacsaiq_bbcqgyyaq"
            );
            notification.success({
                message: "You have successfully logged out",
            });
            setLoading(false);
            navigate("/");
        } catch (err) {
            console.log(err);
            setLoading(false);
            notification.error({ message: "Something went wrong" });
        }
    };

    const handlebeforelogout = () => {
        modal.confirm({
            title: "This is a confirmation message",
            content: `Are you sure you want to log out`,
            cancelText: "Not Now",
            okText: "logout",
            style: { background: "white", borderRadius: "10px" },
            onOk: () => {
                handleLogout();
            },
        });
    };

    return (
        <>
            <div className="lg:w-[80vw] w-full px-2 min-h-screen pb-20">
                <ProfileHeading message={" Your Account"} />
                <div className="w-full min-h-full pt-10 flex justify-center  items-start gap-x-10 lg:flex-row flex-col">
                    {/* left */}

                    <Card
                        hoverable
                        className=" pt-2 w-full    !cursor-default"
                        actions={[
                            <div className="flex items-center justify-evenly">
                                <div
                                    onClick={handleEdit}
                                    className="flex items-center gap-x-2 !text-sm text-dark3a_color hover:text-green-500"
                                >
                                    <MdEditNote className="!text-lg" />
                                    Edit
                                </div>
                                <Divider type="vertical" />
                                <div
                                    onClick={handlebeforelogout}
                                    className="flex items-center gap-x-1 cursor-pointer !text-sm text-dark3a_color hover:text-red-500"
                                >
                                    <IoMdLogOut /> Logout
                                </div>
                            </div>,
                        ]}
                        cover={
                            <div className=" !w-[150px] !h-[150px] !m-auto !rounded-full !relative pt-10">
                                {loading ? (
                                    <Skeleton.Image
                                        active={true}
                                        className="!rounded-full !w-[150px] !h-[150px] m-auto"
                                    />
                                ) : _.get(user, "[0].user_image", "") ? (
                                    <img
                                        className="!rounded-full !w-[150px] !h-[150px] m-auto"
                                        src={_.get(user, "[0].user_image", "")}
                                    />
                                ) : (
                                    <Avatar className="!rounded-full !w-[150px] !h-[150px] m-auto !uppercase !bg-primary_color !text-5xl !text-white !center_div">
                                        {
                                            _.get(user, "[0].user", "").split(
                                                ""
                                            )[0]
                                        }
                                    </Avatar>
                                )}
                                <div
                                    onClick={() => {
                                        setOpen("pic");
                                    }}
                                    className="absolute -right-4 bg-white text-primary_color rounded-full w-[35px] h-[35px] text-xl cursor-pointer center_div !shadow-2xl bottom-0"
                                >
                                    <LiaUserEditSolid />
                                </div>
                            </div>
                        }
                    >
                        <Card.Meta
                            title={
                                <div className="!capitalize lg:w-full center_div pt-10">
                                    {_.get(user, "[0].user", "")}
                                </div>
                            }
                            description={
                                <div className="!lowercase lg:w-full center_div">
                                    {_.get(user, "[0].email", "")}
                                </div>
                            }
                        />
                        <div className="flex items-center justify-start !text-sm lg:pt-20 pt-10 lg:flex-row flex-col">
                            <div className="!flex !items-center !gap-x-2">
                                {" "}
                                <MdCall className="!text-primary_color" />{" "}
                                <div className="text-black  !text-sm">
                                    {_.get(user, "[0].phoneNumber", "")}
                                </div>
                            </div>
                            <Divider type="vertical" />
                            <div
                                className={`${
                                    _.get(user, "[0].alter_mobile_number", "")
                                        ? "!block"
                                        : "!hidden"
                                } !flex !items-center !gap-x-2  !text-sm`}
                            >
                                <MdCall className="!text-primary_color" />
                                <div className="text-black">
                                    {_.get(user, "[0].alter_mobile_number", "")}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
                <Drawer
                    title="Update Profile"
                    placement="right"
                    open={open}
                    onClose={() => {
                        setOpen("");
                    }}
                    width={500}
                >
                    <div className="lg:w-[500px] w-full min-h-[400px] bg-white rounded-2xl   relative pb-10 lg:px-10 px-2">
                        {open === "form" ? (
                            <div>
                                <Form
                                    className="pt-4"
                                    layout="vertical"
                                    form={form}
                                    onFinish={handleFinish}
                                >
                                    <Form.Item
                                        label="Name"
                                        name="user"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Enter your Name",
                                            },
                                        ]}
                                    >
                                        <Input
                                            placeholder="name"
                                            className="antd_input"
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        label="email"
                                        name="email"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Enter your email",
                                            },
                                            {
                                                type: "email",
                                                message: "Enter valid email",
                                            },
                                        ]}
                                    >
                                        <Input
                                            placeholder="email"
                                            className="antd_input "
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        label="Primary Mobile Number"
                                        name="phoneNumber"
                                        rules={[
                                            {
                                                validator: (_, value) =>
                                                    phoneNumberValidation(
                                                        "Enter your primary mobile number",
                                                        value
                                                    ),
                                            },
                                        ]}
                                        className="!w-full"
                                    >
                                        <PhoneInput
                                            placeholder="primary mobile number"
                                            defaultCountry={"in"}
                                            className="!w-full"
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        className="!w-full"
                                        label="Secondary Mobile Number"
                                        // name="alter_mobile_number"
                                        rules={[
                                            {
                                                validator: (_, value) =>
                                                    phoneNumberValidation(
                                                        "Enter your alternate mobile number",
                                                        value
                                                    ),
                                            },
                                        ]}
                                    >
                                        <PhoneInput
                                            className="!w-full"
                                            placeholder="alternate mobile number"
                                            defaultCountry={"in"}
                                        />
                                    </Form.Item>
                                    <div className="lg:w-[400px] center_div pt-4">
                                        <Button
                                            htmlType="submit"
                                            loading={loading}
                                            className="!border-none !bg-yellow_color !w-[400px] !h-[50px] !rounded-2xl"
                                        >
                                            <div className="text-[#EFEFEF] font-semibold">
                                                Save & proceed
                                            </div>
                                        </Button>
                                    </div>
                                </Form>
                            </div>
                        ) : (
                            <Spin
                                spinning={loading}
                                className="flex items-center justify-between"
                            >
                                <div className="flex gap-y-4 flex-col py-4">
                                    <Dragger
                                        showUploadList={false}
                                        onChange={uploadtocloud}
                                    >
                                        <p className="ant-upload-drag-icon">
                                            <CloudUploadOutlined className="!text-slate-400" />
                                        </p>
                                        <p className="ant-upload-text">
                                            upload from device
                                        </p>
                                        <p className="ant-upload-hint">
                                            Support for a single upload.
                                            Strictly prohibited from uploading
                                            company data or other banned files.
                                        </p>
                                    </Dragger>

                                    <Divider>
                                        <div className="!text-primary_color">
                                            or
                                        </div>
                                    </Divider>
                                    <div className="grid w-full  grid-cols-4 flex-wrap gap-x-2 gap-y-6 justify-center items-center">
                                        {[
                                            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
                                            12, 13, 14, 15, 16,
                                        ].map((res, index) => {
                                            return (
                                                <img
                                                    onClick={() => {
                                                        handleUpdateimage(res);
                                                    }}
                                                    key={index}
                                                    src={`/assets/logo/${res}.png`}
                                                    className="lg:w-[60px] m-auto lg:h-[60px] w-[50px] h-[50px] cursor-pointer hover:animate-pulse rounded-full"
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            </Spin>
                        )}
                    </div>
                </Drawer>
            </div>
            {contextHolder}
        </>
    );
};

export default MyProfile;
