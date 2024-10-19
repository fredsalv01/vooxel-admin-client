import React from 'react'
import { Input } from '@nextui-org/react'
import { getValueFromFieldFormik } from '../../lib/helpers/utils'

export const InputBase = ({ field, form, label, onChange, ...props }) => {
  const hasError =
    getValueFromFieldFormik(form.errors, field.name) &&
    getValueFromFieldFormik(form.touched, field.name)

  const handleChange = (e) => {
    form.setFieldValue(field.name, e.target.value)
    if (onChange) onChange(e.target.value)
  }
  return (
    <div className="flex flex-col">
      <Input
        size="md"
        variant="bordered"
        label={label}
        {...field}
        {...props}
        isInvalid={hasError}
        onChange={handleChange}
        errorMessage={
          hasError && getValueFromFieldFormik(form.errors, field.name)
        }
      />
    </div>
  )
}
