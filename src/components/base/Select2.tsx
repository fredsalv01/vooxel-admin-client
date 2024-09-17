import React, { useState } from 'react'
import AsyncSelect from 'react-select/async'

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
      const resp = await fetch(
        `https://rickandmortyapi.com/api/character/?name=${inputValue}&status=alive&page=${page}`,
      )

      const data = await resp.json()
      console.log('🚀 ~ fetchOptions ~ data:', data)

      if (!data.info.next) {
        console.log('🚀 ~ fetchOptions ~ data:', data)
        setHasMore(false)
      }

      return data.results.map((character: any) => ({
        value: character.id,
        label: `${character.name} - ${character.id}`,
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
    fetchOptions(inputValue).then(callback)
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
