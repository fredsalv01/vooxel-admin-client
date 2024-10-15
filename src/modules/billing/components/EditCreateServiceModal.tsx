import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  ModalFooter,
} from "@nextui-org/react";
import { Formik, Form, Field } from "formik";
import {
  InputBase,
} from "../../../components/base";
import * as Yup from "yup";
import axiosInstance from "../../../axios/axios";
import { ToastNotification } from '../../../lib/helpers/toast-notification-temp';

interface EditCreateServiceModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  fetchData: any;
}

type FormValues = {
  name: string;
}

interface HandleSubmitProps {
  values: FormValues;
  setSubmitting: (isSubmitting: boolean) => void;
  onClose: () => void;
}

export const EditCreateServiceModal: React.FC<EditCreateServiceModalProps> = ({
  isOpen,
  onOpenChange,
  fetchData,
}) => {


  const [initialValues, setInitialValues] = useState<FormValues>({
    name: "",
  });

  const validationSchema = Yup.object({
    name: Yup.string().required(),
  });

  const handleSubmit = async ({ values, setSubmitting, onClose }: HandleSubmitProps) => {
    console.log("🚀 ~ handleSubmit ~ values:", values);
    try {
      setSubmitting(true);
      await axiosInstance.post('billing-service', { ...values });
      ToastNotification.showSuccess('Cuenta creada correctamente');
      await fetchData();
      onClose();
    } catch (error: any) {
      if (error.response.status === 400) ToastNotification.showError(error.response.data.message);
      else ToastNotification.showError();
      console.log('Error', error);
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
              handleSubmit({values, setSubmitting, onClose})
            }
            enableReinitialize
          >
            {/* props Formik */}
            {({
              isSubmitting,
              errors,
              handleChange,
              values,
              setFieldValue,
            }) => (
              <Form className="grid overflow-y-auto" autoComplete="off">
                <ModalHeader className="text-2xl">
                  Crear Servicio
                </ModalHeader>
                <ModalBody>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="col-span-1">
                      <Field
                        name="name"
                        label="Nombre del servicio"
                        component={InputBase}
                      />
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter className="flex justify-end">
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
