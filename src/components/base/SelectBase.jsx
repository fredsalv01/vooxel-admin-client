
import React from 'react';
import { Select, SelectItem } from '@nextui-org/react';
import { useUniqueID } from '../../hooks/useUniqueID';

export const SelectBase = ({ label, options, field, form, ...rest }) => {

    const hasError = (form.errors[field.name] && form.touched[field.name]) || false;

    const uuid = useUniqueID().getID().toString();

    return (
        <>
            <Select
                {...rest}
                id={uuid}
                name={field.name}
                value={field.value}
                label={label}
                labelPlacement={'inside'}
                onChange={(event) => field.onChange(event)}
                errorMessage={hasError && form.errors[field.name]}
                isInvalid={hasError}
                onClose={() => form.setFieldTouched(field.name, true)}
            >
                {options.map((option) => (
                    <SelectItem key={option?.id ?? option.label} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </Select>
        </>
    );
};