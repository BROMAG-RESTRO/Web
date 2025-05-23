import { useState, useEffect } from "react";
import _ from "lodash";
import { Modal } from "antd";
import { CheckCircleTwoTone, ClockCircleOutlined } from "@ant-design/icons";
import ProfileHeading from "../../components/ProfileHeading";
import BoxLoadingScreen from "../../components/BoxLoadingScreen";
import { tokenVerification, getScratch } from "../../helper/api/apiHelper";
import { notification } from "antd";

const MyScratch = () => {
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [scratchCardsData, setScratchCardsData] = useState([]);
    const [user, setUser] = useState({});
    const [currentTime, setCurrentTime] = useState(new Date());

    // Update current time every minute
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Update every minute

        return () => clearInterval(timer);
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const userDetails = await tokenVerification();
            const userData = _.get(userDetails, "data.data[0]", {});
            setUser(userData);
        
            const bromagId = userData._id;
            if (!bromagId) throw new Error("User ID missing");
        
            const scratchResponse = await getScratch({ bromag_id: bromagId });
            const rawData = _.get(scratchResponse, "data.data", []);
            
            // Map the API data to include scratch card messages and timing logic
            const mappedScratchCards = rawData.map((item, index) => ({
                id: index + 1,
                order_ref: item.order_ref,
                created_at: item.created_at,
                due_at: item.due_at,
                status: item.status,
                message: getScratchMessage(index), // You can customize this based on your logic
                isUnlocked: new Date() >= new Date(item.due_at)
            }));
        
            setScratchCardsData(mappedScratchCards);
        } catch (err) {
            console.error(err);
            notification.error({ message: "Something went wrong fetching scratch cards" });
        } finally {
            setLoading(false);
        }
    };

    const getScratchMessage = (index) => {
        const messages = [
            "🎉 You won ₹50 OFF on your next order!",
            "🎁 You have been selected for a surprise gift!",
            "🚚 Free delivery unlocked for 3 upcoming orders!",
            "💰 Cashback of ₹100 credited to your wallet!",
            "🏆 You've unlocked premium membership benefits!",
            "🎊 Special discount code: LUCKY25 activated!"
        ];
        return messages[index % messages.length];
    };

    const formatTimeRemaining = (dueDate) => {
        const now = currentTime;
        const due = new Date(dueDate);
        const diffMs = due - now;
        
        if (diffMs <= 0) return null;
        
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        
        if (days > 0) {
            return `${days}d ${hours}h ${minutes}m`;
        } else if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else {
            return `${minutes}m`;
        }
    };
    
    useEffect(() => {
        if (
            localStorage.getItem("chgi5kjieaoyaiackaiw_bbcqgy4akacsaiq_bbcqgyyaq")
        ) {
            fetchData();
        } else {
            navigate("/");
        }
    }, []);

    const handleCardClick = (card) => {
        const now = new Date();
        const dueDate = new Date(card.due_at);
        
        if (now < dueDate) {
            const timeRemaining = formatTimeRemaining(card.due_at);
            notification.warning({
                message: "Scratch Card Locked",
                description: `This scratch card will unlock in ${timeRemaining}`,
                duration: 3
            });
            return;
        }
        
        setSelectedCard(card);
        setOpenModal(true);
    };

    const handleClose = () => {
        setOpenModal(false);
        setSelectedCard(null);
    };

    return (
        <div className="profile_head p-4">
            <div className="w-full flex justify-between">
                <ProfileHeading message={"Your Scratches"} />
            </div>

            {loading ? (
                <BoxLoadingScreen loading={loading} />
            ) : scratchCardsData.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                    <div className="text-gray-400 text-6xl mb-4">📊</div>
                    <div className="text-gray-600">
                        <div>You currently have no Scratch cards yet</div>
                        <div>Buy Something to get scratch cards.</div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
                    {scratchCardsData.map((card) => {
                        const isUnlocked = new Date() >= new Date(card.due_at);
                        const timeRemaining = formatTimeRemaining(card.due_at);
                        
                        return (
                            <div
                                key={card.id}
                                onClick={() => handleCardClick(card)}
                                className={`cursor-pointer p-10 rounded-2xl shadow-lg border relative transition-all duration-300 ${
                                    isUnlocked 
                                        ? 'border-orange-400 bg-gradient-to-br from-yellow-200 to-orange-300 hover:scale-105' 
                                        : 'border-gray-300 bg-gradient-to-br from-gray-100 to-gray-200 cursor-not-allowed opacity-75'
                                }`}
                            >
                                <div className={`absolute inset-0 rounded-2xl z-10 flex flex-col items-center justify-center text-xl font-bold tracking-wide ${
                                    isUnlocked 
                                        ? 'bg-gray-300 opacity-60 text-gray-600' 
                                        : 'bg-gray-400 opacity-80 text-gray-700'
                                }`}>
                                    {isUnlocked ? (
                                        <>
                                            <div className="text-2xl mb-2">🎯</div>
                                            <div>Scratch Me</div>
                                        </>
                                    ) : (
                                        <>
                                            <ClockCircleOutlined className="text-3xl mb-2" />
                                            <div className="text-sm text-center">
                                                <div>Unlocks in</div>
                                                <div className="font-mono text-lg mt-1">{timeRemaining}</div>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="opacity-0">
                                    Order: {card.order_ref}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <Modal
                open={openModal}
                onCancel={handleClose}
                footer={null}
                centered
                closeIcon={false}
                className="custom-modal"
            >
                <div className="bg-gradient-to-br from-orange-100 via-yellow-200 to-orange-50 rounded-2xl text-center p-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-yellow-400 animate-pulse"></div>

                    <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: "50px" }} />
                    <h2 className="text-2xl font-bold text-orange-700 mt-4 mb-2">Congratulations!</h2>
                    <p className="text-lg text-gray-700 mb-6">{selectedCard?.message}</p>

                    <button
                        onClick={handleClose}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-full transition"
                    >
                        Close & Redeem
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default MyScratch;