/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Tag } from "antd";
import React, { useState, useEffect } from "react";
import { TbClock } from "react-icons/tb";

const CountdownTimer = ({ endDate, setDummy, dummy, title }) => {
  const calculateTimeRemaining = () => {
    const now = new Date().getTime();
    const difference = endDate - now;

    if (difference <= 0) {
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

  const timerRef = React.useRef();

  useEffect(() => {
    timerRef.current = setInterval(() => {
      calculateTimeRemaining();
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <div className="text-red-500 !text-[12px] flex items-center">
      <TbClock /> &nbsp;
      {remainingTime.minutes} : {remainingTime.seconds} &nbsp;{" "}
      <span className="text-slate-500">{title}</span>{" "}
    </div>
  );
};

export default CountdownTimer;
