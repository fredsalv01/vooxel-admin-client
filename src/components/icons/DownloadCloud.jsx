import React from 'react'

export const DownloadCloud = ({ currentColor = '#00abfb', ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg"
        className="icon icon-tabler icon-tabler-cloud-download"
        width="2em"
        height="2em"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke={currentColor}
        fill="none"
        strokeLinecap="round" strokeLinejoin="round"
        {...props}
    >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M19 18a3.5 3.5 0 0 0 0 -7h-1a5 4.5 0 0 0 -11 -2a4.6 4.4 0 0 0 -2.1 8.4" />
        <path d="M12 13l0 9" />
        <path d="M9 19l3 3l3 -3" />
    </svg>
)
