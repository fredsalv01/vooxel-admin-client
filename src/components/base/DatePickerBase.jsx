import { parseAbsoluteToLocal, parseDate, parseZonedDateTime } from '@internationalized/date'
import { DatePicker } from '@nextui-org/react'
import { format, compareAsc } from "date-fns";
import { formatInTimeZone } from 'date-fns-tz'

import { es } from 'date-fns/locale';

import { useMemo, useState } from 'react';

export const DatePickerBase = ({ field, form, label, isRequired = true, ...props }) => {

    // const [startDate, setStartDate] = useState();

    const handleDatePickerInput = (newValue) => {
        console.log("🚀 ~ handleDatePickerInput ~ newValue:", newValue)
        const { year, month, day } = newValue


        const date = `${year}-${("0" + month).slice(-2)}-${("0" + day).slice(-2)}`;

        console.log("🚀 ~ handleDatePickerInput ~ date:", date)
        // const formatDate = formatInTimeZone(date, 'America/Lima', 'yyyy-MM-dd', { locale: es }) // 2014-10-25 06:46:20-04:00
        // console.log("🚀 ~ handleDatePickerInput ~ formatDate:", formatDate)

        // const parseDate2 = parseDate(formatDate);
        // console.log("🚀 ~ handleDatePickerInput ~ parseDate2:", parseDate2)
        // const date = new Date(year, month, day)
        // const utcDate = formatInTimeZone(date, 'America/Lima', 'yyyy-MM-dd', { locale: esPE })
        // console.log("🚀 ~ handleDatePickerInput ~ utcDate:", utcDate)

        // const timeZone = "America/Lima";
        // const zonedDate = utcToZonedTime(new Date(year, month, day), timeZone);
        // console.log("🚀 ~ handleDatePickerInput ~ zonedDate:", zonedDate)
        form.setFieldValue(field.name, date)
    }

    const startDate = useMemo(() => {
        if (field.value) {
            const date = parseDate(field.value)
            return date;
        }
        return null
    }, [field.value])

    const hasError = (form.errors[field.name] && form.touched[field.name]) || false

    return (
        <DatePicker
            size={'sm'}
            className='grid'
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
