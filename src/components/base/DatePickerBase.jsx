import { parseDate } from '@internationalized/date'
import { DatePicker } from '@nextui-org/react'
import { useMemo } from 'react'

export const DatePickerBase = ({
  field,
  form,
  label,
  isRequired = true,
  ...props
}) => {
  const handleDatePickerInput = (newValue) => {
    console.log('🚀 ~ handleDatePickerInput ~ newValue:', newValue)
    const { year, month, day } = newValue
    const date = `${year}-${('0' + month).slice(-2)}-${('0' + day).slice(-2)}`
    form.setFieldValue(field.name, date)
  }

  const startDate = useMemo(() => {
    if (field.value) {
      const date = parseDate(field.value)
      return date
    }
    return null
  }, [field.value])

  const hasError =
    (form.errors[field.name] && form.touched[field.name]) || false

  return (
    <DatePicker
      size={'sm'}
      className="grid"
      label={label}
      name={field.name}
      variant="bordered"
      value={startDate}
      // defaultValue={field.value}
      onChange={(newValue) => handleDatePickerInput(newValue)}
      showMonthAndYearPickers
      isRequired={isRequired}
      isInvalid={hasError}
      errorMessage={hasError && form.errors[field.name]}
      {...props}
    />
  )
}
