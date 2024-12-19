import React, { useState, useEffect } from "react";

const CountdownTimer = ({ initialTime }) => {
    const [remainingTime, setRemainingTime] = useState(initialTime);

    useEffect(() => {
        if (remainingTime <= 0) return;

        const timer = setInterval(() => {
            setRemainingTime((prevTime) => prevTime - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [remainingTime]);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${String(seconds).padStart(2, "0")}`;
    };

    return (
        <h3 className="text-lg mb-2 font-bold">
            {remainingTime > 0 ? formatTime(remainingTime) : "Time's up!"}
        </h3>
    );
};

export default CountdownTimer;
