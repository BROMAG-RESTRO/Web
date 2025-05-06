// import dayjs from "dayjs";

import _ from "lodash";

// phone number
export const phoneNumberValidation = (message, value, length = 13) => {
  if (!value) {
    return Promise.reject(message);
  } else if (_.get(value, "length", "") < length) {
    return Promise.reject("your phone number to short");
  } else if (_.get(value, "length", "") > length) {
    return Promise.reject("your phone number to long");
  } else {
    return Promise.resolve();
  }
};

//  > 0
export const minimumCountValidation = (message, value) => {
  if (!value) {
    return Promise.reject(message);
  } else if (value <= 0) {
    return Promise.reject("Please include at least one guest.");
  } else {
    return Promise.resolve();
  }
};

export const disabledDate = (date) => {
  try {
    const resultDate = new Date(date);
    resultDate.setMinutes(resultDate.getMinutes() + 5);
    return resultDate;
  } catch (err) {
    /* empty */
  }
};

export const tenMinDisabledDates = (date) => {
  try {
    const resultDate = new Date(date);
    resultDate.setMinutes(resultDate.getMinutes() + 10);
    return resultDate;
  } catch (err) {
    /* empty */
  }
};

export const twantyMinDisabledDates = (date) => {
  try {
    const resultDate = new Date(date);
    resultDate.setMinutes(resultDate.getMinutes() + 20);
    return resultDate;
  } catch (err) {
    /* empty */
  }
};

export const thirtyMinDisabledDates = (date) => {
  try {
    const resultDate = new Date(date);
    resultDate.setMinutes(resultDate.getMinutes() + 30);
    return resultDate;
  } catch (err) {
    /* empty */
  }
};

export const calculateEndTime = (timePicked) => {
  const presetTimes = {
    600: 10 * 60, // 10 minutes in seconds
    1200: 20 * 60, // 20 minutes in seconds
    1800: 30 * 60, // 30 minutes in seconds
  };

  const totalSeconds = presetTimes[timePicked] || 0;
  const endDate = new Date();
  endDate.setSeconds(endDate.getSeconds() + totalSeconds);
  return endDate;
};

// const range = (start, end) => {
//   const result = [];
//   for (let i = start; i < end; i++) {
//     result.push(i);
//   }
//   return result;
// };

// export const disabledDate = (current) => {
//   // Can not select days before today and today
//   return current && current < dayjs().endOf("day");
// };

// export const disabledDateTime = () => ({
//   disabledHours: () => range(0, 24).splice(4, 20),
//   disabledMinutes: () => range(30, 60),
//   disabledSeconds: () => [55, 56],
// });
