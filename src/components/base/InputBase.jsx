
import React from 'react';
import { Input } from '@nextui-org/react';

const InputBase = ({ field, form, label, ...props }) => {

    const hasError = (form.errors[field.name] && form.touched[field.name]) || false;
    return (
        <div className="flex flex-col w-full">
            <Input
                size="sm"
                variant="bordered"
                label={label}
                {...field}
                {...props}
                isInvalid={hasError}
                errorMessage={
                    hasError && form.errors[field.name]
                }
            />

        </div>
    );
};

export default InputBase;