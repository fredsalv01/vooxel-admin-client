import React, { useEffect, useState } from 'react';
import { Select, SelectItem } from '@nextui-org/react';
import { useUniqueID } from '../../hooks/useUniqueID';
import { getValueFromFieldFormik } from '../../lib/helpers/utils';

export const SelectBase = ({ label, options, field, form, ...rest }) => {

    const uuid = useUniqueID().getID().toString();

    const [isEmptyOptionSelected, setIsEmptyOptionSelected] = useState(
        field.value === null || field.value === ''
    );

    useEffect(() => {
        form.setFieldTouched(field.name, true);
        if (field.value !== '') {
            if (field.name === 'AccountType') {

                console.log("🚀 ~ useEffect ~ field.value:", field)
            }
            form.setFieldValue(field.name, field.value);
        } else {
            setIsEmptyOptionSelected(field.value === null || field.value === '');
        }

    }, [field.value, field.name]);

    const hasError = getValueFromFieldFormik(form.errors, field.name) && getValueFromFieldFormik(form.touched, field.name);
    const [touched, setTouched] = React.useState(hasError);

    const handleSelect = (event) => {
        form.handleChange(event)
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
            errorMessage={field.value || !touched ? "" : getValueFromFieldFormik(form.errors, field.name)}
            isInvalid={field.value || !touched ? false : true}
            selectedKeys={field.value ? [field.value] : ''}
            defaultSelectedKeys={field.value ? [field.value] : 'all'}
            onClose={() => setTouched(true)}
        >
            {(option) => (
                <SelectItem key={option.id ?? option.value} value={option.value}>
                    {option.label}
                </SelectItem>
            )}
        </Select>
    );
};