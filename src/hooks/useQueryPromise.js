// useQueryPromise.js
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../axios/axios";

export const useQueryPromise = ({ url, key, page = 1, limit = 10 }) => {
    const { data, isFetching, refetch, isSuccess, error } = useQuery({
        queryKey: [key, page, limit],
        queryFn: async () => {
            try {
                const response = await axiosInstance.get(url, {
                    params: {
                        isActive: true,
                        page,
                        limit,
                    }
                });
                console.log("🚀 ~ queryFn: ~ response:", response);
                return response.data;
            } catch (err) {
                console.error("Error fetching data:", err);
                throw err;
            }
        },
    });

    if (error) {
        console.error("useQueryPromise error:", error);
    }

    return { data, isFetching, refetch, isSuccess, error };
};
