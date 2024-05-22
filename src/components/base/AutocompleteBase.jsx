// TODO: autocomplete stand by
import React, { useState, useEffect } from 'react';
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import axios from 'axios'; // Assuming you use axios for API calls
import { useAsyncList } from '@react-stately/data';

export const AutocompleteBase = ({
    label,
    placeholder,
    url, // URL for fetching data
    // params, // Optional query parameters for the API call
    field,
    form,
    ...props
}) => {
    const hasError = (form.errors[field.name] && form.touched[field.name]) || false;


    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState([]);
    const [filterText, setFilterText] = useState('');

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(url, { params: { input: filterText, isActive: true } });
            console.log("🚀 ~ fetchData ~ response:", response)

            // const fetchedOptions = response.data.items.map((item) => ({
            //     value: item.id, // Assuming ID is the value for the form field
            //     label: item.fullName, // Customize based on your data structure
            // }));
            // setOptions(fetchedOptions);
        } catch (error) {
            console.error("Error fetching data:", error);
            // Handle errors (e.g., display an error message)
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []); // Fetch data on component mount

    return (
        <Autocomplete
            {...props}
            inputValue={filterText}
            isLoading={isLoading}
            items={options}
            label={label}
            placeholder={placeholder}
            variant="bordered"
            onInputChange={setFilterText}
            onSelectionChange={(key) => form.setFieldValue(field.name, key)}
        >
            {(item) => (
                <AutocompleteItem key={item.id} className="capitalize">
                    {item.label}
                </AutocompleteItem>
            )}
        </Autocomplete>
    );
};