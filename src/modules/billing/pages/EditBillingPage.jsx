import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import {
  CardBase,
  DatePickerBase,
  InputBase,
  SelectBase,
} from "../../../components/base";
import {
  ACCOUNT_TYPES_BACKEND,
  BANKS_BACKEND,
} from "../../../lib/consts/general";
import { Button, Textarea } from "@nextui-org/react";

export const EditBillingPage = () => {
  const [clientOptions, setClienteOptions] = useState([]); // get ?
  const [serviceOptions, setServiceOptions] = useState([]); // get ?
  const [documentTypeOptions, setDocumentTypeOptions] = useState([]); // get ?

  const [initialValues, setInitialValues] = useState({
    // year: '', // con el año y mes se calcula el periodo, no se si es importante mostrarlo
    // month: '',
    client: "", // jala el ruc
    document_type: "", // tabla tipos
    document_number: "",
    start_date: "",
    payment_deadline: "",
    service_id: "", // tabla de servicios
    description: "",
    purchase_order_number: "",
    currency: "", // enum dolares o soles,
    // amount: '',  // se calcula con el total y el igv
    // IGV: '', // se calcula con el total y el igv
    total: "", // por debajo se calcular la conversion en soles y dolares.
    // status: '', // enum pendiente, pagado, anulado al momento de crear es pendiente. luego en editar se podra cambiar segun el plazo de pago o simplemente anulado
    // fecha de vencimiento se calcula con el payment_deadline
    // dias acumulados es para la tabla de facturacion para saber la mora en caso que aun no se ha pagado, igual debe mostrarse ?
  });

  const validationSchema = Yup.object({
    bankName: Yup.string().required(),
    AccountType: Yup.string().required(),
    bankAccountNumber: Yup.string().required(),
    cci: Yup.string().required(),
  });

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
                    { label: "Soles", value: "PEN" },
                    { label: "Dólares", value: "USD" },
                  ]}
                />

                <div>Estado: Pendiente</div>

                <div className="col-span-1">
                  <div className="flex flex-col items-end justify-end">
                    <div className="mb-3">monto: __</div>
                    <div className="mb-3">igv: __</div>
                    <Field
                      name="total"
                      label="Total"
                      component={InputBase}
                      type="number"
                    />
                  </div>
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
  );
};
