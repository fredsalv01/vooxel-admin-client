import React, { useEffect, useMemo, useState } from "react";
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
  Divider,
} from "@nextui-org/react";
import { Formik, Form, Field } from "formik";
import {
  DatePickerBase,
  InputBase,
  SelectBase,
  InputTagBase,
  AutocompleteBase,
} from "../../../components/base";
import { useAsyncList } from "@react-stately/data";
import axios from "../../../axios/axios";
import { ToastNotification } from "../../../lib/helpers/toast-notification-temp";
import * as Yup from "yup";
import {
  BANKS_BACKEND,
  DOCUMENT_TYPES_BACKEND,
  ENGLISH_LEVEL_BACKEND,
  SENIORITY_BACKEND,
} from "../../../lib/consts/general";
import { useQueryPromise } from "../../../hooks/useQueryPromise";

export const EditWorkerModal = ({
  isOpen,
  onOpenChange,
  editItem,
  fetchData,
}) => {
  const [initialValues, setInitialValues] = useState({
    name: "",
    apPat: "",
    apMat: "",
    documentType: "",
    documentNumber: "",
    englishLevel: "",
    charge: "",
    birthdate: "",
    phoneNumber: "",
    address: "",
    district: "",
    province: "",
    department: "",
    familiarAssignment: "",
    techSkills: [],
    clientId: "",
    chiefOfficerId: "",
  });

  useEffect(() => {
    if (editItem) {
      console.log("🚀 ~ useEffect ~ editItem:", editItem);
      setInitialValues({
        ...initialValues,
        name: editItem?.name,
        apPat: editItem?.apPat,
        apMat: editItem?.apMat,
        email: editItem?.email,
        documentType: editItem?.documentType,
        documentNumber: editItem?.documentNumber,
        seniority: editItem?.seniority,
        startDate: editItem?.startDate,
        englishLevel: editItem?.englishLevel,
        charge: editItem?.charge,
        birthdate: editItem?.birthdate || "",
        phoneNumber: editItem?.phoneNumber,
        address: editItem?.address,
        district: editItem?.district,
        province: editItem?.province,
        department: editItem?.department,
        familiarAssignment: editItem?.familiarAssignment,
        techSkills: editItem?.techSkills,
        clientId: editItem?.clientInfo?.id.toString() || "",
        chiefOfficerId: editItem?.chiefOfficer?.id.toString() || "",
      });
    }
  }, []);

  const validationSchema = Yup.object({
    name: Yup.string().required(),
    apPat: Yup.string().required(),
    apMat: Yup.string().required(),
    documentType: Yup.string().required(),
    documentNumber: Yup.string()
      .when("documentType", {
        is: "Dni",
        then: (schema) => schema.length(8),
      })
      .when("documentType", {
        is: "Pasaporte",
        then: (schema) => schema.length(9),
      })
      .when("documentType", {
        is: "Carnet Extranjeria",
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
        "debe tener al menos 18 años",
      )
      .required(), // Assuming birthdate is a string, adjust if it's a date
    phoneNumber: Yup.string()
      .length(9)
      .matches(/^[0-9]+$/)
      .required(),
    address: Yup.string().required(),
    district: Yup.string().required(),
    province: Yup.string().required(),
    department: Yup.string().required(),
    familiarAssignment: Yup.string().required(),
    techSkills: Yup.array().of(Yup.string().required()).min(1).required(),
    clientId: Yup.string().required(),
    chiefOfficerId: Yup.string().required(),
    email: Yup.string().email().required(),
    seniority: Yup.string().required(),
    startDate: Yup.string().required(),
  });

  const handleSubmit = async (values, setSubmitting, onClose) => {
    console.log("🚀 ~ handleSubmit ~ values:", values);

    // if (!editItem?.chiefOfficer && !values.chiefOfficerId) {
    //     ToastNotification.showError('Agregar jefe de colaborador');
    //     return;
    // }

    // if (!editItem?.clientInfo && !values.clientId) {
    //     ToastNotification.showError('Agregar cliente de colaborador');
    //     return;
    // }

    delete values.id;
    delete values.isActive;
    try {
      setSubmitting(true);
      await axios.patch(`workers/${editItem.id}`, { ...values });
      ToastNotification.showSuccess("Colaborador actualizado correctamente");
      fetchData();
      onClose();
    } catch (error) {
      if (error.response.status === 400)
        ToastNotification.showError(error.response.data.message);
      else ToastNotification.showError("Error al crear el colaborador");
      console.log("Error", error);
    } finally {
      setSubmitting(false);
    }
  };

  const { data: clientsData } = useQueryPromise({
    url: "clients",
    key: "clients",
  });

  const computedClients = useMemo(() => {
    return (
      clientsData?.items.map((item) => ({
        label: item.businessName,
        value: item.id,
      })) || []
    );
  }, [clientsData]);

  const { data: chiefOfficerData } = useQueryPromise({
    url: "workers",
    key: "workers",
  });

  const computedChiefOfficerData = useMemo(() => {
    return (
      chiefOfficerData?.items.map((item) => ({
        label: `${item.name} ${item.apPat}`,
        value: item.id,
      })) || []
    );
  }, [chiefOfficerData]);

  // let listClients = useAsyncList({
  //     async load({ signal, filterText }) {
  //         const data = await axios.get('clients', { params: { input: filterText, isActive: true }, signal });
  //         return {
  //             items: data.data.items.map((item) => ({ id: item.id, label: item.businessName })) || [],
  //         };
  //     },
  // });

  // let listWokers = useAsyncList({
  //     async load({ signal, filterText }) {
  //         const data = await axios.get('workers', { params: { input: filterText, isActive: true }, signal });
  //         return {
  //             items: data.data.items.map((item) => ({ id: item.id, label: `${item.name} ${item.apPat}` })) || [],
  //         };
  //     },
  // });

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
                  Editar Colaborador
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
                          { label: "Sí", value: "SI" },
                          { label: "No", value: "NO" },
                        ]}
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

                  <Divider />

                  <div>
                    {/* {editItem.clientInfo && <div className='mb-2 ms-2'>
                                            <strong className='text-'>Cliente: </strong>  {editItem.clientInfo.businessName}
                                        </div>}
                                        <Autocomplete
                                            inputValue={listClients.filterText}
                                            isLoading={listClients.isLoading}
                                            items={listClients.items}
                                            label="Seleccionar cliente"
                                            placeholder="buscar cliente..."
                                            variant="bordered"
                                            name="clientId"
                                            onInputChange={(event) => {
                                                console.log("🚀 ~ EditWorkerModal ~ event:", event)
                                                listClients.setFilterText(event)
                                            }}
                                            allowsCustomValue={true}
                                            onSelectionChange={($event) => {
                                                setFieldValue('chiefOfficerId', $event);
                                            }}
                                        >
                                            {(item) =>
                                                <AutocompleteItem key={item.id} className="capitalize">
                                                    {item.label}
                                                </AutocompleteItem>
                                            }
                                        </Autocomplete> */}

                    <Field
                      name="clientId"
                      label="Cliente"
                      component={SelectBase}
                      options={computedClients}
                    />
                  </div>

                  <Divider />

                  <div>
                    <Field
                      name="chiefOfficerId"
                      label="Jefe"
                      component={SelectBase}
                      options={computedChiefOfficerData}
                    />
                    {/* {editItem.chiefOfficerId && <div className='mb-2 ms-2'>
                                            <strong className='text-'>Jefe: </strong>  {editItem.chiefOfficer.name}
                                        </div>}
                                        <Autocomplete
                                            inputValue={listWokers.filterText}
                                            isLoading={listWokers.isLoading}
                                            items={listWokers.items}
                                            label="Seleccionar colaborador"
                                            placeholder="buscar colaborador..."
                                            variant="bordered"
                                            name="chiefOfficerId"
                                            onInputChange={(event) => {
                                                listWokers.setFilterText(event)
                                            }}
                                            allowsCustomValue={true}
                                            onSelectionChange={($event) => {
                                                setFieldValue('chiefOfficerId', $event);
                                            }}
                                        >
                                            {(item) =>
                                                <AutocompleteItem key={item.id} className="capitalize">
                                                    {item.label}
                                                </AutocompleteItem>
                                            }
                                        </Autocomplete> */}
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
  );
};
