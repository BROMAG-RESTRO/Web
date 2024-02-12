import axios from "axios";

let base_url = import.meta.env.VITE_base_url;
axios.defaults.headers.common["aizasycoxsewxv2t64dxca-wl8n8qfq0gzux1as"] =
  localStorage.getItem("chgi5kjieaoyaiackaiw_bbcqgy4akacsaiq_bbcqgyyaq");

// signup
export const createUserSignUp = async (formData) => {
  return await axios.post(`${base_url}/signup`, formData);
};

export const createFCMT = async (userId, fcmToken) => {
  return await axios.post(
    `${base_url}/sendFCMToken?userId=${userId}&fcmToken=${fcmToken}`
  );
};

export const sendOTP = async (number) => {
  return await axios.get(`${base_url}/sendOTP/${number}`);
};
export const verifyOTP = async (number,otp) => {
  return await axios.post(`${base_url}/verifyOTP`, {
    number: number,
    otp: otp
  });
};




// login
export const makeUserToken = async (formData) => {
  return await axios.post(`${base_url}/make_user_auth`, formData);
};

// check token
export const tokenVerification = async () => {
  return await axios.get(`${base_url}/check_header_status`);
};

// logout
export const logoutCurrentUser = async () => {
  return await axios.post(`${base_url}/make_logout_user`);
};

// All banners
export const gettAllBanners = async () => {
  return await axios.get(`${base_url}/getbanner`);
};

export const getSpecificBanner = async (id) => {
  return await axios.get(`${base_url}/get_specific_banner/${id}`);
};

// Advertisement banner
export const updateAdvertisementBanner = async (formData) => {
  return await axios.put(`${base_url}/update_add_banner_view_count`, formData);
};

// online orders
export const getAllCusinessData = async (search) => {
  return await axios.get(`${base_url}/get_all_cusiness_data/${search}`);
};

export const getAllSearchCusinessData = async (search) => {
  return await axios.get(`${base_url}/get_search_cusiness_data/${search}`);
};

export const getAllCusinessFilter = async (id) => {
  if (!id) {
    id = "empty";
  }
  return await axios.get(`${base_url}/get_all_cusiness_filter/${id}`);
};

export const getFilteredProducts = async (id) => {
  return await axios.get(`${base_url}/get_filtered_products/${id}`);
};

export const addOnlineOrder = async (formData) => {
  return await axios.post(`${base_url}/add_online_order`, formData);
};

// cart
export const addToCart = async (formData) => {
  return await axios.post(`${base_url}/add_to_cart`, formData);
};

export const getCurrentUserCarts = async (id) => {
  return await axios.get(`${base_url}/get_current_user_carts/${id}`);
};

export const getCurrentUserCartProducts = async (id) => {
  return await axios.get(`${base_url}/get_current_user_cart_products/${id}`);
};

export const removeFromCart = async (id) => {
  return await axios.delete(`${base_url}/remove_from_cart/${id}`);
};

export const incrementCartQuantity = async (id) => {
  return await axios.put(`${base_url}/increment_cart_qty/${id}`);
};

export const decrementCartQuantity = async (id) => {
  return await axios.put(`${base_url}/decrement_cart_qty/${id}`);
};

export const removeSoloFromCart = async (id) => {
  return await axios.delete(`${base_url}/remove_solo_from_cart/${id}`);
};

// Tables
export const getAllTables = async () => {
  return await axios.get(`${base_url}/get_all_tables`);
};

export const bookMyTables = async (formData) => {
  return await axios.post(`${base_url}/book_my_table`, formData);
};

export const getAllBookedTables = async () => {
  return await axios.get(`${base_url}/get_all_booked_tables`);
};

export const cancelBooking = async (formData) => {
  return await axios.put(`${base_url}/cancel_booking`, formData);
};

export const checkInBooking = async (formData) => {
  return await axios.put(`${base_url}/checkin_booking`, formData);
};

