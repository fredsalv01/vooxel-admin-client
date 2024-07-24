import axiosInstance from "../axios/axios";
import useAsync from "./useAsync";

export const useFetchData = ({ url, options = {}, dependencies = [] }) => {
  const fetchData = async () => {
    const resp = await axiosInstance.get(`${url}`);
    return resp.data;
  };

  const { loading, error, data } = useAsync(async () => {
    return await fetchData();
  }, dependencies);

  return { loading, error, data, fetchData };
};
