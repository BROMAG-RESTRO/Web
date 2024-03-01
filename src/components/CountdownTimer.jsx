/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Tag } from "antd";
import moment from "moment";
import React, { useState, useEffect } from "react";
import { TbClock } from "react-icons/tb";

const CountdownTimer = ({ endDate, setDummy, dummy, title }) => {
  const calculateTimeRemaining = () => {
    const now = new Date().getTime();
    const difference = moment(endDate, "YYYY-MM-DD HH:mm:ss") - now;

    if (difference <= 0) {
      let extra = now - moment(endDate, "YYYY-MM-DD HH:mm:ss");
      const days = Math.floor(extra / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (extra % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((extra % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((extra % (1000 * 60)) / 1000);

      setExtraTime({ days, hours, minutes, seconds: Math.round(seconds % 60) });
      clearInterval(timerRef.current);
      setRemainingTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });

      setDummy(!dummy);
    } else {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setRemainingTime({ days, hours, minutes, seconds });
    }
  };

  const [remainingTime, setRemainingTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [extraTime, setExtraTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const timerRef = React.useRef();

  useEffect(() => {
    timerRef.current = setInterval(() => {
      calculateTimeRemaining();
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    // Check if the initial countdown timer has reached zero
    if (
      remainingTime.days === 0 &&
      remainingTime.hours === 0 &&
      remainingTime.minutes === 0 &&
      remainingTime.seconds === 0
    ) {
      // Additional logic for the increasing timer
      const increasingTimer = setInterval(() => {
        setExtraTime((prevTime) => ({
          days: prevTime.days,
          hours: prevTime.hours,
          minutes: prevTime.minutes,
          seconds: prevTime.seconds + 1,
        }));
      }, 1000);

      // Cleanup the increasing timer when needed
      return () => clearInterval(increasingTimer);
    }
  }, [extraTime, remainingTime]);

  console.log({ extraTime, remainingTime });

  return (
    <div className="text-red-500 !text-[12px] flex items-center ">
      {remainingTime.days === 0 &&
      remainingTime.hours === 0 &&
      remainingTime.minutes === 0 &&
      remainingTime.seconds === 0 ? (
        <>
          <TbClock /> &nbsp;
          {extraTime.hours ? extraTime.hours + " :" : ""} {extraTime.minutes} :{" "}
          {extraTime.seconds % 60} &nbsp;{" "}
          <span className="text-slate-500">Your food needs extra time</span>
        </>
      ) : (
        <>
          <TbClock /> &nbsp;
          {remainingTime.minutes} : {remainingTime.seconds} &nbsp;{" "}
          <span className="text-slate-500">{title}</span>
        </>
      )}
    </div>
  );
};

// const CountdownTimer = ({ startDate, endDate, title }) => {
//   console.log({ startDate, endDate, title });
//   const [timerExpired, setTimerExpired] = useState(false);
//   const [timeRemaining, setTimeRemaining] = useState({
//     days: 0,
//     hours: 0,
//     minutes: 0,
//     seconds: 0,
//   });

//   useEffect(() => {
//     function calculateTimeRemaining() {
//       const now = moment(startDate, "YYYY-MM-DD HH:mm:ss");
//       const difference = moment(endDate, "YYYY-MM-DD HH:mm:ss").diff(now);

//       if (difference <= 0) {
//         setTimerExpired(true);
//         return { days: 0, hours: 0, minutes: 0, seconds: 0 };
//       }

//       const duration = moment.duration(difference);
//       const days = Math.floor(duration.asDays());
//       const hours = duration.hours();
//       const minutes = duration.minutes();
//       const seconds = duration.seconds();

//       return { days, hours, minutes, seconds };
//     }

//     const timerInterval = setInterval(() => {
//       setTimeRemaining(calculateTimeRemaining());
//     }, 1000);

//     // Initialize the time remaining after the initial render
//     setTimeRemaining(calculateTimeRemaining());

//     return () => clearInterval(timerInterval);
//   }, [endDate]);

//   return (
//     <div>
//       {!timerExpired ? (
//         <p>Timer has expired!</p>
//       ) : (
//         <p>
//           {title}
//           {`${timeRemaining.days}d ${timeRemaining.hours}h ${timeRemaining.minutes}m ${timeRemaining.seconds}s`}
//         </p>
//       )}
//     </div>
//   );
// };

export default CountdownTimer;
