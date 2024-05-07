import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../axios/axios'
import Validation from '../components/validation/validation'
import { useDispatch, useSelector } from 'react-redux'
import { addToken } from '../features/tokenReducer'

export const Login = () => {
    const dispatch = useDispatch()

    const tokens = useSelector((state) => state.tokens)

    const navigate = useNavigate()

    const [values, setValues] = useState({
        email: 'mister@gmail.com',
        password: 'password'
    })

    const [errors, setError] = useState({})

    function handleChange(e) {
        e.preventDefault()
        setValues({ ...values, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setError(Validation(values))
        try {
            const { data } = await axios.post('auth/login', {
                email: values.email,
                password: values.password
            })
            dispatch(addToken(data.token))
            navigate('/workers')
        } catch (error) {
            console.log(error)
        }
    }

    const isFormFilled = values.email && values.password

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="h-screen flex items-center text-gray-900 body-font">
                    <div className="container px-5 py-24 mx-auto flex flex-wrap items-center">
                        <div className="lg:w-3/5 md:w-1/2 md:pr-16 lg:pr-0 pr-0">
                            <img src="https://djioficial.la/img/vooxell.png" alt="" />
                            <h1 className="hidden title-font font-medium text-3xl md:block leading-relaxed">
                                You have data, we give you a new dimension
                            </h1>
                        </div>
                        <div className="lg:w-2/6 md:w-1/2 border-2 border-green-600 bg-opacity-50 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0">
                            <h2 className="text-gray-900 text-lg font-medium title-font mb-5">Sign Up</h2>
                            <div className="relative mb-4">
                                <label htmlFor="email" className="leading-7 text-sm text-gray-900">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={values.email}
                                    onChange={handleChange}
                                    id="email"
                                    name="email"
                                    className="w-full bg-gray-600 bg-opacity-20 focus:bg-transparent focus:ring-2 focus:ring-green-900 rounded border border-gray-600 focus:border-green-700 text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                />
                                {errors.email && <p style={{ color: 'red', fontSize: '13px' }}>{errors.email}</p>}
                            </div>
                            <div className="relative mb-4">
                                <label htmlFor="email" className="leading-7 text-sm text-gray-900">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={values.password}
                                    onChange={handleChange}
                                    id="password"
                                    name="password"
                                    className="w-full bg-gray-600 bg-opacity-20 focus:bg-transparent focus:ring-2 focus:ring-green-900 rounded border border-gray-600 focus:border-green-700 text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                />
                                {errors.password && <p style={{ color: 'red', fontSize: '13px' }}>{errors.password}</p>}
                            </div>
                            <button
                                disabled={!isFormFilled}
                                className="text-white bg-green-700 border-0 py-2 px-8 focus:outline-none hover:bg-green-600 rounded text-lg"
                            >
                                Log In
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}
