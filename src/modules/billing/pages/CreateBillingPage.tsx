import React, { useMemo, useState } from 'react'
import { Formik, Form, Field, useFormikContext } from 'formik'
import { Button, Checkbox, Textarea } from '@nextui-org/react'
import * as Yup from 'yup'

import {
  CardBase,
  DatePickerBase,
  InputBase,
  SelectBase,
} from '../../../components/base'

export const CreateBillingPage = () => {
  const [clientOptions, setClienteOptions] = useState([]) // get ?
  const [serviceOptions, setServiceOptions] = useState([]) // get ?
  const [documentTypeOptions, setDocumentTypeOptions] = useState([]) // get ?
  const [hasHes, setHasHes] = useState(false) // get ?

  const [initialValues, setInitialValues] = useState({
    // year: '', // con el año y mes se calcula el periodo, no se si es importante mostrarlo
    // month: '',
    client: '', // jala el ruc
    document_type: '', // tabla tipos
    document_number: '',
    start_date: '',
    payment_deadline: '',
    service_id: '', // tabla de servicios
    description: '',
    purchase_order_number: '',
    currency: '', // enum dolares o soles,
    // amount: '',  // se calcula con el total y el igv
    //IGV: '', // se calcula con el total y el igv
    total: '', // por debajo se calcular la conversion en soles y dolares.
    // status: '', // enum pendiente, pagado, anulado al momento de crear es pendiente. luego en editar se podra cambiar segun el plazo de pago o simplemente anulado
    // fecha de vencimiento se calcula con el payment_deadline
    // dias acumulados es para la tabla de facturacion para saber la mora en caso que aun no se ha pagado, igual debe mostrarse ?
    currencyValue: '',
  })

  const validationSchema = Yup.object({
    bankName: Yup.string().required(),
    AccountType: Yup.string().required(),
    bankAccountNumber: Yup.string().required(),
    cci: Yup.string().required(),
    currency: Yup.string().required(),
  })

  const tax = 1.18

  const AmountCalculation = () => {
    const { values } = useFormikContext() // Access Formik values

    const amount = useMemo(() => {
      if (!!values.total && parseFloat(values.total) > 0) {
        return (parseFloat(values.total) / tax).toFixed(2)
      }
      return '0'
    }, [values.total, tax])

    const IGV = useMemo(() => {
      if (!!values.total && parseFloat(values.total) > 0) {
        return (
          parseFloat(values.total) - parseFloat(parseInt(amount) ? amount : '0')
        ).toFixed(2)
      }
      return '0'
    }, [values.total, tax])

    return (
      <div className="flex flex-col items-end justify-end">
        <div className="mb-3">
          <strong>Monto:</strong> {amount}
        </div>
        <div className="mb-3">
          <strong>IGV:</strong> {IGV}
        </div>
        <Field name="total" label="Total" component={InputBase} type="number" />
      </div>
    )
  }

  const handleSubmit = (values, setSubmitting, onClose) => {
    console.log('🚀 ~ handleSubmit ~ values:', values)
  }
  return (
    <CardBase className="container">
      <h2 className="mb-4 text-2xl font-semibold">Crear Venta</h2>

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
            <div className="grid grid-cols-1 md:grid-cols-2">
              <section className="grid grid-cols-1 gap-4 border-0 border-green-500 pr-4 md:grid-cols-2 md:border-r-2">
                <Field
                  name="document_type"
                  label="Tipo de doc."
                  component={SelectBase}
                  options={documentTypeOptions}
                />
                <Field
                  name="document_number"
                  label="Nro de doc."
                  component={InputBase}
                />
                <div className="col-span-2">
                  <Field
                    name="client"
                    label="Cliente"
                    component={SelectBase}
                    options={clientOptions}
                  />
                </div>

                <div className="col-span-2">
                  <Field
                    name="purchase_order_number"
                    label="Nro orden de compra"
                    component={InputBase}
                  />
                </div>

                <div className="col-span-1 flex items-center">
                  <Checkbox
                    isSelected={hasHes}
                    onValueChange={setHasHes}
                    size="md"
                  >
                    Habilitar HES
                  </Checkbox>
                </div>
                {hasHes && (
                  <div className="col-span-1">
                    <Field name="Hes" label="HES" component={InputBase} />
                  </div>
                )}
                <div className="col-span-2">
                  <Field
                    name="description"
                    label="Descripción"
                    component={Textarea}
                  />
                </div>
              </section>
              <section className="grid grid-cols-1 gap-4 pl-4 md:grid-cols-2">
                <Field
                  name="start_date"
                  label="Fecha de emisión"
                  component={DatePickerBase}
                />
                <Field
                  name="payment_deadline"
                  label="Plazo de pago"
                  placeholder="30 días"
                  component={InputBase}
                />
                <Field
                  name="service_id"
                  label="Servicio"
                  component={SelectBase}
                  options={serviceOptions}
                />
                <Field
                  name="currency"
                  label="Moneda"
                  component={SelectBase}
                  options={[
                    { label: 'Soles', value: 'PEN' },
                    { label: 'Dólares', value: 'USD' },
                  ]}
                />
                <Field
                  name="payment_deadline"
                  label="Plazo de pago"
                  placeholder="30 días"
                  component={InputBase}
                />
                <Field
                  name="currencyValue"
                  label="Tipo de cambio"
                  component={InputBase}
                />

                <div>Estado: Pendiente</div>

                <div className="col-span-1">
                  <AmountCalculation />
                </div>
              </section>
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                color="primary"
                type="submit"
                isLoading={isSubmitting}
                size="lg"
              >
                Guardar
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </CardBase>
  )
}
