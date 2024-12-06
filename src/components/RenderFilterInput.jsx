import React, { useEffect, useState } from 'react'

import {
  Select,
  SelectItem,
  DateRangePicker,
  Input,
  Button,
} from '@nextui-org/react'
import { CalendarDate } from '@internationalized/date'

import { useFilters } from '../store/useFilters'
import { toDateFromDatePicker } from '../lib/helpers/utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

export const RenderFilterInput = ({ filter, module }) => {
  const setOptionsByKey = useFilters((state) => state.setOptionsByKey)
  const [values, setValues] = useState([])

  useEffect(() => {
    switch (filter.type) {
      case 'text':
      case 'date':
        if (Object.keys(filter.optionsSelected || {}).length > 0) {
          const start = toDateFromDatePicker(filter.optionsSelected.start)
          const end = toDateFromDatePicker(filter.optionsSelected.end)
          setValues({ start, end })
        } else {
          setValues({ start: null, end: null })
        }
        break
      case 'array':
        setValues(new Set(filter.optionsSelected || []))
        break

      default:
        throw new Error('Tipo de filtro no soportado')
    }
  }, [filter, module])

  const handleSelectionChange = (e) => {
    console.log('🚀 ~ handleSelectionChange ~ filter:', filter)
    let selectedValues = e

    switch (filter.type) {
      case 'text':
      case 'date':
        selectedValues = { start: e.start, end: e.end }
        setValues(selectedValues)
        break
      case 'array':
        selectedValues = Array.from(selectedValues)
        setValues(new Set(selectedValues))
        break

      default:
        break
    }

    setOptionsByKey(module, filter.key, selectedValues)
  }

  switch (filter.type) {
    case 'text':
      return <Input label={filter.name} className="max-w-xs" />
    case 'date':
      return (
        <div className="grid grid-cols-6 gap-2">
          <div className="position-relative col-span-5">
            <DateRangePicker
              label={filter.name}
              className="max-w-xs"
              value={values}
              onChange={handleSelectionChange}
            />
          </div>

          <div className="col-span-1 flex self-center">
            <Button
              onClick={() => handleSelectionChange({ start: null, end: null })}
              isIconOnly
              color="secondary"
              size="sm"
              isDisabled={!values.start && !values.end}
            >
              <FontAwesomeIcon icon={faXmark} />
            </Button>
          </div>
        </div>
      )
    case 'array':
      return (
        <div className="grid grid-cols-6 gap-2">
          <div className="position-relative col-span-5">
            <Select
              label={filter.name}
              selectionMode="multiple"
              placeholder="selecciona un valor"
              selectedKeys={values}
              className="max-w-xs"
              onSelectionChange={handleSelectionChange}
              textValue={!!values && Array.from(values).join(',')}
            >
              {filter.options.map((item) => (
                <SelectItem key={item}>{item}</SelectItem>
              ))}
            </Select>
          </div>
          <div className="col-span-1 flex self-center">
            <Button
              onClick={() => handleSelectionChange([])}
              isIconOnly
              color="secondary"
              size="sm"
              isDisabled={!values.size}
            >
              <FontAwesomeIcon icon={faXmark} />
            </Button>
          </div>
        </div>
      )

    case 'currency':
      return <>Hola</>
    // return (
    //   <>
    //     <div>
    //       <label
    //         for="minAmount"
    //         className="block text-sm font-medium text-gray-700"
    //       >
    //         Min Amount
    //       </label>
    //       <input
    //         type="number"
    //         id="minAmount"
    //         name="minAmount"
    //         min="0"
    //         className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
    //         placeholder="Enter minimum amount"
    //       />
    //     </div>

    //     <div>
    //       <label
    //         for="maxAmount"
    //         className="block text-sm font-medium text-gray-700"
    //       >
    //         Max Amount
    //       </label>
    //       <input
    //         type="number"
    //         id="maxAmount"
    //         name="maxAmount"
    //         min="0"
    //         className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
    //         placeholder="Enter maximum amount"
    //       />
    //     </div>
    //   </>
    // )
    default:
      return <Input label={filter.name} className="max-w-xs" />
  }
}
