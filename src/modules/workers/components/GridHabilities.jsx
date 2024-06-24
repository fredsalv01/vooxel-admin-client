import React, { useMemo } from 'react'

export const GridHabilities = ({ items = [] }) => {
    return (
        items.length &&
        <div className='flex flex-wrap gap-1'>
            {items.map((item, index) => (
                <div
                    key={index}
                    className="w-auto h-8 flex items-center justify-center text-white bg-blue-500
                text-sm list-none rounded-lg py-2 px-2"
                >
                    <span className="my-2 uppercase text-nowrap">{item}</span>
                </div>
            ))}
        </div>
    )
}
