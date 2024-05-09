import { parseDate } from '@internationalized/date'
import { DatePicker } from '@nextui-org/react'
import moment from 'moment'
import React from 'react'

export const DatePickerBase = ({ field, form, label, isRequired = true, ...props }) => {
    const hasError = (form.errors[field.name] && form.touched[field.name]) || false

    const [startDate, setStartDate] = React.useState(field.value !== '' ? parseDate(moment(new Date(field.value)).format('YYYY-MM-DD')) : null)

    const handleDatePickerInput = (newValue) => {
        const { year, month, day } = newValue
        const formatDate = moment(`${year}-${month}-${day}`);
        const date = parseDate(formatDate.format('YYYY-MM-DD'));
        setStartDate(date)
        form.setFieldValue(field.name, date)
    }

    return (
        <DatePicker
            size={'sm'}
            label={label}
            name="hiringDate"
            variant="bordered"
            value={startDate}
            onChange={(newValue) => handleDatePickerInput(newValue)}
            isInvalid={hasError}
            errorMessage={hasError && form.errors[field.name]}
            showMonthAndYearPickers
            isRequired={isRequired}
            className='grid'
        />
    )
}
