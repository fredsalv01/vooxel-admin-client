import { Textarea } from '@nextui-org/react'
import React from 'react'

export const TextareaBase = ({ field, form, label, placeholder, ...props }) => {
  const hasError =
    (form.errors[field.name] && form.touched[field.name]) || false

  return (
    <Textarea
      isInvalid={hasError}
      variant="bordered"
      label={label}
      placeholder={placeholder}
      defaultValue={field.value}
      errorMessage={hasError && form.errors[field.name]}
      className="max-w-xs"
      {...field}
      {...props}
    />
  )
}
