export const couponCheck = ({ coupon, amount, type }) => {
  const orderType = type?.includes("online")
    ? "online"
    : type?.includes("take")
    ? "takeaway"
    : "null";
  console.log({ coupon, amount, orderType });
  if (coupon?.orderType?.includes(orderType)) {
    const validPurchase = coupon.min_purchase
      ? amount >= coupon.min_purchase
      : true;
    console.log({ coupon, amount, orderType, validPurchase });
    if (validPurchase) {
      return {
        valid: true,
        msg: "Coupon applied",
      };
    } else {
      return {
        valid: false,
        msg: `Need Minimum purchase of Rs. ${coupon.min_purchase} `,
      };
    }
  } else {
    return {
      valid: false,
      msg: "Coupon is not applied",
    };
  }
};
