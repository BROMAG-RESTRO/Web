import { useState, useEffect } from "react";
import _ from "lodash";
import ProfileHeading from "../../components/ProfileHeading";
import BoxLoadingScreen from "../../components/BoxLoadingScreen";
import { tokenVerification, WinningOffers, FetchCouponDetails } from "../../helper/api/apiHelper";
import { notification, Modal } from "antd";
import { CheckCircleTwoTone } from "@ant-design/icons";

const MyWinningOffers = () => {
    const [loading, setLoading] = useState(false);
    const [offersData, setOffersData] = useState([]);
    const [user, setUser] = useState({});
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const userDetails = await tokenVerification();
            const userData = _.get(userDetails, "data.data[0]", {});
            setUser(userData);

            const bromagId = userData._id;
            if (!bromagId) throw new Error("User ID missing");

            const response = await WinningOffers({
                bromag_id: bromagId,
            });

            const offers = _.get(response, "data.data", []);
            setOffersData(offers);
        } catch (err) {
            console.error(err);
            notification.error({ message: "Something went wrong fetching offers" });
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = async (promotionId) => {
        try {
            const response = await FetchCouponDetails({ promotionId });
            const offerDetails = _.get(response, "data.data", {});
            setSelectedOffer(offerDetails);
            setIsModalOpen(true);
        } catch (err) {
            console.error(err);
            notification.error({ message: "Failed to fetch offer details" });
        }
    };

    useEffect(() => {
        if (localStorage.getItem("chgi5kjieaoyaiackaiw_bbcqgy4akacsaiq_bbcqgyyaq")) {
            fetchData();
        } else {
            navigate("/");
        }
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="profile_head p-4">
            <div className="w-full flex justify-between">
                <ProfileHeading message={"Your Winning Offers"} />
            </div>

            {loading ? (
                <BoxLoadingScreen loading={loading} />
            ) : offersData.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                    <div className="text-gray-400 text-6xl mb-4">🎫</div>
                    <div className="text-gray-600">
                        <div>You currently have no winning offers</div>
                        <div>Make a purchase to win exciting offers.</div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
                    {offersData.map((offer) => (
                        <div key={offer.id} className="p-6 rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow">
                            <div className="bg-gray-100 p-3 rounded-md mb-3">
                                <div className="text-sm text-gray-500 mb-1">Coupon Code:</div>
                                <div className="font-mono font-semibold text-gray-800">{offer.coupon_code}</div>
                            </div>
                            <div className="text-sm text-gray-600 mb-3">
                                Valid till: {formatDate(offer.promotion.valid_till)}
                            </div>
                            <button
                                onClick={() => handleViewDetails(offer.promotion.id)}
                                className="w-full bg-primary_color text-white py-2 px-4 rounded hover:bg-orange-600 transition-colors"
                            >
                                View Details
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <Modal
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                centered
                closeIcon={false}
                className="custom-modal"
            >
                <div className="bg-gradient-to-br from-orange-100 via-yellow-200 to-orange-50 rounded-2xl text-center p-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-yellow-400 animate-pulse"></div>

                    <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: "50px" }} />
                    <h2 className="text-2xl font-bold text-orange-700 mt-4 mb-2">Offer Details</h2>
                    
                    {selectedOffer && (
                        <>
                            <div className="text-xl font-bold text-gray-800 mb-4">{selectedOffer.title}</div>
                            <div className="bg-white p-4 rounded-lg mb-4">
                                <p className="text-gray-700">{selectedOffer.short_description}</p>
                            </div>
                            
                            <div className="bg-white p-4 rounded-lg mb-4">
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">Terms & Conditions</h3>
                                <p className="text-gray-600">{selectedOffer.terms}</p>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-6">
                                Valid till: {formatDate(selectedOffer.valid_till)}
                            </p>

                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-full transition"
                            >
                                Close
                            </button>
                        </>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default MyWinningOffers;