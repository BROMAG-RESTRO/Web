import _ from "lodash";
import { useEffect, useState } from "react";
import {
    tokenVerification,getMyPoints
} from "../../helper/api/apiHelper";

import ProfileHeading from "../../components/ProfileHeading";
import BoxLoadingScreen from "../../components/BoxLoadingScreen";
import { notification } from "antd";

const BromagPoints = () => {
    const [pointsData, setPointsData] = useState([]); // <-- NEW
    const [loading, setLoading] = useState(false);
    const [timeFilter, setTimeFilter] = useState('today');
    const [user, setUser] = useState({});
    const getMonthOptions = () => {
        const months = [
            { value: 'today', label: 'Today' },
            { value: 'this_month', label: 'This Month' },
        ];
        
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        
        // Add previous months of current year
        for (let i = currentMonth - 1; i >= 0; i--) {
            const monthName = new Date(currentYear, i).toLocaleString('default', { month: 'long' });
            const monthValue = `${currentYear}-${String(i + 1).padStart(2, '0')}`;
            months.push({ value: monthValue, label: `${monthName} ${currentYear}` });
        }
        
        // Add months from previous year
        const previousYear = currentYear - 1;
        for (let i = 11; i >= 0; i--) {
            const monthName = new Date(previousYear, i).toLocaleString('default', { month: 'long' });
            const monthValue = `${previousYear}-${String(i + 1).padStart(2, '0')}`;
            months.push({ value: monthValue, label: `${monthName} ${previousYear}` });
        }
        
        return months;
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const userDetails = await tokenVerification();
            const userData = _.get(userDetails, "data.data[0]", {});
            setUser(userData);
        
            const bromagId = userData._id;
            if (!bromagId) throw new Error("User ID missing");
        
            const now = new Date();
            const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
            const pointsResponse = await getMyPoints({ bromag_id: bromagId, month: currentMonth });
        
            const rawData = _.get(pointsResponse, "data.data", []);
            const mappedData = rawData.map((item, index) => ({
                key: index + 1,
                sno: index + 1,
                orderValue: item.item_value,
                orderId: item.order_ref,
                points: item.points,
                date: item.created_at
            }));
        
            setPointsData(mappedData);
        } catch (err) {
            console.error(err);
            notification.error({ message: "Something went wrong fetching points" });
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = async (value) => {
        setTimeFilter(value);
        
        if (!user._id) return;
        
        try {
            setLoading(true);
            
            const now = new Date();
            const year = now.getFullYear();
            let month;

            switch (value) {
                case 'today':
                case 'this_month':
                    month = `${year}-${String(now.getMonth() + 1).padStart(2, '0')}`;
                    break;
                default:
                    // For specific months like "2024-01", "2024-02", etc.
                    month = value;
                    break;
            }

            const response = await getMyPoints({ bromag_id: user._id, month });
            const rawData = _.get(response, "data.data", []);
            
            const mappedData = rawData.map((item, index) => ({
                key: index + 1,
                sno: index + 1,
                orderValue: item.item_value,
                orderId: item.order_ref,
                points: item.points,
                date: item.created_at
            }));
            
            setPointsData(mappedData);
        } catch (err) {
            console.error(err);
            notification.error({ message: "Error fetching filtered points" });
            setPointsData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (localStorage.getItem("chgi5kjieaoyaiackaiw_bbcqgy4akacsaiq_bbcqgyyaq")) {
            fetchData();
        } else {
            // navigate("/"); // Uncomment if you have navigate function imported
        }
    }, []);

    // Calculate total points
    const totalPoints = pointsData.reduce((sum, item) => sum + item.points, 0);
    const progressPercentage = (totalPoints / 500) * 100;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const getMilestoneIcon = () => {
        if (totalPoints >= 500) {
            return "🏆";
        }
        return "🎁";
    };

    const getMilestoneText = () => {
        if (totalPoints >= 500) {
            return "Congratulations! You've reached the milestone!";
        }
        return `${500 - totalPoints} points to get your reward!`;
    };

    const getSelectedMonthLabel = () => {
        const option = getMonthOptions().find(opt => opt.value === timeFilter);
        return option ? option.label : 'Selected Month';
    };

    return (
        <>
            <div className="profile_head">
                <div className="w-full flex justify-between">
                    <ProfileHeading message={"Your Bromag Points"} />
                </div>

                {loading ? (
                    <BoxLoadingScreen loading={loading} />
                ) : _.isEmpty(pointsData) ? (
                    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                        <div className="text-gray-400 text-6xl mb-4">📊</div>
                        <div className="text-gray-600">
                            <div>You currently have no bromag points yet</div>
                            <div>Buy Something to get points.</div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 mt-11">
                        {/* Points Summary Card */}
                        <div 
                            className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg p-6 text-white shadow-lg"
                        >
                            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
                                <div className="w-full md:w-1/4 lg:w-1/5">
                                    <div className="text-center md:text-left">
                                        <div className="text-purple-200 text-sm mb-1">Total Points</div>
                                        <div className="flex items-center justify-center md:justify-start">
                                            <span className="text-2xl mr-2">⭐</span>
                                            <span className="text-3xl font-bold">{totalPoints}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full md:w-3/4 lg:w-4/5">
                                    <div className="w-full max-w-full">
                                        <div className="mb-2 flex justify-between items-center">
                                            <span className="text-purple-200">
                                                Progress to Milestone
                                            </span>
                                            <div 
                                                className="cursor-help text-xl"
                                                title={getMilestoneText()}
                                            >
                                                {getMilestoneIcon()}
                                            </div>
                                        </div>
                                        {/* Custom Progress Bar */}
                                        <div className="w-full bg-white bg-opacity-30 rounded-full h-4 relative overflow-hidden">
                                            <div 
                                                className="h-full bg-gradient-to-r from-yellow-400 to-green-400 rounded-full transition-all duration-500 ease-out"
                                                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                                            ></div>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-white text-xs font-bold">
                                                    {totalPoints}/500
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-2 text-center">
                                            <span 
                                                className="text-purple-100 text-xs cursor-help"
                                                title="Earn 500 points to unlock exclusive rewards and special discounts!"
                                            >
                                                🎁 Milestone Reward at 500 points
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Points History Table */}
                        <div className="bg-white rounded-lg shadow-lg">
                            <div className="flex justify-between align-middle p-4 border-b border-gray-200">
                                <div className="flex items-center space-x-2">
                                    <span className="text-blue-500 text-xl">⭐</span>
                                    <span className="text-lg font-semibold">Points History</span>
                                </div>
                                <div>
                                <select
    value={timeFilter}
    onChange={(e) => handleFilterChange(e.target.value)}
    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
>
    {getMonthOptions().map(month => (
        <option key={month.value} value={month.value}>
            {month.label}
        </option>
    ))}
</select>
                                </div>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                S.No
                                            </th>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Order Value
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Order ID
                                            </th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Points Earned
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {pointsData.map((item) => (
                                            <tr key={item.key} className="hover:bg-gray-50">
                                                <td className="px-4 py-4 text-center text-sm text-gray-900">
                                                    {item.sno}
                                                </td>
                                                <td className="px-4 py-4 text-right text-sm text-gray-900">
                                                    ₹{item.orderValue.toLocaleString()}
                                                </td>
                                                <td className="px-4 py-4 text-sm">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        {item.orderId}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-center text-sm">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                                        <span className="mr-1">⭐</span> {item.points}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-500">
                                                    {formatDate(item.date)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Pagination */}
                            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                                <div className="flex justify-between items-center">
                                    <div className="text-sm text-gray-700">
                                        Showing 1-5 of 5 orders
                                    </div>
                                    <div className="flex space-x-1">
                                        <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
                                            1
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Milestone Information Card */}
                        <div 
                            className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-dashed border-yellow-300 rounded-lg p-6"
                        >
                            <div className="text-center">
                                <div className="flex justify-center mb-3">
                                    <span className="text-4xl">🎁</span>
                                </div>
                                <h3 className="text-yellow-800 text-xl font-bold mb-2">
                                    Earn More Points & Unlock Rewards!
                                </h3>
                                <p className="text-yellow-700 mb-4">
                                    Every ₹10 spent = 1 Bromag Point. Reach milestones to unlock exclusive benefits!
                                </p>
                                <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 text-sm">
                                    <div className="text-center">
                                        <div className="text-yellow-800 font-bold text-lg">500 Points</div>
                                        <div className="text-yellow-600">10% Off Coupon</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-yellow-800 font-bold text-lg">1000 Points</div>
                                        <div className="text-yellow-600">Free Shipping</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-yellow-800 font-bold text-lg">1500 Points</div>
                                        <div className="text-yellow-600">Exclusive Access</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default BromagPoints;