import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../axios/axios'
import Validation from '../components/validation/validation'
import { useDispatch, useSelector } from 'react-redux'
import { addToken } from '../features/tokenReducer'

import { Button } from '@nextui-org/react'

export const Login = () => {
  const dispatch = useDispatch()

  const navigate = useNavigate()

  const [values, setValues] = useState({
    email: '',
    password: '',
  })

  const [isLoading, setIsLoading] = useState(false)

  const [errors, setError] = useState({})

  function handleChange(e) {
    e.preventDefault()
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(Validation(values))
    try {
      setIsLoading(true)
      const { data } = await axios.post('auth/login', {
        email: values.email,
        password: values.password,
      })
      dispatch(addToken(data.token))
      navigate('/workers')
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const isFormFilled = values.email && values.password

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="body-font flex h-screen items-center text-gray-900">
          <div className="container mx-auto flex flex-wrap items-center px-5 py-24">
            <div className="pr-0 md:w-1/2 md:pr-16 lg:w-3/5 lg:pr-0">
              <img
                src="https://djioficial.la/img/vooxell.png"
                alt="main-logo"
              />
              <h1 className="title-font hidden text-3xl font-medium leading-relaxed md:block">
                You have data, we give you a new dimension
              </h1>
            </div>
            <div className="mt-10 flex w-full flex-col rounded-lg border-2 border-green-600 bg-opacity-50 p-8 md:ml-auto md:mt-0 md:w-1/2 lg:w-2/6">
              <h2 className="title-font mb-5 text-lg font-medium text-gray-900">
                Ingresa tus credenciales
              </h2>
              <div className="relative mb-4">
                <label
                  htmlFor="email"
                  className="text-sm leading-7 text-gray-900"
                >
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  id="email"
                  name="email"
                  className="w-full rounded border border-gray-600 bg-gray-600 bg-opacity-20 px-3 py-1 text-base leading-8 outline-none transition-colors duration-200 ease-in-out focus:border-green-700 focus:bg-transparent focus:ring-2 focus:ring-green-900"
                />
                {errors.email && (
                  <p style={{ color: 'red', fontSize: '13px' }}>
                    {errors.email}
                  </p>
                )}
              </div>
              <div className="relative mb-4">
                <label
                  htmlFor="email"
                  className="text-sm leading-7 text-gray-900"
                >
                  Contraseña
                </label>
                <input
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  id="password"
                  name="password"
                  className="w-full rounded border border-gray-600 bg-gray-600 bg-opacity-20 px-3 py-1 text-base leading-8 outline-none transition-colors duration-200 ease-in-out focus:border-green-700 focus:bg-transparent focus:ring-2 focus:ring-green-900"
                />
                {errors.password && (
                  <p style={{ color: 'red', fontSize: '13px' }}>
                    {errors.password}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                isLoading={isLoading}
                isDisabled={!isFormFilled}
                className="rounded border-0 bg-green-700 px-8 py-2 text-lg text-white hover:bg-green-600 focus:outline-none"
              >
                Iniciar sesión
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
