
import { useCallback } from "react";

export const useFetchData = (setLoading: (value: boolean) => void) => {
  const fetchData = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
  }, [setLoading]);

  return { fetchData };
};
