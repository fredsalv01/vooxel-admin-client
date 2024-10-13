import React, { useEffect, useMemo, useState } from 'react'
import { Formik, Form, Field, useFormikContext } from 'formik'
import { Button, Checkbox } from '@nextui-org/react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as Yup from 'yup'

import axiosInstance from '../../../axios/axios'
import { ToastNotification } from "../../../lib/helpers/toast-notification-temp";
import { useFetchData } from '../../../hooks/useFetchData'
import * as translateES from '../../../plugins/es.json'

import {
  CardBase,
  DatePickerBase,
  InputBase,
  SelectBase,
  Select2,
  TextareaBase,
} from '../../../components/base'
import { BillingRequestPost } from '@/interfaces/billing.interface'
import { stringToNumber } from '../../../lib/helpers/utils';

type FormValues = {
  client: number,
  document_type: string
  document_number: string
  start_date: string
  payment_deadline: string
  serviceType: number
  description: string
  purchase_order_number: string
  currency: string
  total: string
  conversionRate: string
  status: string
  hasHes: boolean,
  hes: string,
  state2: '',
  depositDate: '',
  depositAmountDollars: '',
  depositAmountSoles: '',
  depositDate2: '',
  depositAmountDollars2: '',
  depositAmountSoles2: '',
}

