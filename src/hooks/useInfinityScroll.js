import { useEffect, useState } from "react";
import axiosInstance from "../axios/axios";

export const usePokemonList = ({fetchDelay = 0} = {}) => {

    const [items, setItems] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const limit = 10; // Number of items per page, adjust as necessary

    const loadItems = async (searchQuery) => {
        const controller = new AbortController();
        const {signal} = controller;

        try {
            setIsLoading(true);

            if (offset > 0) {
                // Delay to simulate network latency
                await new Promise((resolve) => setTimeout(resolve, fetchDelay));
            }

            const res = axiosInstance.get(url, {
                params: {
                    isActive: true,
                    limit: 10,
                    page,
                    search: searchQuery,
                },
                signal
            });
            console.log("🚀 ~ loadItems ~ res:", res)

            // let res = await fetch(
            //     `https://pokeapi.co/api/v2/pokemon?offset=${currentOffset}&limit=${limit}`,
            //     {signal},
            // );

            // if (!res.ok) {
            //     throw new Error("Network response was not ok");
            // }

            // let json = await res.json();

            // setHasMore(json.next !== null);
            // // Append new results to existing ones
            setItems((prevItems) => [...prevItems, ...json.data]);
        } catch (error) {
            if (error.name === "AbortError") {
                console.log("Fetch aborted");
            } else {
                console.error("There was an error with the fetch operation:", error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadItems(offset);
    }, []);

    const onLoadMore = () => {
        setPage((page) => page + 1);
        loadItems();
    };

    return {
        items,
        hasMore,
        isLoading,
        onLoadMore,
    };
};
