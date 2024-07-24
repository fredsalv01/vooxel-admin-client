import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../axios/axios";

export const useWorker = (workerId) => {
  const getWorkerDetails = useQuery({
    queryKey: ["worker", workerId],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get(`/workers/${workerId}`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    onError: (error) => {
      console.error("useWorker error:", error);
    },
  });

  return { getWorkerDetails };
};
