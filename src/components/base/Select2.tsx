import React, { useState } from 'react'
import AsyncSelect from 'react-select/async'
import axiosInstance from '../../axios/axios'
import { debounce } from '../../lib/helpers/utils'

type Select2Props = {
  name: string
  label: string
  placeholder: string
  field: any
  form: any
  [key: string]: any
}

export const Select2: React.FC<Select2Props> = ({
  name,
  label,
  placeholder,
  field,
  form,
  ...props
}) => {
  const [page, setPage] = useState<number>(1)
  const [hasMore, setHasMore] = useState<boolean>(true)

  const fetchOptions = async (inputValue: string) => {
    try {
      const { data } = await axiosInstance.get('clients', {
        params: {
          isActive: true,
          input: inputValue,
        },
      })
      console.log('🚀 ~ fetchOptions ~ data:', data)

      // if (!data.meta.) {
      //   console.log('🚀 ~ fetchOptions ~ data:', data)
      //   setHasMore(false)
      // }

      return data.items.map((item: any) => ({
        value: item.id,
        label: `${item.businessName} - ${item.id}`,
      }))
    } catch (error) {
      console.error(error)
      return []
    }
  }

  const loadOptions = (
    inputValue: string,
    callback: (options: { value: number; label: string }[]) => void,
  ) => {
    return debounce(fetchOptions(inputValue).then(callback), 300)
  }

  const handleMenuScrollToBottom = () => {
    console.log('🚀 ~ handleMenuScrollToBottom ~ hasMore:', hasMore)
    if (hasMore) {
      setPage((prevPage) => prevPage + 1)
    }
  }

  const handleChange = (option: any) => {
    console.log('🚀 ~ handleChange ~ option:', option)
  }

  return (
    <>
      <p className="mb-1 font-semibold">{label}</p>
      <AsyncSelect
        {...props}
        placeholder={placeholder}
        cacheOptions
        loadOptions={loadOptions}
        defaultOptions
        onMenuScrollToBottom={handleMenuScrollToBottom}
        styles={{
          menu: (provided: any) => ({
            ...provided,
            zIndex: 999,
          }),
        }}
        onChange={handleChange}
      />
      <span className="small mt-2 text-xs text-danger">hola</span>
    </>
  )
}
