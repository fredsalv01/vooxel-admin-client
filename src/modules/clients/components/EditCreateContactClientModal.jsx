import React, { useEffect, useMemo, useState } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  ModalFooter,
} from '@nextui-org/react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'

import axiosInstance from '../../../axios/axios'
import { ToastNotification } from '../../../lib/helpers/toast-notification-temp'
import { InputBase } from '../../../components/base'

export const EditCreateContactClientModal = ({
  isOpen,
  onOpenChange,
  item = {},
  items,
  parentId,
  fetchData,
}) => {
  const [title, setTitle] = useState('Agregar')

  const [initialValues, setInitialValues] = useState({
    name: '',
    phone: '',
    designed_area: '',
    email: '',
  })

  const validationSchema = Yup.object({
    name: Yup.string().required(),
    phone: Yup.string().required(),
    designed_area: Yup.string().required(),
    email: Yup.string().email().required(),
  })

  const updateValidationSchema = Yup.object({
    name: Yup.string().required(),
    phone: Yup.string().required(),
    designed_area: Yup.string().required(),
    email: Yup.string().email().required(),
  })

  const isEditItem = useMemo(() => Object.keys(item).length > 0, [item])

  const handleSubmit = async (values, setSubmitting, onClose) => {
    try {
      setSubmitting(true)
      console.log('🚀 ~ handleSubmit ~ parentId:', parentId)

      if (isEditItem) {
        await axiosInstance.patch(`contact/${item.id}`, {
          ...values,
        })

        ToastNotification.showSuccess('Contacto actualizado correctamente')
      } else {
        await axiosInstance.post(`contact`, {
          ...values,
          clientId: parentId,
        })
        ToastNotification.showSuccess('Contacto creado correctamente')
      }

      fetchData()
      onClose()
    } catch (error) {
      console.log('Error upserting contract', error)
      if (error.response.status === 400)
        ToastNotification.showError(error.response.data.message)
      else
        ToastNotification.showError(
          `Error al ${isEditItem ? 'editar' : 'crear'} el Contacto`,
        )
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    if (isEditItem) {
      setTitle('Editar')

      setInitialValues({
        name: item.name,
        phone: item.phone,
        designed_area: item.designed_area,
      })
    }
  }, [])

  return (
    <Modal
      size="2xl"
      placement="top-center"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      scrollBehavior="inside"
    >
      <ModalContent>
        {(onClose) => (
          <Formik
            initialValues={initialValues}
            validationSchema={
              isEditItem ? updateValidationSchema : validationSchema
            }
            onSubmit={(values, { setSubmitting }) =>
              handleSubmit(values, setSubmitting, onClose)
            }
            enableReinitialize
          >
            {({ isSubmitting }) => (
              <Form>
                <ModalHeader className="text-2xl">{title} contacto</ModalHeader>
                <ModalBody>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="col-span-1">
                      <Field name="name" label="Nombre" component={InputBase} />
                    </div>
                    <div className="col-span-1">
                      <Field
                        name="phone"
                        label="Celular"
                        component={InputBase}
                      />
                    </div>
                    <div className="col-span-1">
                      <Field
                        name="email"
                        label="Correo electrónico"
                        component={InputBase}
                      />
                    </div>
                    <div className="col-span-1">
                      <Field
                        name="designed_area"
                        label="Área asignada"
                        component={InputBase}
                      />
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="primary"
                    type="submit"
                    isLoading={isSubmitting}
                    size="lg"
                  >
                    Guardar
                  </Button>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        )}
      </ModalContent>
    </Modal>
  )
}
