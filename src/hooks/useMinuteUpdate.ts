import { useState, useEffect } from "react";

const useMinuteUpdate = () => {
  const [time, setTime] = useState(new Date().toISOString());

  useEffect(() => {
    const updateAtNextMinute = () => {
      const now = new Date();
      const delay = (60 - now.getSeconds()) * 1000; // Time until next 0 second

      setTimeout(() => {
        setTime(new Date().toISOString());

        // Set interval to update every minute at 0s
        const interval = setInterval(() => {
          setTime(new Date().toISOString());
        }, 60000);

        return () => clearInterval(interval);
      }, delay);
    };

    updateAtNextMinute();
  }, []);

  return time;
};

export default useMinuteUpdate;