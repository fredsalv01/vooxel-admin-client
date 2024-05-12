
import React, { useState } from 'react';
import { Select, SelectItem } from '@nextui-org/react';
import { useUniqueID } from '../../hooks/useUniqueID';

export const SelectBase = ({ label, options, field, form, ...rest }) => {

    const uuid = useUniqueID().getID().toString();

    const hasError = form.errors[field.name] && form.touched[field.name] || false;
    const [touched, setTouched] = React.useState(hasError);

    const handleSelect = (event) => {
        console.log("🚀 ~ handleSelect ~ event:", event)
        field.onChange(event)
        setTouched(false);
    }

    return (
        <Select
            {...rest}
            items={options}
            id={uuid}
            name={field.name}
            value={field.value}
            label={label}
            labelPlacement={'inside'}
            onChange={handleSelect}
            errorMessage={field.value || !touched ? "" : form.errors[field.name]}
            isInvalid={field.value || !touched ? false : true}
            onClose={() => setTouched(true)}
        >
            {(option) => (
                <SelectItem key={option?.id ?? option.value} value={option.value}>
                    {option.label}
                </SelectItem>
            )}
        </Select>
    );
};