// deliver address
export const getDeliveryAddress = async () => {
  return await axios.get(`${base_url}/get_delivery_address`);
};

export const addDeliveryAddress = async (formData) => {
  return await axios.post(`${base_url}/add_delivery_address`, formData);
};

export const deleteDeliveryAddress = async (id) => {
  return await axios.delete(`${base_url}/delete_delivery_address/${id}`);
};

// takeaway
export const addTakeAwayOrder = async (formData) => {
  return await axios.post(`${base_url}/add_takeaway_order`, formData);
};

// dining
export const addDiningOrder = async (formData) => {
  return await axios.post(`${base_url}/add_dining_order`, formData);
};

export const getDiningOrders = async () => {
  return await axios.get(`${base_url}/get_dining_orders`);
};

export const getFilteredDiningOrders = async (id) => {
  return await axios.get(`${base_url}/get_filtered_dining_orders/${id}`);
};

export const updateBoockings = async (formData) => {
  return await axios.put(`${base_url}/update_boockings`, formData);
};

// Profile
export const getMyOnlineOrder = async () => {

 
  return await axios.get(`${base_url}/get_my_online_order`);
};

export const getMyTakeAwayOrder = async () => {
  return await axios.get(`${base_url}/get_my_profile_takeaway_order`);
};

export const getMyDeliveryAddress = async () => {
  return await axios.get(`${base_url}/get_my_profile_delivery_address`);
};

export const getMyProfileDining = async () => {
  return await axios.get(`${base_url}/get_my_profile_dining_details`);
};

export const getMyCallForOrder = async () => {
  return await axios.get(`${base_url}/get_my_call_for_order`);
};

export const updateMyPic = async (formData) => {
  return await axios.put(`${base_url}/update_my_pic`, formData);
};

// feedback
export const addMyfeedback = async (formData) => {
  return await axios.post(`${base_url}/add_my_feedback`, formData);
};

export const getMyfeedback = async () => {
  return await axios.post(`${base_url}/get_my_feedback`);
};

export const getAllfeedback = async () => {
  return await axios.get(`${base_url}/get_all_feedback`);
};

export const deleteMyFeedBack = async (id) => {
  return await axios.delete(`${base_url}/delete_my_feedback/${id}`);
};

// contest
export const checkScrachCardDetails = async (formData) => {
  return await axios.post(`${base_url}/check_scrach_details`, formData);
};

export const checkMyContestDetails = async () => {
  return await axios.get(`${base_url}/check_my_contest_details`);
};

// videos
export const getAllVideos = async () => {
  return await axios.get(`${base_url}/getvideo`);
};

// upload
export const moveToCloud = async (formData) => {
  return await axios.post(`${base_url}/move_to_cloud`, formData);
};

export const updateProfile = async (formData) => {
  return await axios.put(`${base_url}/update_my_profile`, formData);
};

// product details
export const getProductDetails = async (id) => {
  return await axios.get(`${base_url}/get_product_details/${id}`);
};

export const addToCartFromProductDetails = async (formData) => {
  return await axios.post(
    `${base_url}/addtocart_fromproduct_deatils`,
    formData
  );
};

// cancel order
export const cancelMyOrder = async (id, formData) => {
  return await axios.put(`${base_url}/cancel_my_order/${id}`, formData);
};

// cancel order
export const cancelMyCallOrder = async (id, formData) => {
  return await axios.put(`${base_url}/cancel_my_call_order/${id}`, formData);
};

// get footer

export const getFooterData = async () => {
  try {
    const response = await axios.get(`${base_url}/get_footer`);
    return response.data;
  } catch (error) {
    console.error("Error fetching footer data:", error);
    throw error;
  }
};

// get footer

export const getStatus = async () => {
  try {
    const response = await axios.get(`${base_url}/get_status`);
    return response.data;
  } catch (error) {
    console.error("Error fetching footer data:", error);
    throw error;
  }
};
