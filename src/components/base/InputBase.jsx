import React from 'react'
import { Input } from '@nextui-org/react'
import { getValueFromFieldFormik } from '../../lib/helpers/utils'

export const InputBase = ({ field, form, label, ...props }) => {
  const hasError =
    getValueFromFieldFormik(form.errors, field.name) &&
    getValueFromFieldFormik(form.touched, field.name)
  return (
    <div className="flex flex-col">
      <Input
        size="md"
        variant="bordered"
        label={label}
        {...field}
        {...props}
        isInvalid={hasError}
        errorMessage={
          hasError && getValueFromFieldFormik(form.errors, field.name)
        }
      />
    </div>
  )
}
