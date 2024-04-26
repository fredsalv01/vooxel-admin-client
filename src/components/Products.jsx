import React from 'react'
import { Link } from 'react-router-dom'

export default function Products(){
    return (
       <div>
            <p>This is Products</p>
            <Link className='underline' to="/">
                Go to Dashboard
            </Link>
       </div>
    )
    
}