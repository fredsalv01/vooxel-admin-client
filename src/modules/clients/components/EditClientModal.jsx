import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  ModalFooter,
  DatePicker,
  Autocomplete,
  AutocompleteSection,
  AutocompleteItem,
} from "@nextui-org/react";
import { Formik, Form, Field, setIn } from "formik";
import { InputBase } from "../../../components/base";
import { useAsyncList } from "@react-stately/data";
import axios from "../../../axios/axios";
import { ToastNotification } from "../../../lib/helpers/toast-notification-temp";
import * as Yup from "yup";

export const EditClientModal = ({
  isOpen,
  onOpenChange,
  editItem,
  fetchData,
}) => {
  const [initialValues, setInitialValues] = useState({
    businessName: "",
    ruc: "",
    phone: "",
    email: "",
  });

  const validationSchema = Yup.object({
    businessName: Yup.string().required(),
    ruc: Yup.string().required(),
    phone: Yup.string().required(),
    email: Yup.string().required(),
  });

  useEffect(() => {
    setInitialValues({
      ...editItem,
      fullName: editItem.fullName || "",
      businessName: editItem.businessName || "",
      ruc: editItem.ruc || "",
      phone: editItem.phone || "",
      email: editItem.email || "",
    });
  }, []);

  const handleSubmit = async (values, setSubmitting, onClose) => {
    console.log("🚀 ~ handleSubmit ~ values:", values);
    delete values.id;
    try {
      setSubmitting(true);
      await axios.patch(`clients/${editItem.id}`, {
        ...values,
      });
      ToastNotification.showSuccess("Colaborador actualizado correctamente");
      fetchData();
      onClose();
    } catch (error) {
      console.log("Error", error);
      if (error.response.status === 400)
        ToastNotification.showError(error.response.data.message);
      else ToastNotification.showError("Error al crear el colaborador");
    } finally {
      setSubmitting(false);
    }
  };

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
                        name="email"
                        label="Correo electrónico"
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
  );
};
