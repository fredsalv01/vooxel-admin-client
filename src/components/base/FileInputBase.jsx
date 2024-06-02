import React, { useRef, useState } from 'react';
import { Button, Input } from '@nextui-org/react';

export const FileInputBase = ({ onChangeFile, ...props }) => {
    const fileInputRef = useRef(null);
    const [fileName, setFileName] = useState('');

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        console.info("🚀 ~ handleFileChange child ~ file:", file)

        if (!file) {
            setFileName('');
            return;
        }
        setFileName(file.name);

        if (onChangeFile)
            onChangeFile(file);

    };

    return (
        <>
            <Input
                isReadOnly
                onClick={handleClick}
                placeholder="Click para seleccionar archivo..."
                contentRight={<Button auto onClick={handleClick}>Browse</Button>}
                value={fileName}
                {...props}
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