export const EditBillingPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id } = useParams()

  const { data, isLoading, fetchData } = useFetchData({
    url: `/billing/${id}`,
  }); 
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const [selectedServiceName, setSelectedServiceName] = useState<any>(null)
  const tax = 1.18

  const [hasIGV, setHasIGV] = useState(true)

  const [initialValues, setInitialValues] = useState<FormValues>({
    // year: '', // con el año y mes se calcula el periodo, no se si es importante mostrarlo
    // month: '',
    client: -1, // jala el ruc
    document_type: '', // tabla tipos
    document_number: '',
    start_date: '',
    payment_deadline: '',
    serviceType: -1, // tabla de servicios
    description: '',
    purchase_order_number: '',
    currency: '', // enum dolares o soles,
    // amount: '',  // se calcula con el total y el igv
    // IGV: '', // se calcula con el total y el igv
    total: '', // por debajo se calcular la conversion en soles y dolares.
    // status: '', // enum pendiente, pagado, anulado al momento de crear es pendiente. luego en editar se podra cambiar segun el plazo de pago o simplemente anulado
    // fecha de vencimiento se calcula con el payment_deadline
    // dias acumulados es para la tabla de facturacion para saber la mora en caso que aun no se ha pagado, igual debe mostrarse ?
    conversionRate: '',
    status: '',
    hasHes: false,
    hes: '',
    state2: '',
    depositDate: '',
    depositAmountDollars: '',
    depositAmountSoles: '',
    depositDate2: '',
    depositAmountDollars2: '',
    depositAmountSoles2: '',
  })

  
  useEffect(() => { 
    if (!!data) {
      setInitialValues({
        client: data.client.id ?? '',
        document_type: data.documentType ?? '',
        document_number: data.documentNumber ?? '',
        start_date: data.startDate ?? '',
        payment_deadline: data.paymentDeadline.toString() ?? '',
        serviceType: data.service.id ?? '',
        description: data.description ?? '',
        purchase_order_number: data.purchaseOrderNumber ?? '',
        currency: data.currency ?? '',
        total: data.total.toString() ?? '',
        conversionRate: data?.conversionRate ?? '',
        status: data.billingState ?? '',
        hes: data.hes ?? '',
        hasHes: !(data?.hes) ? false : true,
        state2: data.state2 ?? '',
        depositDate: data.depositDate ?? '',
        depositAmountDollars: data?.depositAmountDollars ?? '',
        depositAmountSoles: data?.depositAmountSoles ?? '',
        depositDate2: data.depositDate2 ?? '',
        depositAmountDollars2: data?.depositAmountDollars2 ?? '',
        depositAmountSoles2: data.depositAmountSoles ?? ''

      })

      setSelectedClient({
        value: data.client.id,
        label: data.client.businessName
      })

      setSelectedServiceName({
        value: data.service.id,
        label: data.service.name
      })
    }
  }, [data])

  const validationSchema = Yup.object({
    client: Yup.string().required(),
    document_type: Yup.string().required(),
    document_number: Yup.string().required(),
    start_date: Yup.string().required(),
    payment_deadline: Yup.string().required(),
    serviceType: Yup.string().required(),
    description: Yup.string().required(),
    purchase_order_number: Yup.string().required(),
    currency: Yup.string().required(),
    total: Yup.string().required(),
    conversionRate: Yup.number().required().min(0).max(5, 'Tipo de cambio debe ser máx 5'),
    status: Yup.string().required(),
    
    hes: Yup.string().when('hasHes', (hasHes, schema) => {
      return hasHes.includes(true) ? schema.required() : schema.notRequired()
    }),
    hasHes: Yup.boolean(),
    depositDate: Yup.string()
    .test('is-not-empty', translateES.requiredField, function(value) {
      // if (!!value) return true
      const { depositAmountSoles, depositAmountDollars, currency } = this.parent;
      if (currency === 'SOLES' && !!depositAmountSoles) return true
      if (currency === 'DOLARES' && !!depositAmountDollars) return true
      return false
    }),
    depositAmountSoles: Yup.number()
    .test('is-not-empty', translateES.requiredField, function(value) {
      // if (!!value) return true
      const { depositAmountSoles, depositDate } = this.parent;
      // console.log("🚀 ~ .test ~ depositAmountSoles:", depositAmountSoles)
    
      if (!!depositDate || !!depositAmountSoles) {
        console.log("🚀 ~ .test ~ depositDate:", depositDate)
        return true
      } 
      
      if (!!depositDate && !!depositAmountSoles) {
        console.log("🚀 ~ .test ~ !!depositAmountSoles", !!depositAmountSoles)
        return false
      }
      return true;
    }),
    depositAmountDollars: Yup.number()
    .test('is-not-empty', translateES.requiredField, function(value) {
      // if (!!value) return true
      const { depositAmountDollars, depositDate } = this.parent;
      if (!!depositDate) return false
      return !depositAmountDollars;
    }),
    depositDate2: Yup.string()
    .test('is-not-empty', translateES.requiredField, function(value) {
      // if (!!value) return true
      const { depositAmountSoles2, depositAmountDollars2, currency } = this.parent;
      if (currency === 'SOLES') {
        return !depositAmountSoles2;
      }
      return !depositAmountDollars2;
    }),
    depositAmountSoles2: Yup.number()
    .test('is-not-empty', translateES.requiredField, function(value) {
      // if (!!value) return true
      const { depositAmountSoles2, depositDate2, state2 } = this.parent;
      if (!!depositDate2 || !!state2) return false
      return !depositAmountSoles2;
    }),
    depositAmountDollars2: Yup.number()
    .test('is-not-empty', translateES.requiredField, function(value) {
      // if (!!value) return true
      const { depositAmountDollars2, depositDate2, state2 } = this.parent;
      if (!!depositDate2 || !!state2) return false
      return !depositAmountDollars2;
    }),
    state2: Yup.string()
    .test('is-not-empty', translateES.requiredField, function(value) {
      // if (!!value) return true
      const { depositAmountSoles2, depositAmountDollars2, currency, depositDate2 } = this.parent;
      if (!!depositDate2) return false
      if (currency === 'SOLES') {
        return !depositAmountSoles2;
      }
      return !depositAmountDollars2;
    }),
  })

  const calculateAmount = (total: string, hasIGV: boolean) => {
    if (!!total && parseFloat(total) > 0) {
      const tax = 1.18;
      return (parseFloat(total) / (hasIGV ? tax : 1)).toFixed(2);
    }
    return '0';
  };

  const calculateIGV = (total: string, amount: string) => {
    if (!!total && parseFloat(total) > 0 && hasIGV) {
      return (parseFloat(total) - parseFloat(amount)).toFixed(2);
    }
    return '0';
  };

  const AmountCalculated: React.FC = () => {
    const { values }: { values: FormValues } = useFormikContext() // Access Formik values

    const amount = useMemo(() => calculateAmount(values.total, hasIGV), [values.total, tax, hasIGV])

    const IGV = useMemo(() => calculateIGV(values.total, amount), [values.total, tax, hasIGV])

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

  const calculateExpirationDate = (paymentDeadlineValue: string, startDateValue: string) => {

    if (!!paymentDeadlineValue && !!startDateValue) {
          const startDate = new Date(startDateValue)
        const paymentDeadline = parseInt(paymentDeadlineValue)
        const expirationDate = new Date(
          startDate.setDate(startDate.getDate() + paymentDeadline),
        )
      return expirationDate.toISOString().split('T')[0];
    }
    return '--';
  }

  const ExpirationDateCalculated: React.FC = () => {
    const { values }: { values: FormValues } = useFormikContext() // Access Formik values

    const expirationDate = useMemo(() => calculateExpirationDate(values.payment_deadline, values.start_date), [values.payment_deadline, values.start_date])

    return (
      <div className="flex flex-col">
        <label className="font-semibold">Fecha de Vencimiento</label>
        <p>{expirationDate}</p>
      </div>
    )
  }

  const ShowFieldDepositCurrency: React.FC = () => { 
    const { values }: { values: FormValues } = useFormikContext() // Access Formik values
      
        return values.currency === 'SOLES'  ? 
        <Field
          name="depositAmountSoles"
          type="number"
          label="Monto soles"
          component={InputBase}
        />
      :
        <Field
          name="depositAmountDollars"
          type="number"
          label="Monto dólares"
          component={InputBase}
        />
  }
  const ShowFieldDepositCurrencyTwo: React.FC = () => { 
    const { values }: { values: FormValues } = useFormikContext() // Access Formik values
      
    return values.currency === 'SOLES'  ? 
      <Field
        name="depositAmountSoles2"
        type="number"
        label="Monto soles"
        component={InputBase}
      /> 
    :
      <Field
        name="depositAmountDollars2"
        type="number"
        label="Monto dólares"
        component={InputBase}
      />
  }

  const mutation = useMutation({
    mutationFn: async (body: BillingRequestPost) => {
      return await axiosInstance.patch(`billing/${id}`, body);
    },
    onSuccess: () => {
      queryClient.removeQueries({queryKey: ['billing'], exact: false}); // Invalidate the billing list cache
      ToastNotification.showSuccess('Venta creada correctamente');
      navigate('/billing');
    },
    onError: () => {
      ToastNotification.showError('Error al crear la venta');
    },
  });

  const handleSubmit = async (
    values: FormValues,
    setSubmitting: (isSubmitting: boolean) => void,
  ) => {
    setSubmitting(true);
    const amount = calculateAmount(values.total, hasIGV);
    const IGV = calculateIGV(values.total, amount);
    const finalAmount = parseFloat(values.total);
    const finalExpirationDate = calculateExpirationDate(values.payment_deadline, values.start_date);
    
    let body: BillingRequestPost = {
      clientId: values.client,
      documentType: values.document_type,
      documentNumber: values.document_number,
      startDate: values.start_date,
      paymentDeadline: parseInt(values.payment_deadline),
      serviceId: values.serviceType,
      description: values.description,
      purchaseOrderNumber: values.purchase_order_number,
      currency: values.currency,
      conversionRate: parseFloat((parseFloat(values.conversionRate) * 100 / 100).toFixed(2)),
      amount: finalAmount,
      hasIGV: hasIGV,
      igv: IGV,
      total: parseFloat(values.total),
      billingState: values.status,
      expirationDate: finalExpirationDate,
      hasHes: values.hasHes,
      hes: values.hes,
    }

    let { depositDate, depositAmountDollars, depositAmountSoles, state2, depositDate2, depositAmountDollars2, depositAmountSoles2 } = {...values}

    if (!!depositDate || !!depositAmountDollars || !!depositAmountSoles) {
      body = { 
        ...body, 
        depositDate: depositDate ?? null, 
        depositAmountDollars: depositAmountDollars ? stringToNumber(depositAmountDollars) : null, 
        depositAmountSoles: depositAmountSoles ? stringToNumber(depositAmountSoles) : null 
      }
    }

    if (!!state2 || !!depositDate2 || !!depositAmountDollars2 || !!depositAmountSoles2) {
      body = { 
        ...body, 
        state2: state2 ?? null, 
        depositDate2: depositDate2 ?? null, 
        depositAmountDollars2: depositAmountDollars2 ? stringToNumber(depositAmountDollars2) : null, 
        depositAmountSoles2: depositAmountSoles2 ? stringToNumber(depositAmountSoles2) : null
      }
    }


    mutation.mutate(body); // Trigger the mutation

    // try {
    //   const resp = await axiosInstance.patch(`billing/${id}`, body);
      
    //   console.log("🚀 ~ EditBillingPage ~ resp:", resp)
    //   ToastNotification.showSuccess('Venta creada correctamente');

    //   // how use useMutaion?
    //   useMutation(resp, fetchData);
    //   // queryClient.resetQueries({ queryKey: ['billing'], exact: true });
    //   navigate('/billing');

    // } catch (error) {
    //   ToastNotification.showError('Error al crear la venta');
    // } finally {
    //   setSubmitting(false);
    // }
  }


  const fetchClients = async (inputValue: string, page: number) => {
    try {
      const { data } = await axiosInstance.get('clients', {
        params: {
          isActive: true,
          input: inputValue,
          page
        },
      })

      return data.items.map((item: any) => ({
        value: item.id,
        label: item.businessName,
      }))

    } catch (error) {
      console.error(error)
      return []
    }
  }

  const fetchBillingServices = async (inputValue: string, page: number) => { 
    try {
      const { data } = await axiosInstance.get('billing-service', {
        params: {
          input: inputValue,
        },
      })
      console.log("🚀 ~ fetchBillingServices ~ data:", data)

      return data.map((item: any) => ({
        value: item.id,
        label: item.name,
      }))

    } catch (error) {
      console.error(error)
      return []
    }
  }

  return (
    <CardBase className="container">
      <h2 className="mb-4 text-2xl font-semibold">Editar Venta</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) =>
          handleSubmit(values, setSubmitting)
        }
        enableReinitialize 
      >
        {({ isSubmitting, values , setFieldValue}) => (
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
                    fetchOptions={fetchClients}
                    selectedItem={selectedClient}
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
                  <Field name="hasHes">
                    {({ field }: { field: any}) => (
                      <Checkbox
                        isSelected={field.value}
                        onValueChange={(value) => setFieldValue(field.name, value)}
                        size="md"
                      >
                        Habilitar HES
                      </Checkbox>
                    )}
                  </Field>
                </div>
                {values.hasHes && (
                  <div className="col-span-1">
                    <Field name="hes" label="HES" component={InputBase} />
                  </div>
                )}
                <div className="col-span-2">
                  <Field
                    name="description"
                    label="Descripción"
                    component={
                      TextareaBase
                    }
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

                <div className="col-span-1">
                  <Field
                    name="serviceType"
                    placeholder="Buscar servicio..."
                    label="Servicio"
                    fetchOptions={fetchBillingServices}
                    selectedItem={selectedServiceName}
                    component={Select2}
                  />
                </div>
                <Field
                  name="currency"
                  label="Moneda"
                  component={SelectBase}
                  options={[
                    { label: 'Soles', value: 'SOLES' },
                    { label: 'Dólares', value: 'DOLARES' },
                  ]}
                />

                <Field
                  name="conversionRate"
                  label="Tipo de cambio"
                  component={InputBase}
                />

                <Field
                  name="status"
                  label="Estado"
                  component={SelectBase}
                  options={[
                    { label: 'Pendiente', value: 'PENDIENTE' },
                    { label: 'Cancelado', value: 'CANCELADO' },
                    { label: 'Anulado', value: 'ANULADO' },
                    { label: 'Factoring', value: 'FACTORING' },
                  ]}
                />

                <div className="col-span-2">
                  <AmountCalculated />
                </div>
              </section>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-0 border-green-500 md:border-t-2 pt-3 mt-3">
              <div className="grid grid-cols-1 gap-4">
                <h4>Depósito 1 ( Detracción ) </h4>
                <Field
                  name="depositDate"
                  label="Fecha de depósito"
                  component={DatePickerBase}
                />
                <ShowFieldDepositCurrency />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <h4>Depósito 2</h4>
                <Field
                  name="state2"
                  label="Estado"
                  component={SelectBase}
                  options={[
                    { label: 'Pendiente', value: 'PENDIENTE' },
                    { label: 'Cancelado', value: 'CANCELADO' },
                    { label: 'Anulado', value: 'ANULADO' },
                    { label: 'Factoring', value: 'FACTORING' },
                  ]}
                />
                <Field
                  name="depositDate2"
                  label="Fecha de emisión"
                  component={DatePickerBase}
                />
                <ShowFieldDepositCurrencyTwo />
              </div>
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
