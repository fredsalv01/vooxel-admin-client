import React from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  ModalFooter,
  DatePicker,
  Divider,
} from '@nextui-org/react'
import { Formik, Form, Field } from 'formik'
import {
  DatePickerBase,
  InputBase,
  SelectBase,
  InputTagBase,
} from '../../../components/base'
import axios from '../../../axios/axios'
import ToastNotification from '../../../lib/helpers/toast-notification'
import * as Yup from 'yup'
import axiosInstance from '../../../axios/axios'
import {
  DOCUMENT_TYPES_BACKEND,
  ENGLISH_LEVEL_BACKEND,
  RECEIPTS_TYPES_BACKEND,
  SENIORITY_BACKEND,
} from '../../../lib/consts/general'

export const CreateWorkerModal = ({ isOpen, onOpenChange, fetchData }) => {
  const initialValues = {
    name: '',
    apPat: '',
    apMat: '',
    email: '',
    documentType: '',
    documentNumber: '',
    englishLevel: '',
    seniority: '',
    charge: '',
    birthdate: '',
    contractType: '',
    startDate: '',
    hiringDateContract: '',
    endDateContract: '',
    phoneNumber: '',
    address: '',
    districte: '',
    provinc: '',
    department: '',
    familiarAssignment: '',
    techSkills: [],
    salary: 0,
  }

  const validationSchema = Yup.object({
    name: Yup.string().required(),
    apPat: Yup.string().required(),
    apMat: Yup.string().required(),
    documentType: Yup.string().required(),
    documentNumber: Yup.string()
      .when('documentType', {
        is: 'DNI',
        then: (schema) => schema.length(8),
      })
      .when('documentType', {
        is: 'PASAPORTE',
        then: (schema) => schema.length(9),
      })
      .when('documentType', {
        is: 'PASAPORTE',
        then: (schema) => schema.max(20),
      })
      .required(),
    englishLevel: Yup.string().required(),
    charge: Yup.string().required(),
    birthdate: Yup.string()
      .max(
        new Date(
          new Date().getFullYear() - 18,
          new Date().getMonth(),
          new Date().getDate(),
        ),
        'debe tener al menos 18 años',
      )
      .required(), // Assuming birthdate is a string, adjust if it's a date
    contractType: Yup.string().required(),
    hiringDateContract: Yup.string()
      .max(new Date(), 'No puede ser mayor al día de hoy')
      .required(), // Assuming hiringDateContract is a string, adjust if it's a date
    phoneNumber: Yup.string()
      .length(9)
      .matches(/^[0-9]+$/)
      .required(),
    address: Yup.string().required(),
    district: Yup.string().required(),
    province: Yup.string().required(),
    department: Yup.string().required(),
    familiarAssignment: Yup.string().required(),
    techSkills: Yup.array()
      .of(
        Yup.string().required(), // Example: require each element to be a string
      )
      .min(1, 'The array must have at least one element')
      .required('This field is required'),
    email: Yup.string().email().required(),
    seniority: Yup.string().required(),
    startDate: Yup.string().required(),
    salary: Yup.number().required(),
  })

  const handleSubmit = async (values, setSubmitting, onClose) => {
    // console.log(JSON.stringify(values, null, 2));
    const { contractType, hiringDateContract, endDateContract, ...args } =
      values
    try {
      setSubmitting(true)
      const workerCreated = await axiosInstance.post('workers', {
        ...args,
      })

      await axiosInstance.post('/contract-workers', {
        workerId: workerCreated.data.id,
        contractType,
        hiringDate: hiringDateContract,
        endDate: endDateContract,
      })

      new ToastNotification('Colaborador creado correctamente').showSuccess()
      fetchData()
      onClose()
    } catch (error) {
      console.log('Error', error)
      if (error.response.status === 400)
        new ToastNotification(error.response.data.message).showError()
      else new ToastNotification('Error al crear el colaborador').showError()
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
      isDismissable={false}
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
            {({ isSubmitting, values }) => (
              <Form className="grid overflow-y-auto" autoComplete="off">
                <ModalHeader className="text-2xl">
                  Agregar nuevo colaborador {import.meta.env.API_URL}
                </ModalHeader>
                <ModalBody>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="col-span-1">
                      <Field
                        name="name"
                        label="Nombre(s)"
                        component={InputBase}
                      />
                    </div>
                    <div className="col-span-1">
                      <Field
                        name="apPat"
                        label="Apellido Paterno"
                        component={InputBase}
                      />
                    </div>
                    <div className="col-span-1">
                      <Field
                        name="apMat"
                        label="Apellido Materno"
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
                        name="documentType"
                        label="Tipo de documento"
                        component={SelectBase}
                        options={DOCUMENT_TYPES_BACKEND}
                      />
                    </div>
                    <div className="col-span-1">
                      <Field
                        name="documentNumber"
                        label="Nro. de documento"
                        component={InputBase}
                      />
                    </div>
                    <div className="col-span-1">
                      <Field
                        name="startDate"
                        label="Fecha inicio de trabajo"
                        component={DatePickerBase}
                      />
                    </div>
                    <div className="col-span-1">
                      <Field
                        name="englishLevel"
                        label="Nivel de inglés"
                        component={SelectBase}
                        options={ENGLISH_LEVEL_BACKEND}
                      />
                    </div>
                    <div className="col-span-1">
                      <Field
                        name="charge"
                        label="Cargo"
                        component={InputBase}
                      />
                    </div>
                    <div className="col-span-1">
                      <Field
                        name="seniority"
                        label="Seniority"
                        component={SelectBase}
                        options={SENIORITY_BACKEND}
                      />
                    </div>
                    <div className="col-span-1">
                      <Field
                        name="birthdate"
                        label="Fecha de nacimiento"
                        component={DatePickerBase}
                      />
                    </div>
                    <div className="col-span-1">
                      <Field
                        name="phoneNumber"
                        label="Nro. de celular"
                        component={InputBase}
                      />
                    </div>
                    <div className="col-span-1">
                      <Field
                        name="familiarAssignment"
                        label="Asignación familiar"
                        component={SelectBase}
                        options={[
                          { label: 'Sí', value: 'SI' },
                          { label: 'No', value: 'NO' },
                        ]}
                      />
                    </div>
                    <div className="col-span-1">
                      <Field
                        name="salary"
                        label="Salario"
                        component={InputBase}
                        type="number"
                      />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <Field
                        name="techSkills"
                        label="Habilidades"
                        component={InputTagBase}
                      />
                    </div>
                  </div>

                  <Divider className="mt-2" />

                  <h3 className="text-lg font-semibold">Dirección</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="col-span-1">
                      <Field
                        name="address"
                        label="Dirección de dominicilio"
                        component={InputBase}
                      />
                    </div>
                    <div className="col-span-1">
                      <Field
                        name="department"
                        label="Departamento"
                        component={InputBase}
                      />
                    </div>
                    <div className="col-span-1">
                      <Field
                        name="district"
                        label="Distrito"
                        component={InputBase}
                      />
                    </div>
                    <div className="col-span-1">
                      <Field
                        name="province"
                        label="Provincia"
                        component={InputBase}
                      />
                    </div>
                  </div>

                  <Divider className="mt-2" />

                  <h3 className="text-lg font-semibold">Contrato</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="col-span-1">
                      <Field
                        name="hiringDateContract"
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
                    <div className="col-span-1"></div>
                    <div className="col-span-1">
                      <Field
                        name="contractType"
                        label="Tipo de contrato"
                        component={SelectBase}
                        options={RECEIPTS_TYPES_BACKEND}
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
