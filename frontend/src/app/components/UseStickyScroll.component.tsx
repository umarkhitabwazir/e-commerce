import { useState, useEffect, useCallback } from "react";

const useStickyScroll = () => {
  const [isFixed, setIsFixed] = useState(false);

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    setIsFixed(scrollTop > 70);
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
