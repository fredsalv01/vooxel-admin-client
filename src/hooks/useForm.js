import { useState } from 'react';

export const useForm = ( initialForm = {} ) => {
  
    const [ formData, setFormData ] = useState( initialForm );

    const onInputChange = ({ target }) => {
        const { name, value } = target;
        setFormData({
            ...formData,
            [ name ]: value
        });
    }

    const onResetForm = () => {
        setFormData( initialForm );
    }

    return {
        ...formData,
        formData,
        onInputChange,
        onResetForm,
    }
}