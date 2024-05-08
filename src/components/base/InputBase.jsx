
import React from 'react';
import { Input } from '@nextui-org/react';

export const InputBase = ({ field, form, label, ...props }) => {

    const hasError = (form.errors[field.name] && form.touched[field.name]) || false;
    return (
        <div className="flex flex-col">
            <Input
                size="md"
                variant="bordered"
                label={label}
                {...field}
                {...props}
                autoComplete='off'
                isInvalid={hasError}
                errorMessage={
                    hasError && form.errors[field.name]
                }
            />
        </div>
    );
};