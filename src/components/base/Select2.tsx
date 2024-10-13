import React, { useCallback, useEffect, useState } from 'react'
import AsyncSelect from 'react-select/async'
import { debounce } from 'lodash'

type Select2Props = {
  name: string
  label: string
  placeholder: string
  field: any
  form: any
  [key: string]: any
}

type Option = {
  value: number | string
  label: string
}

export const Select2: React.FC<Select2Props> = ({
  label,
  placeholder,
  field,
  form,
  fetchOptions,
  selectedItem = {},
  ...props
}) => {
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [page, setPage] = useState<number>(1)
  const [hasMore, setHasMore] = useState<boolean>(true)

  const hasError =
    (form.errors[field.name] && form.touched[field.name]) || false

  const debouncedFetchOptions = useCallback(
    debounce((inputValue: string, callback: (options: Option[]) => void) => {
      fetchOptions(inputValue).then((options: Option[]) => {
        callback(options);
      });
    }, 300),
    []
  );

  const loadOptions = (inputValue: string, callback: (options: Option[]) => void) => {
    debouncedFetchOptions(inputValue, callback);
  };

  const handleMenuScrollToBottom = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1)
    }
  }

  const handleChange = (option: any) => {
    form.setFieldValue(field.name, option.value)
    setSelectedOption(option)
  }

  useEffect(() => {
    if (!!selectedItem && Object.keys(selectedItem).length) {
      setSelectedOption(selectedItem);
    }
  }, [field.name, form.values, fetchOptions]);

  return (
    <>
      <p className="mb-1 font-semibold">{label}</p>
      <AsyncSelect
        {...props}
        placeholder={placeholder}
        cacheOptions
        loadOptions={loadOptions}
        defaultOptions
        value={selectedOption}
        onMenuScrollToBottom={handleMenuScrollToBottom}
        styles={{
          menu: (provided: any) => ({
            ...provided,
            zIndex: 999,
          }),
          control: (provided: any) => ({ 
            ...provided,
            borderColor: hasError ? '#f31260' : '#e5e7eb',
            border: hasError ? '2px solid #f31260' : '2px solid #e5e7eb',
            borderRadius: '0.65rem',
          })
        }}
        onChange={handleChange}
      />
      <span className="small mt-2 text-xs" style={
        hasError ? { display: 'block', color: '#f31260' } : { display: 'none' }
      }>
        {hasError && form.errors[field.name]}
      </span>
    </>
  )
}
