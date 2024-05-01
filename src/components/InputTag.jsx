import React from 'react'
import { IoCloseCircleOutline } from 'react-icons/io5'

export const InputTag = (props) => {
  const [tags, setTags] = React.useState(props.tags)
  const removeTags = (indexToRemove) => {
    setTags([...tags.filter((_, index) => index !== indexToRemove)])
  }
  const addTags = (event) => {
    if (event.target.value !== '') {
      setTags([...tags, event.target.value])
      props.selectedTags([...tags, event.target.value])
      event.target.value = ''
    }
  }
  return (
    <div className="flex items-start min-h-12 w-full px-2 border-2 border-gray-300 rounded-lg">
      <ul className="flex flex-row p-0 my-2 mx-2 gap-2">
        {tags.map((tag, index) => (
          <li
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
          </li>
        ))}
      </ul>
      <input
        className="flex-1 border-none h-10 text-sm my-2 mx-2 focus:outline-transparent"
        type="text"
        onKeyUp={(event) => (event.key === 'Enter' ? addTags(event) : null)}
        placeholder="Escribe y presiona Enter"
      />
    </div>
  )
}
