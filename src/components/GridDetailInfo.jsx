import React from 'react'

export const GridDetailInfo = ({ data = [] }) => {
    return (
        <>
            {data && <div className="grid grid-cols-4 gap-2">
                {
                    Object.keys(data).map((key, index) => {
                        if (key === 'id') return null
                        return (
                            <React.Fragment key={`grid-data-${key}-${index}`}>
                                <div className='bg-gray-200 p-3 col-span-1 flex items-center font-semibold'>
                                    {key}
                                </div>
                                <div className='p-3 text-wrap col-span-3 flex items-center bg-gray-100'>
                                    {data[key]}
                                </div>
                            </React.Fragment>
                        )
                    })
                }
            </div>}
        </>
    )
}
