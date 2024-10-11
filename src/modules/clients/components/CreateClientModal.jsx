import React from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  ModalFooter,
  Divider,
} from '@nextui-org/react'
import { Formik, Form, Field } from 'formik'
import { DatePickerBase, InputBase } from '../../../components/base'
import axios from '../../../axios/axios'
import { ToastNotification } from '../../../lib/helpers/toast-notification-temp'
import * as Yup from 'yup'

export const CreateClientModal = ({ isOpen, onOpenChange, fetchData }) => {
  const initialValues = {
    businessName: '',
    ruc: '',
    phone: '',
    address: '',
    startDateContract: '',
    endDateContract: '',
  }

  const validationSchema = Yup.object({
    businessName: Yup.string().required(),
    ruc: Yup.string().required(),
    phone: Yup.string().required(),
    address: Yup.string().required(),
    startDateContract: Yup.string().required(),
    endDateContract: Yup.string().required(),
  })

  const handleSubmit = async (values, setSubmitting, onClose) => {
    const { startDateContract, endDateContract, ...args } = values

    try {
      setSubmitting(true)
      const clientCreated = await axios.post('clients', { ...args })

      await axios.post('contract-clients', {
        clientId: clientCreated.data.id,
        startDate: startDateContract,
        endDate: endDateContract,
      })
      ToastNotification.showSuccess('Cliente creado correctamente')
      fetchData()
      onClose()
    } catch (error) {
      console.log('Error', error)
      if (error.response.status === 400)
        ToastNotification.showError(error.response.data.message)
      else ToastNotification.showError('Error al crear el cliente')
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
          >
            {({ isSubmitting }) => (
              <Form>
                <ModalHeader className="text-2xl">
                  Agregar nuevo cliente
                </ModalHeader>
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
                        label="Teléfono"
                        component={InputBase}
                      />
                    </div>
                    <div className="col-span-2">
                      <Field
                        name="address"
                        label="Dirección"
                        component={InputBase}
                      />
                    </div>
                  </div>

                  <Divider className="mt-2" />

                  <h3 className="text-lg font-semibold">Contrato</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="col-span-1">
                      <Field
                        name="startDateContract"
                        label="Fecha inicio de contratación"
                        component={DatePickerBase}
                      />
                    </div>
                    <div className="col-span-1">
                      <Field
                        name="endDateContract"
                        label="Fecha fin de contratación"
                        component={DatePickerBase}
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
