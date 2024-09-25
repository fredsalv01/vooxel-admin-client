// useQueryPromise.js
import { useState, useEffect, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '../axios/axios'

export const useQueryPromise = ({ url, key }) => {
  const [paginationProps, setPaginationProps] = useState({
    currentPage: 1,
    itemCount: 1,
    itemsPerPage: 10,
    totalItems: 1,
    totalPages: 1,
  })

  const [querySearch, setQuerSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState(querySearch)

  // Debounce function
  const debounce = (func, delay) => {
    let timer
    return (...args) => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        func(...args)
      }, delay)
    }
  }

  const handleSearchChange = useCallback(
    debounce((value) => {
      setDebouncedSearch(value)
    }, 500),
    [],
  )

  useEffect(() => {
    handleSearchChange(querySearch)
  }, [querySearch, handleSearchChange])

  const { data, isFetching, refetch, isSuccess, error } = useQuery({
    queryKey: [
      key,
      paginationProps.currentPage,
      paginationProps.itemsPerPage,
      debouncedSearch,
    ],
    queryFn: async () => {
      const params = {
        isActive: true,
        page: paginationProps.currentPage,
        limit: paginationProps.itemsPerPage,
      }

      if (['billing'].includes(url)) {
        delete params.isActive
      }

      try {
        if (debouncedSearch.length) params.input = debouncedSearch
        const response = await axiosInstance.get(url, {
          params,
        })
        console.log('🚀 ~ queryFn: ~ response:', response)
        const { meta } = response.data
        setPaginationProps({
          currentPage: meta.currentPage,
          itemCount: meta.itemCount,
          itemsPerPage: meta.itemsPerPage,
          totalItems: meta.totalItems,
          totalPages: meta.totalPages,
        })
        return response.data
      } catch (err) {
        console.error('Error fetching data:', err)
        throw err
      }
    },
    onError: (err) => {
      console.error('useQueryPromise error:', err)
    },
  })

  if (error) {
    console.error('useQueryPromise error:', error)
  }

  const updatingList = (prop, newValue) => {
    // update if the prop is in the paginationProps and the value is different
    if (paginationProps[prop] === newValue) return
    setPaginationProps({
      ...paginationProps,
      [prop]: newValue,
    })

    // refetch();
  }

  return {
    data,
    isFetching,
    refetch,
    isSuccess,
    error,
    paginationProps,
    updatingList,
    setQuerSearch,
  }
}
