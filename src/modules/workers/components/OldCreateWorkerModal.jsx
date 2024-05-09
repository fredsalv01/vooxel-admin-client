import React, { useState } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  SelectItem,
  Select,
  DatePicker,
  Card,
  CardBody,
  CardHeader
} from '@nextui-org/react'
import { ContractTypeData, DocumentTypeData, EnglishLevelData } from '../../../utils/data-types/data'
import { parseDate } from '@internationalized/date'
import moment from 'moment/moment'
import { I18nProvider } from '@react-aria/i18n'
import { InputTag } from '../../../components/base/InputTagBase'
import axios from '../../../axios/axios'

export default function CreateWorkerModal({ isOpen, onOpenChange, list }) {
  const [formData, setFormData] = useState({
    name: '', //
    apPat: '', //
    apMat: '', //
    documentType: '', //
    documentNumber: '', //
    englishLevel: '',
    charge: '', //
    birthdate: '', //
    contractType: '',
    hiringDate: '',
    phoneNumber: '',
    address: '',
    district: '',
    province: '',
    department: '',
    familiarAssignment: 'Tiene 1 hijo',
    techSkills: [],
    emergencyContacts: []
  })

  const validateDocumentNumber = (value) => value.match(/^[0-9]/i)

  const isInvalid = React.useMemo(() => {
    if (formData.documentNumber === '') return false

    return validateDocumentNumber(formData.documentNumber) ? false : true
  }, [formData.documentNumber])

  const handleInputChange = (event) => {
    const { name, value } = event.target

    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleDatePickerInput = (data, key) => {
    const { year, month, day, ...rest } = data
    console.log('data', data)
    const date = moment(`${year}-${month}-${day}`)
    console.log(date.format('YYYY-MM-DD'))
    setFormData({
      ...formData,
      [key]: parseDate(date.format('YYYY-MM-DD'))
    })
  }

  const selectedTags = (tags) => {
    setFormData({
      ...formData,
      ['techSkills']: tags
    })
  }

  const handleSubmit = async () => {
    // faltaria la validacion de datos

    const formatBirthDate = moment(
      `${formData.birthdate.year}-${formData.birthdate.month}-${formData.birthdate.day}`
    ).format('YYYY-MM-DD')
    const formatHiringDate = moment(
      `${formData.hiringDate.year}-${formData.hiringDate.month}-${formData.hiringDate.day}`
    ).format('YYYY-MM-DD')
    const formatedData = {
      ...formData,
      birthdate: formatBirthDate,
      hiringDate: formatHiringDate
    }
    console.log('formatedData', formatedData)
    try {
      await axios.post('workers', formatedData)
    } catch (error) {
      console.log(error)
    }
    clearFormState()
    list();
  }

  const clearFormState = () => {
    setFormData({
      name: '', //
      apPat: '', //
      apMat: '', //
      documentType: '', //
      documentNumber: '', //
      englishLevel: '',
      charge: '', //
      birthdate: '', //
      contractType: '',
      hiringDate: '',
      phoneNumber: '',
      address: '',
      district: '',
      province: '',
      department: '',
      familiarAssignment: 'Tiene 1 hijo',
      techSkills: [],
      emergencyContacts: []
    })
  }

  return (
    <Modal size="5xl" placement="top-center" isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior='inside'>
      <ModalContent>
        {(onClose) => (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => handleSubmit(values, setSubmitting, onClose)}
          >
            {({ isSubmitting }) => (
              <Form>
                <ModalHeader>Agregar Nuevo Colaborador</ModalHeader>
                <ModalBody>
                  <div className="flex flex-col gap-1 text-green-700">
                    <Card>
                      <CardHeader className="text-sm font-semibold">Datos Personales y de contacto</CardHeader>
                      <CardBody className="w-full">
                        <div className="w-full flex gap-2 items-center justify-center flex-wrap md:flex-nowrap">
                          <Input
                            size={'sm'}
                            value={formData.name}
                            type="text"
                            name="name"
                            label="Nombre"
                            variant="bordered"
                            onChange={handleInputChange}
                            className="max-w-xs"
                            isRequired
                          />
                          <Input
                            size={'sm'}
                            value={formData.apPat}
                            type="text"
                            name="apPat"
                            label="Apellido Paterno"
                            variant="bordered"
                            onChange={handleInputChange}
                            className="max-w-xs"
                            isRequired
                          />
                          <Input
                            size={'sm'}
                            value={formData.apMat}
                            type="text"
                            name="apMat"
                            label="Apellido Materno"
                            variant="bordered"
                            onChange={handleInputChange}
                            className="max-w-xs"
                            isRequired
                          />
                        </div>
                        <div className="w-full flex gap-2 items-center justify-center flex-wrap md:flex-nowrap pt-4">
                          <div className="flex flex-grow justify-center w-full">
                            <I18nProvider locale="es-PE">
                              <DatePicker
                                className="max-w-md"
                                size={'sm'}
                                label="Fecha de nacimiento"
                                name="birthdate"
                                value={formData.birthdate !== '' ? formData.birthdate : null}
                                onChange={(value) => handleDatePickerInput(value, 'birthdate')}
                                variant="bordered"
                                showMonthAndYearPickers
                                isRequired
                              />
                            </I18nProvider>
                          </div>
                          <Select
                            items={DocumentTypeData}
                            label="Tipo de documento"
                            name="documentType"
                            variant="bordered"
                            value={formData.documentType}
                            onChange={handleInputChange}
                            className="max-w-xs"
                            size={'sm'}
                            isRequired
                          >
                            {(documentType) => (
                              <SelectItem key={documentType.value} value={documentType.value}>
                                {documentType.label}
                              </SelectItem>
                            )}
                          </Select>
                          <Input
                            size={'sm'}
                            value={formData.documentNumber}
                            type="text"
                            name="documentNumber"
                            label="Número de Documento"
                            variant="bordered"
                            isInvalid={isInvalid}
                            color={isInvalid ? 'danger' : formData.documentNumber === '' ? 'default' : 'success'}
                            errorMessage={isInvalid && 'Agrega un número de documento válido'}
                            onChange={handleInputChange}
                            className="max-w-xs"
                            isRequired
                          />
                        </div>
                        <div className="w-full flex gap-2 items-center justify-center md:items-start md:justify-start flex-wrap md:flex-nowrap pt-4">
                          <Input
                            size={'sm'}
                            value={formData.phoneNumber}
                            type="number"
                            name="phoneNumber"
                            label="Teléfono"
                            variant="bordered"
                            onChange={handleInputChange}
                            className="max-w-xs"
                            isRequired
                          />
                        </div>
                      </CardBody>
                    </Card>
                    <Card>
                      <CardHeader className="text-sm font-semibold">Datos del domicilio</CardHeader>
                      <CardBody className="w-full">
                        <div className="w-full flex gap-2 items-center justify-center flex-wrap md:flex-nowrap">
                          <Input
                            size={'sm'}
                            value={formData.province}
                            type="text"
                            name="province"
                            label="Provincia"
                            variant="bordered"
                            onChange={handleInputChange}
                            className="max-w-xs"
                            isRequired
                          />
                          <Input
                            size={'sm'}
                            value={formData.department}
                            type="text"
                            name="department"
                            label="Departamento"
                            variant="bordered"
                            onChange={handleInputChange}
                            className="max-w-xs"
                            isRequired
                          />
                          <Input
                            size={'sm'}
                            value={formData.district}
                            type="text"
                            name="district"
                            label="Distrito"
                            variant="bordered"
                            onChange={handleInputChange}
                            className="max-w-xs"
                            isRequired
                          />
                        </div>
                        <div className="w-full flex gap-2 items-center justify-center flex-wrap md:flex-nowrap pt-4">
                          <Input
                            size={'sm'}
                            value={formData.address}
                            type="text"
                            name="address"
                            label="Dirección"
                            variant="bordered"
                            onChange={handleInputChange}
                            className="w-full"
                            isRequired
                          />
                        </div>
                      </CardBody>
                    </Card>
                    <Card>
                      <CardHeader className="text-sm font-semibold">Datos de contratación</CardHeader>
                      <CardBody className="w-full">
                        <div className="w-full flex gap-2 items-center justify-center flex-wrap">
                          <Input
                            size={'sm'}
                            value={formData.charge}
                            type="text"
                            name="charge"
                            label="Cargo"
                            variant="bordered"
                            onChange={handleInputChange}
                            className="max-w-xs"
                            isRequired
                          />
                          <Select
                            items={ContractTypeData}
                            label="Tipo de contratación"
                            name="contractType"
                            variant="bordered"
                            value={formData.contractType}
                            onChange={handleInputChange}
                            className="max-w-xs"
                            size={'sm'}
                            isRequired
                          >
                            {(contractType) => (
                              <SelectItem key={contractType.value} value={contractType.value}>
                                {contractType.label}
                              </SelectItem>
                            )}
                          </Select>
                          <div className="flex flex-1 justify-center w-full">
                            <I18nProvider locale="es-PE">
                              <DatePicker
                                className="max-w-lg"
                                size={'md'}
                                label="Fecha de contratación"
                                name="hiringDate"
                                value={formData.hiringDate !== '' ? formData.hiringDate : null}
                                onChange={(value) => handleDatePickerInput(value, 'hiringDate')}
                                variant="bordered"
                                showMonthAndYearPickers
                                isRequired
                              />
                            </I18nProvider>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                    <Card>
                      <CardHeader className="text-sm font-semibold">Datos de Habilidades</CardHeader>
                      <CardBody className="w-full">
                        <div className="w-full flex flex-col gap-2 items-center justify-center flex-1">
                          <Select
                            items={EnglishLevelData}
                            label="Nivel de Ingles"
                            name="englishLevel"
                            variant="bordered"
                            value={formData.englishLevel}
                            onChange={handleInputChange}
                            className="w-full mb-2"
                            size={'sm'}
                            isRequired
                          >
                            {(englishLevel) => (
                              <SelectItem key={englishLevel.value} value={englishLevel.value}>
                                {englishLevel.label}
                              </SelectItem>
                            )}
                          </Select>
                          <InputTag selectedTags={selectedTags} tags={formData.techSkills} />
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" onPress={async () => {
                    await handleSubmit()
                    onClose()
                  }} size="lg">
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
