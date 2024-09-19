import React, { useMemo, useState } from 'react'
import { Formik, Form, Field, useFormikContext } from 'formik'
import { Button, Checkbox, Textarea } from '@nextui-org/react'
import * as Yup from 'yup'

import {
  CardBase,
  DatePickerBase,
  InputBase,
  SelectBase,
  Select2,
} from '../../../components/base'

type FormValues = {
  client: string
  document_type: string
  document_number: string
  start_date: string
  payment_deadline: string
  serviceType: string
  description: string
  purchase_order_number: string
  currency: string
  total: string
  currencyValue: string
  status: any
  statusDate: Date | null
}

export const CreateBillingPage = () => {
  const [hasHes, setHasHes] = useState(false) // get ?

  const [initialValues, setInitialValues] = useState<FormValues>({
    // year: '', // con el año y mes se calcula el periodo, no se si es importante mostrarlo
    // month: '',
    client: '', // jala el ruc
    document_type: '', // tabla tipos
    document_number: '',
    start_date: '',
    payment_deadline: '',
    serviceType: '', // tabla de servicios
    description: '',
    purchase_order_number: '',
    currency: '', // enum dolares o soles,
    // amount: '',  // se calcula con el total y el igv
    // IGV: '', // se calcula con el total y el igv
    total: '', // por debajo se calcular la conversion en soles y dolares.
    // status: '', // enum pendiente, pagado, anulado al momento de crear es pendiente. luego en editar se podra cambiar segun el plazo de pago o simplemente anulado
    // fecha de vencimiento se calcula con el payment_deadline
    // dias acumulados es para la tabla de facturacion para saber la mora en caso que aun no se ha pagado, igual debe mostrarse ?
    currencyValue: '',
    status: false,
    statusDate: null,
  })

  const validationSchema = Yup.object({
    bankName: Yup.string().required(),
    AccountType: Yup.string().required(),
    bankAccountNumber: Yup.string().required(),
    cci: Yup.string().required(),
    currency: Yup.string().required(),
  })

  const tax = 1.18

  const AmountCalculated = () => {
    const { values }: { values: FormValues } = useFormikContext() // Access Formik values
    const [hasIGV, setHasIGV] = useState(true)
    // si es no igv entonces el deposito es el 100% para el backend

    const amount = useMemo(() => {
      if (!!values.total && parseFloat(values.total) > 0) {
        return (parseFloat(values.total) / (hasIGV ? tax : 1)).toFixed(2)
      }
      return '0'
    }, [values.total, tax, hasIGV])

    const IGV = useMemo(() => {
      let result = '0'
      if (!!values.total && parseFloat(values.total) > 0 && hasIGV) {
        result = (
          parseFloat(values.total) - parseFloat(parseInt(amount) ? amount : '0')
        ).toFixed(2)
      }
      return result
    }, [values.total, tax, hasIGV])

    return (
      <div className="flex flex-col items-end justify-end">
        <div className="mb-3">
          <strong>Monto Neto:</strong> {amount}
        </div>
        <div className="mb-3 flex">
          <Checkbox
            className="mr-4"
            isSelected={hasIGV}
            onValueChange={setHasIGV}
            size="md"
          >
            {hasIGV ? 'Con' : 'Sin'} IGV
          </Checkbox>
          {hasIGV && (
            <p className="font-semibold">
              IGV: <span className="font-normal">{IGV}</span>
            </p>
          )}
        </div>
        <Field
          name="total"
          label="Monto Total"
          component={InputBase}
          type="number"
        />
      </div>
    )
  }

  const ExpirationDateCalculated = () => {
    const { values }: { values: FormValues } = useFormikContext() // Access Formik values

    const expirationDate = useMemo(() => {
      if (!!values.payment_deadline && !!values.start_date) {
        const startDate = new Date(values.start_date)
        const paymentDeadline = parseInt(values.payment_deadline)
        const expirationDate = new Date(
          startDate.setDate(startDate.getDate() + paymentDeadline),
        )
        const expDate = expirationDate.toISOString().split('T')[0]
        const [year, month, day] = expDate.split('-')

        if (year && month && day) {
          return `${day}/${month}/${year}`
        }

        return
      }
      return '--'
    }, [values.payment_deadline, values.start_date])

    return (
      <div className="flex flex-col p-1">
        <label className="font-bold">Fecha de Vencimiento</label>
        <p>{expirationDate}</p>
      </div>
    )
  }

  const StatusDateCalculated = () => {
    const { values }: { values: FormValues } = useFormikContext()

    return (
      <>
        {values.status !== 'pending' ? (
          <Field
            name="dateStatus"
            label="Fecha del estado"
            component={DatePickerBase}
          />
        ) : (
          <div></div>
        )}
      </>
    )
  }

  const handleSubmit = (
    values: FormValues,
    setSubmitting: (isSubmitting: boolean) => void,
  ) => {
    console.log('🚀 ~ handleSubmit ~ values:', values)
  }
  return (
    <CardBase className="container">
      <h2 className="mb-4 text-2xl font-semibold">Crear Venta</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) =>
          handleSubmit(values, setSubmitting)
        }
        enableReinitialize
      >
        {({ isSubmitting, values }) => (
          <Form>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <section className="grid grid-cols-1 gap-4 border-0 border-green-500 pr-4 md:grid-cols-2 md:border-r-2">
                <Field
                  name="document_type"
                  label="Tipo de doc."
                  component={SelectBase}
                  options={[
                    { label: 'Factura', value: 'FACTURA' },
                    { label: 'Boleta', value: 'BOLETA' },
                    { label: 'Letra', value: 'LT' },
                    { label: 'Nota de débito', value: 'ND' },
                    { label: 'Nota de crédito', value: 'NC' },
                  ]}
                />
                <Field
                  name="document_number"
                  label="Nro de doc."
                  component={InputBase}
                />
                <div className="col-span-2">
                  <Field
                    name="client"
                    placeholder="Buscar Cliente..."
                    label="Cliente"
                    component={Select2}
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
                <ExpirationDateCalculated />
                <Field
                  name="serviceType"
                  label="Servicio"
                  component={SelectBase}
                  options={[
                    {
                      label: 'Consultoría',
                      value: 'CONSULTORIA',
                    },
                    {
                      label: 'Licencia',
                      value: 'LICENCIA',
                    },
                    {
                      label: 'Capacitación',
                      value: 'CAPACITACION',
                    },
                    {
                      label: 'otros',
                      value: 'OTROS',
                    },
                  ]}
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
                  name="currencyValue"
                  label="Tipo de cambio"
                  component={InputBase}
                />

                <Field
                  name="status"
                  label="Estado"
                  component={SelectBase}
                  options={[
                    { label: 'Pendiente', value: 'pending' },
                    { label: 'Cancelado', value: 'canceled' },
                    { label: 'Anulado', value: 'anulado' },
                    { label: 'Factoring', value: 'factoring' },
                  ]}
                />

                <StatusDateCalculated />

                <div className="col-span-2">
                  <AmountCalculated />
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
