import React, { useState } from 'react'
import { Autocomplete, AutocompleteItem } from '@nextui-org/react'
import axiosInstance from '../../axios/axios'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useAsyncList } from '@react-stately/data'

// const fetchItems = async ({ pageParam = 1 }) => {
//   const { data } = await axiosInstance.get(`clients`, {
//     params: {
//       page: pageParam,
//       limit: 10,
//       isActive: true,
//     },
//   })
//   console.log('🚀 ~ fetchItems ~ data:', data)
//   return data
// }

export const AutocompleteBase = ({
  label,
  placeholder,
  // url, // URL for fetching data
  // params, // Optional query parameters for the API call
  ...props
}) => {
  // const {
  //   data,
  //   fetchNextPage,
  //   hasNextPage,
  //   isFetchingNextPage,
  //   status,
  //   error,
  // } = useInfiniteQuery({
  //   queryKey: ['items'],
  //   queryFn: fetchItems,
  //   getNextPageParam: (lastPage, allPages) => {
  //     console.log('🚀 ~ lastPage, allPages:', { lastPage, allPages })
  //     if (lastPage.meta.currentPage < lastPage.meta.totalPages) {
  //       return lastPage.meta.currentPage + 1
  //     } else {
  //       return undefined // No more pages to fetch
  //     }
  //   },
  // })

  // if (status === 'loading') return <div>Loading...</div>
  // if (status === 'error') return <div>Error: {error.message}</div>

  // const [filterText, setFilterText] = useState('')

  const list = useAsyncList({
    async load({ signal, filterText }) {
      try {
        const res = await axiosInstance.get(`clients`, {
          signal,
          params: { isActive: true, input: filterText, limit: 10 },
        })
        console.log('🚀 ~ load ~ res:', res)

        return {
          items: res?.items || [],
        }
      } catch (error) {
        if (axiosInstance.isCancel(error)) {
          console.log('Request canceled', error.message)
        } else {
          console.error('Error fetching data', error)
        }
        return {
          items: [],
        }
      }
    },
  })

  return (
    <>
      <pre>{!!list && list.items}</pre>
      <Autocomplete
        {...props}
        label={label}
        placeholder={placeholder}
        inputValue={list.filterText}
        isLoading={list.isLoading}
        items={list.items}
        // eslint-disable-next-line react/jsx-handler-names
        onInputChange={list.setFilterText}
      >
        {(item) => (
          <AutocompleteItem key={item.businessName}>
            {item.businessName}
          </AutocompleteItem>
        )}
      </Autocomplete>
    </>
  )
}
