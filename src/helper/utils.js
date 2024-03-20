import { store } from "../redux/store";

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

export function calculateFare(distance, charges) {
  console.log({ chargesData: charges });

  if (!charges) {
    return 0;
  }
  let deliveryCharges = charges;

  let {
    min_km = 0,
    max_km = 0,
    min_price = 0,
    max_price = 0,
    extra_charges = 0,
  } = deliveryCharges;
  console.log({ min_km, max_km, min_price, max_price, extra_charges });
  if (distance <= min_km) {
    return min_price || 0;
  } else if (distance <= max_km) {
    return min_price + extra_charges * (distance - min_km) || 0;
  } else {
    return max_price || 0;
  }
}

export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180; // convert degrees to radians
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
}
