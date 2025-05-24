import { useState, useEffect, useRef } from "react";
import _ from "lodash";
import { Modal } from "antd";
import { CheckCircleTwoTone, ClockCircleOutlined } from "@ant-design/icons";
import ProfileHeading from "../../components/ProfileHeading";
import BoxLoadingScreen from "../../components/BoxLoadingScreen";
import { tokenVerification, getScratch, ProcessScratch } from "../../helper/api/apiHelper";
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
            
            const mappedScratchCards = rawData.map((item, index) => ({
                id: index + 1,
                order_ref: item.order_ref,
                scratch_code: item.scratch_code,
                created_at: item.created_at,
                status: item.status,
                isScratched: false
            }));
        
            setScratchCardsData(mappedScratchCards);
        } catch (err) {
            console.error(err);
            notification.error({ message: "Something went wrong fetching scratch cards" });
        } finally {
            setLoading(false);
        }
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

    const handleScratch = (card) => {
        if (card.status === 0) {
            // Update the card status to scratched in the local state
            const updatedCards = scratchCardsData.map(c => 
                c.id === card.id ? { ...c, status: 1, isScratched: true } : c
            );
            setScratchCardsData(updatedCards);
            
            // Show the modal with scratch code
            setSelectedCard({...card, status: 1});
            setOpenModal(true);
        }
    };

    const ScratchCard = ({ card, onScratch }) => {
        const canvasRef = useRef(null);
        const [isScratching, setIsScratching] = useState(false);
        const [scratchPercentage, setScratchPercentage] = useState(0);
        const [isRevealed, setIsRevealed] = useState(false);

        useEffect(() => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            const rect = canvas.getBoundingClientRect();
            
            // Set canvas size
            canvas.width = rect.width * window.devicePixelRatio;
            canvas.height = rect.height * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
            
            // Create scratch overlay
            const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
            gradient.addColorStop(0, '#C0C0C0');
            gradient.addColorStop(0.5, '#E6E6FA');
            gradient.addColorStop(1, '#D3D3D3');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, rect.width, rect.height);
            
            // Add scratch texture
            ctx.fillStyle = '#A0A0A0';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('🎯 SCRATCH HERE', rect.width / 2, rect.height / 2 - 10);
            ctx.fillText('TO REVEAL PRIZE!', rect.width / 2, rect.height / 2 + 15);
        }, []);

        const getMousePos = (e) => {
            const canvas = canvasRef.current;
            const rect = canvas.getBoundingClientRect();
            return {
                x: (e.clientX || e.touches?.[0]?.clientX) - rect.left,
                y: (e.clientY || e.touches?.[0]?.clientY) - rect.top
            };
        };

        const scratch = async (e) => {
            if (!isScratching) return;
            
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const pos = getMousePos(e);
            
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 20, 0, 2 * Math.PI);
            ctx.fill();
            
            // Calculate scratch percentage
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;
            let transparentPixels = 0;
            
            for (let i = 0; i < pixels.length; i += 4) {
                if (pixels[i + 3] === 0) transparentPixels++;
            }
            
            const percentage = (transparentPixels / (pixels.length / 4)) * 100;
            setScratchPercentage(percentage);
            
            if (percentage > 50 && !isRevealed) {
                setIsRevealed(true);
                try {
                    // Call the ProcessScratch API
                    await ProcessScratch({ Code: card.scratch_code });
                    setTimeout(() => {
                       
                        onScratch(card);
                    }, 1000);
                } catch (error) {
                    console.error('Error processing scratch card:', error);
                    notification.error({ 
                        message: 'Error', 
                        description: 'Failed to process scratch card. Please try again.'
                    });
                }
            }
        };

        const startScratch = (e) => {
            setIsScratching(true);
            scratch(e);
        };

        const stopScratch = () => {
            setIsScratching(false);
        };

        if (card.status !== 0) {
            return renderStaticCard(card);
        }

        return (
            <div className="relative p-10 rounded-2xl shadow-lg border transition-all duration-300 bg-gradient-to-br from-yellow-200 to-orange-300 hover:scale-105 overflow-hidden">
                {/* Background content */}
                <div className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-green-200 p-4">
                    <div className="text-4xl mb-2">🎉</div>
                    <div className="font-bold text-lg mb-2 text-center">Scratch Code:</div>
                    <div className="text-xl font-mono bg-white p-2 rounded shadow">{card.scratch_code}</div>
                    <div className="mt-2 text-sm text-gray-600">Order: {card.order_ref}</div>
                </div>

                {/* Scratch overlay */}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full cursor-pointer rounded-2xl"
                    onMouseDown={startScratch}
                    onMouseMove={scratch}
                    onMouseUp={stopScratch}
                    onMouseLeave={stopScratch}
                    onTouchStart={startScratch}
                    onTouchMove={scratch}
                    onTouchEnd={stopScratch}
                    style={{ 
                        opacity: isRevealed ? 0 : 1,
                        transition: 'opacity 1s ease-out'
                    }}
                />

                {/* Progress indicator */}
                {scratchPercentage > 0 && scratchPercentage < 50 && (
                    <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 text-xs font-bold shadow">
                        {Math.round(scratchPercentage)}%
                    </div>
                )}
            </div>
        );
    };

    const renderStaticCard = (card) => {
        switch(card.status) {
            case 1: // Scratched but not used
                return (
                    <div className="p-10 rounded-2xl shadow-lg border bg-gradient-to-br from-green-100 to-green-200">
                        <div className="text-center">
                            <div className="text-2xl mb-4">🎉</div>
                            <div className="font-bold text-lg mb-2">Scratch Code:</div>
                            <div className="text-xl font-mono bg-white p-2 rounded">{card.scratch_code}</div>
                            <div className="mt-4 text-sm text-gray-600">Order: {card.order_ref}</div>
                        </div>
                    </div>
                );
            case 2: // Used
                return (
                    <div className="p-10 rounded-2xl shadow-lg border bg-gradient-to-br from-gray-100 to-gray-200 opacity-60">
                        <div className="text-center">
                            <div className="text-2xl mb-4">✅</div>
                            <div className="font-bold text-lg mb-2">Claimed</div>
                            <div className="text-xl font-mono bg-white p-2 rounded">{card.scratch_code}</div>
                            <div className="mt-4 text-sm text-gray-600">Order: {card.order_ref}</div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
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
                    {scratchCardsData.map((card) => (
                        <ScratchCard key={card.id} card={card} onScratch={handleScratch} />
                    ))}
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
                    <p className="text-lg text-gray-700 mb-2">Your Scratch Code:</p>
                    <div className="text-xl font-mono bg-white p-3 rounded-lg mb-4">{selectedCard?.scratch_code}</div>
                    <p className="text-sm text-gray-600 mb-6">Order: {selectedCard?.order_ref}</p>

                    <button
                        onClick={handleClose}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-full transition"
                    >
                        Close
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default MyScratch;