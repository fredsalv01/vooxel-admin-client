import React, { useEffect, useState } from 'react'
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

import { InputBase } from '../../../components/base'
import axios from '../../../axios/axios'
import { ToastNotification } from '../../../lib/helpers/toast-notification-temp'

export const EditClientModal = ({
  isOpen,
  onOpenChange,
  editItem,
  fetchData,
}) => {
  const [initialValues, setInitialValues] = useState({
    businessName: '',
    ruc: '',
    phone: '',
    address: '',
  })

  const validationSchema = Yup.object({
    businessName: Yup.string().required(),
    ruc: Yup.string().required(),
    phone: Yup.string().required(),
    address: Yup.string().required(),
  })

  useEffect(() => {
    setInitialValues({
      ...editItem,
      businessName: editItem.businessName || '',
      ruc: editItem.ruc || '',
      phone: editItem.phone || '',
      address: editItem.address || '',
    })
  }, [])

  const handleSubmit = async (values, setSubmitting, onClose) => {
    delete values.id
    try {
      setSubmitting(true)
      await axios.patch(`clients/${editItem.id}`, {
        ...values,
      })
      ToastNotification.showSuccess('Colaborador actualizado correctamente')
      fetchData()
      onClose()
    } catch (error) {
      console.log('Error', error)
      if (error.response.status === 400)
        ToastNotification.showError(error.response.data.message)
      else ToastNotification.showError('Error al crear el colaborador')
    } finally {
      setSubmitting(false)
    }
  }

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
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) =>
              handleSubmit(values, setSubmitting, onClose)
            }
            enableReinitialize
          >
            {({ isSubmitting }) => (
              <Form>
                <ModalHeader className="text-2xl">Editar cliente</ModalHeader>
                <ModalBody>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="col-span-1">
                      <Field
                        name="businessName"
                        label="Razon social"
                        component={InputBase}
                      />
                    </div>
                    <div className="col-span-1">
                      <Field name="ruc" label="RUC" component={InputBase} />
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
                        name="address"
                        label="Dirección"
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
