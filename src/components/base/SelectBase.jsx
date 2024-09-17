import React, { useEffect, useMemo, useState } from 'react'
import { Select, SelectItem } from '@nextui-org/react'
import { useUniqueID } from '../../hooks/useUniqueID'
import { getValueFromFieldFormik } from '../../lib/helpers/utils'

export const SelectBase = ({ label, options, field, form, ...rest }) => {
  const uuid = useUniqueID().getID().toString()

  const [selected, setSelected] = useState(field.value || null)

  useEffect(() => {
    form.setFieldTouched(field.name, true)
    if (field.value !== undefined && field.value !== null) {
      setSelected(field.value)
    }
  }, [field.value, field.name])

  const hasError =
    getValueFromFieldFormik(form.errors, field.name) &&
    getValueFromFieldFormik(form.touched, field.name)
  const [touched, setTouched] = React.useState(hasError)

  const handleSelect = (event) => {
    form.handleChange(event)
    setSelected(event)
    setTouched(false)
  }

  const fielValue = useMemo(() => {
    if (field.value !== '') {
      return field.value
    }
    return null
  }, [field.value])

  return (
    <Select
      {...rest}
      items={options}
      id={uuid}
      name={field.name}
      value={selected}
      label={label}
      labelPlacement={'inside'}
      onChange={handleSelect}
      errorMessage={
        field.value || !touched
          ? ''
          : getValueFromFieldFormik(form.errors, field.name)
      }
      isInvalid={field.value || !touched ? false : true}
      selectedKeys={fielValue ? [fielValue] : []}
      onClose={() => setTouched(true)}
    >
      {(option) => (
        <SelectItem key={option.id ?? option.value} value={option.value}>
          {option.label}
        </SelectItem>
      )}
    </Select>
  )
}
