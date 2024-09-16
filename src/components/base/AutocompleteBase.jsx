import React, { useState, useEffect } from 'react'
import { Autocomplete, AutocompleteItem } from '@nextui-org/react'
import axiosInstance from '../../axios/axios'
import { useInfiniteQuery } from '@tanstack/react-query'

const fetchItems = async ({ pageParam = 1 }) => {
  const { data } = await axiosInstance.get(`clients`, {
    params: {
      page: pageParam,
      limit: 10,
      isActive: true,
    },
  })
  console.log('🚀 ~ fetchItems ~ data:', data)
  return data
}

export const AutocompleteBase = ({
  label,
  placeholder,
  // url, // URL for fetching data
  // params, // Optional query parameters for the API call
  ...props
}) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ['items'],
    queryFn: fetchItems,
    getNextPageParam: (lastPage, allPages) => {
      console.log('🚀 ~ lastPage, allPages:', { lastPage, allPages })
      if (lastPage.meta.currentPage < lastPage.meta.totalPages) {
        return lastPage.meta.currentPage + 1
      } else {
        return undefined // No more pages to fetch
      }
    },
  })

  if (status === 'loading') return <div>Loading...</div>
  if (status === 'error') return <div>Error: {error.message}</div>

  const [filterText, setFilterText] = useState('')

  // Transform the data
  const transformedOptions = (data) => {
    if (!data || !data.length) {
      return []
    }
    return data.flatMap((page) =>
      page.items.map((item) => ({ id: item.id, name: item.businessName })),
    )
  }
  // data?.pages.flatMap((page) =>
  //   page.items.map((item) => ({ id: item.id, name: item.businessName })),
  // ) || []
  // console.log('🚀 ~ transformedOptions ~ page:', page)

  return (
    <Autocomplete
      {...props}
      label={label}
      placeholder={placeholder}
      onInputChange={(e) => setFilterText(e.target.value)}
      options={transformedOptions(data || [])}
      renderItem={(item) => (
        <AutocompleteItem key={item.id} value={item.name}>
          {item.name}
        </AutocompleteItem>
      )}
    />
  )
}
