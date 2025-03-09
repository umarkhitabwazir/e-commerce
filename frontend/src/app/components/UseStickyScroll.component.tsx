import { useState, useEffect, useCallback } from "react";

const useStickyScroll = () => {
  const [isFixed, setIsFixed] = useState(false);

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    console.log('scrollTop',scrollTop > 50)
    setIsFixed(scrollTop > 50);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return isFixed;
};

export default useStickyScroll;
