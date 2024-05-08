// !Not using debounce correctly

import { useState } from 'react';
import debounce from 'lodash/debounce'; // Import debounce correctly
import { Input } from '@nextui-org/react';

const DebouncedInput = ({ onChange, ...rest }) => {
    const [inputValue, setInputValue] = useState('');

    const handleChange = (e) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        // Call the onChange function after debouncing the input value
        debouncedOnChange(newValue);
    };

    const debouncedOnChange = debounce((value) => {

    }, 1500); // Adjust the debounce delay as needed

    return <Input {...rest} value={inputValue} onChange={handleChange} />;
};

export default DebouncedInput;