import React, { useRef } from 'react';
import { Button, Input } from '@nextui-org/react';
import { getValueFromFieldFormik } from '../../lib/helpers/utils';

export const FileInputBase = ({ field, form, label, onChangeFile, ...props }) => {
    const fileInputRef = useRef(null);

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (!file) {
            form.setFieldValue(field.name, '');
            return;
        }

        form.setFieldValue(field.name, file);

        if (onChangeFile) {
            onChangeFile(file);
        }
    };

    const hasError = getValueFromFieldFormik(form.errors, field.name) && getValueFromFieldFormik(form.touched, field.name);

    return (
        <>
            <Input
                label={label}
                size='md'
                variant="bordered"
                onClick={handleClick}
                placeholder="Click para seleccionar archivo..."
                contentRight={<Button auto onClick={handleClick}>Browse</Button>}
                {...props}
                isInvalid={hasError}
                errorMessage={
                    hasError && getValueFromFieldFormik(form.errors, field.name)
                }
            />
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
        </>
    );
};
