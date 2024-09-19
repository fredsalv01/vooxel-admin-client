import { useEffect, useState } from "react";
import axiosInstance from "../axios/axios";

export const useFetchData = ({ url, options = {}, dependencies = [] }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(url, options);
      console.log("🚀 ~ fetchData ~ response:", response);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { loading, error, data, fetchData };
};
