
import React, { useEffect, useState } from 'react'
import { IoCloseCircleOutline } from 'react-icons/io5'
import { getValueFromFieldFormik } from '../../lib/helpers/utils';

export const InputTagBase = ({ label, options, field, form, ...props }) => {

  const [tags, setTags] = useState(field.value || [])

  useEffect(() => {
    if (field.value !== tags) {
      setTags(field.value || []);
    }
  }, [field.value]);

  const removeTags = (indexToRemove) => {
    setTags([...tags.filter((_, index) => index !== indexToRemove)]);
    form.setFieldValue(field.name, [...tags.filter((_, index) => index !== indexToRemove)]);
  }

  const addTags = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      const newTag = event.target.value.trim(); // Trim leading/trailing spaces
      if (newTag && !tags.includes(newTag) && newTag.length > 2) {
        setTags([...tags, newTag]);
        form.setFieldValue(field.name, [...tags, newTag]);
        event.target.value = '';
      }
    }
  }

  const hasError = getValueFromFieldFormik(form.errors, field.name) && getValueFromFieldFormik(form.touched, field.name);

  return (
    <>
      <fieldset className={`border-2 rounded-lg p-4 ${hasError ? 'border-danger' : ''}`}>
        <legend className={`border-b text-sm px-2 ${hasError ? 'text-danger border-danger' : 'text-gray-500'}`}>{label}</legend>
        <div className="flex min-h-12 w-full flex-wrap gap-2">
          {tags.length > 0 && (
            tags.map((tag, index) => (
              <div
                key={index}
                className="w-auto h-8 flex items-center justify-center text-white bg-blue-500
          text-sm list-none rounded-lg py-2 px-1"
              >
                <span className="my-2 uppercase">{tag}</span>
                <IoCloseCircleOutline
                  className="w-5 h-5 block ml-2 
              hover:opacity-80 rounded-lg cursor-pointer shadow-md"
                  onClick={() => removeTags(index)}
                />
              </div>
            )))}

          <input
            {...props}
            className="flex-1 border-x-0 border-t-0 border border-b-3 h-10 text-sm mx-2 focus:outline-transparent -mt-1"
            type="text"
            onKeyDown={addTags}
            placeholder="Escribe y presiona enter"
          />
        </div>
      </fieldset>
      {hasError && <span className="text-danger text-sm">{getValueFromFieldFormik(form.errors, field.name)}</span>}
    </>
  )
}
