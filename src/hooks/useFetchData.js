import { useEffect, useState } from "react";
import axiosInstance from "../axios/axios";
import useAsync from "./useAsync";

export const useFetchData = ({ url, options = {}, dependencies = [] }) => { 

    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null);
    // const [data, setData] = useState(null);

    const fetchData = async () => { 
        const resp = await axiosInstance.get(`${url}`);
        return resp.data;
    }



    const { loading, error, data } = useAsync( async () => {
        return await fetchData();
    }, dependencies)

    // const fetchData = async () => { 
    //     try {
    //         setLoading(true);
    //         setError(null);
    //         const response = 
    //         console.log("🚀 ~ fetchData ~ response:", response)
    //         setData(response.data);
            
    //     } catch (error) {
    //         console.error("Error fetching data:", error);
    //         setError(error.message);
    //     } finally {
    //         setLoading(false);
    //     }
    // }

    // useEffect(() => {
    //     fetchData();
    // }, []);

    return { loading, error, data, fetchData };
};