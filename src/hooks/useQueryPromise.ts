import { useState, useEffect, useCallback } from 'react';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import axiosInstance from '../axios/axios';
import { debounce } from '../lib/helpers/utils';

interface PaginationProps {
  currentPage: number;
  itemCount: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

interface UseQueryPromiseProps {
  url: string;
  key: string;
  type: 'GET' | 'POST';
  filters?: any[
  /**
   * year: [2021, 2022, 2023, 2024, 2025]
   * month: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
   * dates: [
   *  {
   *    column:"date",
   *    start_date: "2021-01-01",
   *    end_date: "null"
   *  }
   * ],
   * order: [column = id, direction = 'desc']
   */
  ];
}

// "year": [
//   2021
// ],
//   "month": [
//     1
//   ],
//     "currency": [
//       "SOLES",
//       "DOLARES"
//     ],
//       "state": "PENDIENTE",
//         "service": [
//           "CONSULTORIA",
//           "CAPACITACION"
//         ],
//           "client": [
//             "Empresa 1",
//             "Empresa 2"
//           ],

interface Meta {
  currentPage: number;
  itemCount: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

interface ResponseData {
  meta: Meta;
  [key: string]: any;
}

export const useQueryPromise = ({ url, key, filters, type = 'GET' }: UseQueryPromiseProps): any => {
  const [paginationProps, setPaginationProps] = useState<PaginationProps>({
    currentPage: 1,
    itemCount: 1,
    itemsPerPage: 10,
    totalItems: 1,
    totalPages: 1,
  });

  const [querySearch, setQuerySearch] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>(querySearch);

  const handleSearchChange = useCallback(
    debounce((value: string) => {
      setDebouncedSearch(value);
    }, 500),
    []
  );

  useEffect(() => {
    handleSearchChange(querySearch);
  }, [querySearch, handleSearchChange]);

  const { data, isFetching, refetch, isSuccess, error } = useQuery<ResponseData>({
    queryKey: [
      key,
      paginationProps.currentPage,
      paginationProps.itemsPerPage,
      debouncedSearch,
    ],
    queryFn: async () => {
      const params: Record<string, any> = {
        isActive: true,
        page: paginationProps.currentPage,
        limit: paginationProps.itemsPerPage,
      };

      if (['billing/find'].includes(url)) {
        delete params.isActive;
      }

      try {
        if (debouncedSearch.length) params.input = debouncedSearch;

        if (filters) {
          params.filters = filters;
        }

        if (type === 'POST') {
          const response = await axiosInstance.post(url, params);
          const { meta } = response.data;
          setPaginationProps({
            currentPage: meta.currentPage,
            itemCount: meta.itemCount,
            itemsPerPage: meta.itemsPerPage,
            totalItems: meta.totalItems,
            totalPages: meta.totalPages,
          });
          return response.data;
        }

        const response = await axiosInstance.get(url, {
          params,
        });

        const { meta } = response.data;
        setPaginationProps({
          currentPage: meta.currentPage,
          itemCount: meta.itemCount,
          itemsPerPage: meta.itemsPerPage,
          totalItems: meta.totalItems,
          totalPages: meta.totalPages,
        });
        return response.data;


      } catch (err) {
        console.error('Error fetching data:', err);
        throw err;
      }
    }
  });

  useEffect(() => {
    if (error) {
      console.error('Error fetching data:', error);
    }
  }, [error]);

  const updatingList = (prop: keyof PaginationProps, newValue: any) => {
    if (paginationProps[prop] === newValue) return;
    setPaginationProps({
      ...paginationProps,
      [prop]: newValue,
    });
  }

  return {
    data,
    isFetching,
    refetch,
    isSuccess,
    error,
    paginationProps,
    updatingList,
    setQuerySearch,
  }
};